<html>
  <head>
    % include('head')
	<link rel="stylesheet" href="/static/css/markdown.css">
	<link rel="stylesheet" href="/static/css/zenburn.css">
  </head>
  <body>
  % include('header')
  <div class="container" style="width:99%">
      <article class="markdown-body">
        {{ !html }}
      </article>
  </div>
    % include('footer')
  </body>
</html>
