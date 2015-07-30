# yash

Yet another `SimpleHttpServer`.

This little script works very similar with `python -m SimpleHTTPServer`, but it provides much more! 

## Install

    sudo pip install markdown2
    sudo pip install bottle
	sudo pip install beaker
	sudo pip install simpleyaml
	sudo pip install qrcode
	sudo pip install pillow	
	git clone git@github.com:xumingming/yash.git
	cd yash
	chmod a+x yash.py
	mkdir ~/.yash

edit `~/.yash/config.yaml` and fill it with the following:

```yaml
roles:
  home:
    - home
    - public

users:
    yash:
      password: yash
      role: super
    demo:
      password: demo
      role: public
```

## Usage

Put the following in your `.bashrc`:

```bash
alias yash='sudo /path/to/your/yash.py -p 80'
```

Now in any folder you want to serve your files, just run `yash`, then visit `http://localhost`, that's it!

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
