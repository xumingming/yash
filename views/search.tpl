% include('header.tpl')
<ul>
	% for file_and_items in results:
	<%
		filepath = file_and_items[0]
		items = file_and_items[1]
	%>
	<li>
	  <div>
		<a href="{{filepath}}">{{filepath}}</a>
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
