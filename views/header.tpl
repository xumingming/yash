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
          <a class="navbar-brand" href="/">Yash</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            % if not is_logined:
                <li><a href="/login">Login</a></li>
            % else:
                <li><a href="/logout">Logout</a></li>
            % end
			<li class="J-popover" data-placement="bottom" data-trigger="hover" data-html="true" data-toggle="popover" data-content="<img src='/system/qr.png?path={{ request.url }}' style='width:150px;height:150px'>"><a>QR Code</a></li>
          </ul>
          <form class="navbar-form navbar-left" role="search" action="/search" method="GET">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search" name="w">
            </div>
            <button type="submit" class="btn btn-default">Search</button>
          </form>		  
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
% if defined("breadcrumbs") and len(breadcrumbs) > 0:
	<ol class="breadcrumb">
		% for idx, breadcrumb in enumerate(breadcrumbs):
		  %if idx < len(breadcrumbs) - 1:
			  <li><a href="{{breadcrumb.path}}">{{breadcrumb.name}}</a></li>
	      %else:
		  	  <li class="active">{{breadcrumb.name}}</li>
		  %end
		% end  
	</ol>
% end
</div>


% end

