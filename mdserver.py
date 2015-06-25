#!/usr/bin/env python
#-*-encoding: utf-8 -*-

import os, sys, codecs, re
import markdown2 as markdown
import bottle
from bottle import route, run, template, static_file, get, view, request, TEMPLATE_PATH
from search import Search

LINK_PATTERNS = [(re.compile(r'((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+(:[0-9]+)?|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)'),r'\1')]
MDSERVER_HOME = None
SHOW_HEADER = True
TEMPLATE_PATH = [os.path.join(os.getcwd(), "views")]

@get('/<filename:re:.*\.png>')
def images(filename):
    if filename.startswith("images/"):
        filename = filename[len("images/"):]

    return static_file(filename, root = os.path.join(os.getcwd(), 'images'))

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
    return dict(results = result, keyword = keyword, request = request, show_header = SHOW_HEADER)


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

    return dict(html = html, request = request, show_header = SHOW_HEADER)

def home():
    if os.path.exists(os.getcwd() + "/index.md"):
        return markdown_files("index.md")

    if os.path.exists(os.getcwd() + "/index.markdown"):
        return markdown_files("index.markdown")

def has_index():
    return os.path.exists(os.getcwd() + "/index.md") or os.path.exists(os.getcwd() + "/index.markdown")

@route('/<filename:re:.*>')
@view('directory')
def directories(filename):
    fullpath = os.getcwd() + "/" + filename
    if filename == "" and has_index():
        return home()
            
    return dict(files = os.listdir(fullpath), relativepath = filename, request = request, show_header = SHOW_HEADER)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print """Usage: mdserver.py <MDSERVER_HOME>"""
    else:
        MDSERVER_HOME = sys.argv[1]
        bottle.TEMPLATE_PATH = [os.path.join(MDSERVER_HOME, "views")]
        if len(sys.argv) > 2:
            SHOW_HEADER = False
            
        run(host='localhost', port=8000)
