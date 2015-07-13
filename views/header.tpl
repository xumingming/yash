<%
    parent_path = request.path
    last_index = parent_path.rfind("/")
    if last_index >= 0:
        parent_path = parent_path[0:last_index]
	end
	
    if parent_path == "":
        parent_path = "/"
	end
%>
% if not request.GET.get('show_header') == 'false':
<div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">MdServer</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><a href="/">Home<span class="sr-only">(current)</span></a></li>
            <li><a href="{{ parent_path }}">Up</a></li>
            <li><a href="/logout">Logout</a></li>
			<li><a href="{{request.url}}.qr">QR Code</a></li>
          </ul>
          <form class="navbar-form navbar-left" role="search" action="/search" method="GET">
            <div class="form-group">
              <input type="text" class="form-control" autofocus placeholder="Search" name="w">
            </div>
            <button type="submit" class="btn btn-default">Search</button>
          </form>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
</div>
% end

