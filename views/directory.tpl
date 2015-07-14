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
		  <img src="/static/images/folder.png" style="width:1.5em;height:1.5em"/>
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
