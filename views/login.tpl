<html>
  <head>
    % include('head')
  </head>
  <body>
    <div class="container layout-middle col-md-4 col-md-offset-4">
        <form action="/login" method="POST" class="form">
            <h1 class="text-center">Yash</h1>
            <div class="form-group">
                <label>Username:</label>
                <input type="text" class="form-control input-lg" name="username" />
            </div>
            <div class="form-group">
                <label>Password:</label>
                <input type="password" class="form-control input-lg" name="password" />
            </div>
            <button type="submit" class="btn btn-primary btn-lg center-block">Login</button>
        </form>
    </div>
    </body>
</html>
