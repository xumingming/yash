#!/usr/bin/env python
#-*-encoding: utf-8 -*-

import os, sys, codecs, re
import markdown2 as markdown
import bottle
from bottle import route, run, template, static_file, get, post, view, request, response, TEMPLATE_PATH, Bottle, hook, redirect
import beaker.middleware
from search import Search
import simpleyaml
import qrcode
import StringIO

MDSERVER_HOME = None
TEMPLATE_PATH = [os.path.join(os.getcwd(), "views")]
MDSERVER_DATA_HOME = os.path.expanduser("~/.mdserver")

session_opts = {
    'session.type': 'file',
    'session.data_dir': MDSERVER_DATA_HOME + '/session/',
    'session.auto': True,
}

app = beaker.middleware.SessionMiddleware(bottle.app(), session_opts)

class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role

class Role:
    def __init__(self, name, dirs):
        self.name = name
        self.dirs = dirs

class Config:
    def __init__(self):
        config = simpleyaml.safe_load(open(MDSERVER_DATA_HOME + "/config.yaml"))
        self.roles = config["roles"]
        self.roles["public"] = ["public"]
        
        self.users = config["users"]

    def authenticate(self, username, password):
        return username in self.users and self.users[username]['password'] == password

    def get_role_by_username(self, username):
        user = self.users[username]
        if not user:
            return "public"
        else:
            return user["role"]

    def get_dirs_by_role(self, role):
        return self.roles[role]

    def has_right(self, role, folder):
        return folder in self.roles[role]

    def is_login_required(self, url):
        staticFilePattren = '\.(:?js|css)$'
        return (not url in ["/login", "/not-authorized", "/logout"]) and not re.search(staticFilePattren, url)
    
config = Config()

class RoleConfig:
    def __init__(self, roles):
        self.roles = roles

def session_get(key):
    session = bottle.request.environ.get('beaker.session')
    return session.get(key)

def session_set(key, value):
    session = bottle.request.environ.get('beaker.session')

    session[key] = value
    session.save()

def session_get_role():
    user = session_get("user")
    if not user:
        return "public"
    return user.role

def post_get(name, default=''):
    return bottle.request.POST.get(name, default).strip()    

def is_logined():
    return not session_get("user") is None

@hook('before_request')
def auth_hook():
    # everyone can access "/public"
    if request.path.startswith("/public") or request.path == "/":
        return

    staticFilePattren = '\.(:?js|css)$'
    # role based authentication
    if config.is_login_required(request.path):
        if not is_logined():
            redirect("/login")

        role = session_get_role()
        # super user can access anything
        if role == "super":
            return
        
        valid_paths = config.get_dirs_by_role(role)
        for p in valid_paths:
            if request.path.startswith("/" + p + "/") or request.path == "/" + p:
                return

        redirect("/not-authorized")
        
@get("/not-authorized")
def not_authorized():
    return "Access Denied!"

@get("/login")
@view("login")
def login():
    return dict()

@post("/login")
def login_post():
    username = request.forms.get("username")
    password = request.forms.get("password")

    if config.authenticate(username, password):
        role = config.get_role_by_username(username)
        user = User(username, role)
        session_set("user", user)
        redirect("/")
    else:
        redirect("/login")

@get("/logout")
@view("logout")
def logout():
    session_set("user", None)
    redirect("/")

@get ("/")
# direct to login if not logined
def checkLogin():
    if not is_logined():
        redirect("/login")
    else:
        return directories("")

@get('/<filename:re:static\/.*\.(css|js|png|jpg|gif|ico)>')
def static_files(filename):
    return static_file(filename, root=MDSERVER_HOME + "/")

@get('/<filename:re:.*\.(png|jpg|gif|ico)>')
def images(filename):
    return static_file(filename, root = os.getcwd())

@route('/search')
@view('search')
def search_files():
    keyword = request.GET.get('w')
    if len(keyword) > 0:
        keyword = keyword.strip()
        
    s = Search(os.getcwd(), keyword.decode("utf-8"), ("*.markdown", "*.md"))
    result = s.walk()

    result = [x for x in result if x[1] is not None]
    result = map(lambda x : [x[0][len(os.getcwd()):len(x[0])], x[1]], result)
    return dict(results = result, keyword = keyword, request = request)


@route('/<filename:re:.*\.markdown>')
@route('/<filename:re:.*\.md>')
@view('markdown')
def markdown_files(filename):
    fullpath   = os.getcwd() + "/" + filename
    input_file = codecs.open(fullpath, mode="r", encoding="utf-8")
    text       = input_file.read()

    html = markdown.markdown(
        text,
        extras        = ["tables", "code-friendly", "fenced-code-blocks"]
    )

    return dict(html = html, request = request)

def home():
    if os.path.exists(os.getcwd() + "/index.md"):
        return markdown_files("index.md")

    if os.path.exists(os.getcwd() + "/index.markdown"):
        return markdown_files("index.markdown")

def has_index():
    return os.path.exists(os.getcwd() + "/index.md") or os.path.exists(os.getcwd() + "/index.markdown")

def extract_file_title(fullpath):
    input_file = codecs.open(fullpath, mode="r", encoding="utf-8")
    name       = input_file.readline()
    name       = name.strip("#")
    input_file.close()

    return name

@get('/<filename:re:.*\.qr>')
def get_qrcode(filename):
    actual_path = request.url[0:-3]
    qrcode_img = qrcode.make(actual_path)

    response.content_type = 'image/png'
    buf = StringIO.StringIO()
    qrcode_img.save(buf, "PNG")
    contents = buf.getvalue()
    return contents

@route('/<filename:re:.*\.xml>')
def xml_files(filename):
    fullpath   = os.getcwd() + "/" + filename
    input_file = codecs.open(fullpath, mode="r", encoding="utf-8")
    text       = input_file.read()
    response.content_type = "text/xml"
    return text

@route('/<filename:re:.*>')
@view('directory')
def directories(filename):
    fullpath = os.getcwd() + "/" + filename
    if filename == "" and has_index():
        return home()

    relativepath = "/" + filename + "/"
    if len(filename) == 0:
        relativepath = "/"

    files = os.listdir(fullpath)
    files = [x for x in files if not x.startswith(".")]

    role = session_get_role()
    if relativepath == "/" and not role == "super":
        files = [x for x in files if config.has_right(role, x)]
        
    filemap = []
    for f in files:
        fullpath = os.getcwd() + relativepath + "/" + f
        name = f
        is_dir = False
        if os.path.isdir(fullpath):
            is_dir = True
            namepath = fullpath + "/.name"
            if os.path.exists(namepath):
                name = extract_file_title(namepath)
        elif f.endswith(".markdown") or f.endswith(".md") or f.endswith(".txt"):
            name = extract_file_title(fullpath)

        filemap.append([name, f, is_dir])
            

    return dict(filemap = filemap, relativepath = relativepath, request = request)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print """Usage: mdserver.py <MDSERVER_HOME>"""
    else:
        MDSERVER_HOME = sys.argv[1]
        bottle.TEMPLATE_PATH = [os.path.join(MDSERVER_HOME, "views")]

        bottle.run(app = app, host='0.0.0.0', port=80)
