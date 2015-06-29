#!/usr/bin/env python
#-*-encoding: utf-8 -*-

import os, sys, codecs, re
import markdown2 as markdown
import bottle
from bottle import route, run, template, static_file, get, view, request, TEMPLATE_PATH
from search import Search

LINK_PATTERNS = [(re.compile(r'((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+(:[0-9]+)?|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)'),r'\1')]
MDSERVER_HOME = None
TEMPLATE_PATH = [os.path.join(os.getcwd(), "views")]

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
        extras        = ["tables", "code-friendly", "fenced-code-blocks", "link-patterns"],
        link_patterns = LINK_PATTERNS
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
            
        run(host='localhost', port=8000)
