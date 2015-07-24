<html>
  <head>
    % include('head')
  </head>
  <body>
    % include('header')

    <div class="container">
      <ul class="list-group">
        % for file in filemap:
        <li class="list-group-item">
		  % if file[2]:
		  <i class="glyphicon glyphicon-folder-close"></i>
		  % else:
          <i class="glyphicon glyphicon-file"></i>
          % end
          <a href="{{ relativepath }}{{ file[1] }}">
			{{ file[0] }}
		  </a>
        </li>
        % end
      </ul>
    </div>
  </body>
</html>
