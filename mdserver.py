#!/usr/bin/env python
#-*-encoding: utf-8 -*-

import os, sys, codecs, re
import markdown2 as markdown
import bottle
from bottle import route, run, template, static_file, get, post, view, request, response, TEMPLATE_PATH, Bottle, hook, redirect
import beaker.middleware
from search import Search
import simpleyaml

MDSERVER_HOME = None
TEMPLATE_PATH = [os.path.join(os.getcwd(), "views")]
MDSERVER_DATA_HOME = os.path.expanduser("~/.mdserver")

session_opts = {
    'session.type': 'file',
    'session.data_dir': MDSERVER_DATA_HOME + '/session/',
    'session.auto': True,
}

app = beaker.middleware.SessionMiddleware(bottle.app(), session_opts)

roles_config = simpleyaml.safe_load(open(MDSERVER_DATA_HOME + "/config.yaml"))["roles"]

def session_get(key):
    session = bottle.request.environ.get('beaker.session')
    return session.get(key)

def session_set(key, value):
    session = bottle.request.environ.get('beaker.session')

    session[key] = value
    session.save()

def session_get_role():
    return session_get("user").role

def post_get(name, default=''):
    return bottle.request.POST.get(name, default).strip()    

def is_logined():
    return not session_get("user") is None
    
@hook('before_request')
def auth_hook():
    # everyone can access "/public"
    if request.path.startswith("/public") or request.path == "/":
        return

    # role based authentication
    if (not request.path in ["/login", "/not-authorized", "/logout"]) and not request.path.endswith(".css"):
        if not is_logined():
            redirect("/login")

        role = session_get_role()
        # super user can access anything
        if role == "super":
            return
        
        valid_paths = roles_config[role]
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

def get_config():
    return simpleyaml.safe_load(open(MDSERVER_DATA_HOME + "/config.yaml"))

def get_users_config():
    return get_config()["users"]

def get_roles_config():
    return get_config()["roles"]

def is_valid_login(username, password):
    users = get_users_config()
    return username in users and users[username]['password'] == password

class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role
        
@post("/login")
def login_post():
    username = request.forms.get("username")
    password = request.forms.get("password")

    if is_valid_login(username, password):
        role = get_users_config()[username]["role"]
        user = User(username, role)
        session_set("user", user)
        redirect("/")
    else:
        redirect("/login")

@get("/logout")
@view("logout")
def logout():
    session_set("user", None)
    redirect("/login")

@get('/<filename:re:.*\.(png|jpg|gif|ico)>')
def images(filename):
    return static_file(filename, root = os.getcwd())

@get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root=MDSERVER_HOME + "/css")

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
        files = [x for x in files if x in roles_config[role]]
        
    filemap = []
    for f in files:
        fullpath = os.getcwd() + relativepath + "/" + f
        name = f
        if os.path.isdir(fullpath):
            namepath = fullpath + "/.name"
            if os.path.exists(namepath):
                name = extract_file_title(namepath)
        elif f.endswith(".markdown") or f.endswith(".md") or f.endswith(".txt"):
            name = extract_file_title(fullpath)

        filemap.append([name, f])
            

    return dict(filemap = filemap, relativepath = relativepath, request = request)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print """Usage: mdserver.py <MDSERVER_HOME>"""
    else:
        MDSERVER_HOME = sys.argv[1]
        bottle.TEMPLATE_PATH = [os.path.join(MDSERVER_HOME, "views")]

        bottle.run(app = app, host='0.0.0.0', port=80)
