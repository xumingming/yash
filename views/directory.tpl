<html>
  <head>
    % include('head')
  </head>
  <body>
    <div class="container">
    % include('header')

    <ul class="list-group">
      % for file in filemap:
      <li class="list-group-item">
          <a href="{{ relativepath }}{{ file[1] }}">{{ file[0] }}</a>
      </li>
      % end
    </ul>
    </div>
  </body>
</html>
