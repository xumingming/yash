#!/usr/bin/env python
import os, sys, codecs, re
import markdown2 as markdown
from bottle import route, run, template, static_file, get, view, request

LINK_PATTERNS = [(re.compile(r'((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+(:[0-9]+)?|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)'),r'\1')]
MDSERVER_HOME = None

def listdir(fullpath, relativepath):
    ret = []
    ret.append("<ul>")
    for item in os.listdir(fullpath):
        ret.append("<li><a href='" + relativepath + "/" + item + "'>" + item + "</a></li>")
    ret.append("</ul>")
    return "\n".join(ret)

def get_common_header(request_path):
    parent_path = request_path
    last_index = parent_path.rfind("/")
    if last_index >= 0:
        parent_path = parent_path[0:last_index]

    if parent_path == "":
        parent_path = "/"
        
    common_header = """
<div>
    <a href="/">Home</a>
    <a href="%s">Up</a>
</div>
""" % parent_path

    return common_header

@get('/<filename:re:.*\.png>')
def images(filename):
    if filename.startswith("images/"):
        filename = filename[len("images/"):]

    print "filename: ", filename
    return static_file(filename, root='images')

@get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root=MDSERVER_HOME + "/css")
        
@route('/<filename:re:.*\.markdown>')
@route('/<filename:re:.*\.md>')
def markdown_files(filename):
    fullpath = os.getcwd() + "/" + filename
    input_file = codecs.open(fullpath, mode="r", encoding="utf-8")
    text = input_file.read()

    heads = """
<link rel="stylesheet" href="/markdown.css">
<link rel="stylesheet" href="/zenburn.css">
<style>
    .markdown-body {
        min-width: 200px;
        max-width: 790px;
        margin: 0 auto;
        padding: 30px;
    }
</style>
%s
<article class="markdown-body">
""" % get_common_header(request.path)

    tails = """
</article>
""" 
    
    html = markdown.markdown(text, extras=["tables", "code-friendly", "fenced-code-blocks", "link-patterns"], link_patterns = LINK_PATTERNS)
    return "\n".join([heads, html, tails])

@route('/<filename:re:.*>')
def directories(filename):
    fullpath = os.getcwd() + "/" + filename

    html = listdir(fullpath, filename)
    header = get_common_header(request.path)

    return "\n".join([header, html])
    
    
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print """Usage: mdserver.py <MDSERVER_HOME>"""
    else:
        MDSERVER_HOME =sys.argv[1]
        run(host='localhost', port=8080, reloader=True)
