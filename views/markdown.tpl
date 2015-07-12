<html>
  <head>
    % include('head')
	<link rel="stylesheet" href="css/markdown.css">
	<link rel="stylesheet" href="css/zenburn.css">
	<style>
      .markdown-body {
      min-width: 200px;
      max-width: 790px;
      margin: 0 auto;
      padding: 30px;
      }
	</style>
  </head>
  % include('header')
  <div class="container">
      <article class="markdown-body">
        {{ !html }}
      </article>
  </div>
</html>
