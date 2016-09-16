# Dev Guide

## Front end

nodejs, and bower are neccessary, you should install them first, then run the commands below in the root path of yash.

```
bower install
npm install
```

Then still in the root path of yash, run command below:

```
grunt browserify
grunt less
grunt watch
```

That's all, you can find js in '/static/src/scripts/', and less in '/static/src/styles/'. What's less? Oh, come on, the MagicPortal here [lesscss.org](http://lesscss.org/)!

![snapshot](snapshot.png)
