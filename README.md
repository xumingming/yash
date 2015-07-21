# Makedown Server

Host your local markdown files as webpages.

This little script works very similar with `python -m SimpleHTTPServer`, but it supports markdown files, all files with `.markdown` or `.md` extensions will be served as corresponding HTML webpages, and the pages are beautified with github markdown stylesheet(thanks to https://github.com/sindresorhus/github-markdown-css).

## Install

    sudo pip install markdown2
    sudo pip install bottle
	sudo pip install beaker
	sudo pip install simpleyaml
	sudo pip install qrcode
	git clone git@github.com:xumingming/mdserver.git
	cd mdserver
	chmod a+x mdserver.py

## Usage

Put the following in your `.bashrc`:

```bash
alias mdserver='sudo /path/to/your/mdserver.py -p 80'
```

Now in any folder you want to serve your files, just run `mdserver`, then visit `http://localhost`, that's it!

## Features

* File searching
* List files of a dir
* A simple username/password authentication.
* A simple role based content filtering
* Every page has it's own QR code(for easy sharing of the page url)
* Support the following file types:
  * txt
  * images(jpg, png, gif)
  * markdown
  * plan files(checkout [pyscheduler spec](https://github.com/xumingming/pyscheduler/blob/master/spec.md) for details)
  
![snapshot](snapshot.png)
