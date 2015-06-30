<html>
  <head>
	<link rel="stylesheet" href="list.css" />
  </head>
  <body>
	% include('header')

	<ul>
	  % for file in filemap:
  	  <li><a href="{{ relativepath }}{{ file[1] }}">{{ file[0] }}</a></li>
      % end
	</ul>
  </body>
</html>
