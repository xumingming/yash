% if not request.GET.get('show_header') == 'false':
<div>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        % if defined("breadcrumbs") and len(breadcrumbs) > 0:
	    <ol class="breadcrumb" style="float:left;position:relative;top:10px">
		  %for idx, breadcrumb in enumerate(breadcrumbs):
		  %if idx < len(breadcrumbs) - 1:
			        <li><a href="{{breadcrumb.path}}">{{breadcrumb.name}}</a></li>
          %else:
		  <li class="active">{{breadcrumb.name}}</li>
		  %end
		  %end
	    </ol>
        %end

        <ul class="nav navbar-nav" style="float:right">
          <form class="navbar-form navbar-left" role="search" action="/search" method="GET">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search" name="w">
            </div>
            <button type="submit" class="btn btn-default">Search</button>
          </form>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
  </nav>
</div>
% end
