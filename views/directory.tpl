<html>
  <head>
    % include('head')
  </head>
  <body>
    % include('header')

    <div class="container">
      <ul class="list-group">
        % for file in files:
        <li class="list-group-item">
		  % if file.is_dir:
		  <i class="glyphicon glyphicon-folder-close"></i>
		  % else:
          <i class="glyphicon glyphicon-file"></i>
          % end
          <a href="{{ relativepath }}{{ file.path }}" alt="{{file.path}}">
			{{ file.name }}
		  </a>
        </li>
        % end
      </ul>
    </div>
    % include('footer')
  </body>
</html>
