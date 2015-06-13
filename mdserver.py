#!/usr/bin/env python
import markdown2 as markdown
import codecs
from bottle import route, run, template, static_file, get, view, request
import os, sys

MDSERVER_HOME = None

def listdir(fullpath, relativepath):
    ret = []
    ret.append("<ul>")
    for item in os.listdir(fullpath):
        ret.append("<li><a href='" + relativepath + "/" + item + "'>" + item + "</a></li>")
    ret.append("</ul>")
    print ret
    return ret
    
@get('/<filename:re:.*\.png>')
def images(filename):
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
<article class="markdown-body">
"""

    tails = """
</article>
"""
    html = markdown.markdown(text, extras=["tables", "code-friendly", "fenced-code-blocks"])
    return "\n".join([heads, html, tails])

@route('/<filename:re:.*>')
def directories(filename):
    fullpath = os.getcwd() + "/" + filename
    return listdir(fullpath, filename)
    
    
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print """Usage: mdserver.py <MDSERVER_HOME>"""
    else:
        MDSERVER_HOME =sys.argv[1]
        run(host='localhost', port=8080, reloader=True)
