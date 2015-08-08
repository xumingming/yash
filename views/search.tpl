<html>
  <head>
    % include('head')
  </head>
  <body>	
	% include('header.tpl')
	<ul>
	  % for file_and_items in results:
	  <%
		 filepath = file_and_items.fullpath
		 items = file_and_items.items
		 %>
	  <li>
		<div>
		  <a href="{{filepath}}">{{file_and_items.name}}</a>
		  <ul>
			% for item in items:
			<li>
			  {{ item.prefix }} <span style="background-color:yellow">{{ keyword }}</span> {{ item.suffix }}
			</li>
			% end
		  </ul>
		</div>
	  </li>
	  % end
	</ul>
    % include('footer')
  </body>
</html>
