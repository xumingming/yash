<html>
  <head>
    <title>gantt</title>
    % include('head')
  </head>
  <body>
  % include('header')
  <div class="container">
        <script>
            var data = {{ !html }}
            console.log(data);
        </script>
  </div>
    % include('footer')
  </body>
</html>
