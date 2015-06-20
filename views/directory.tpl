% include('header')
<ul>
	% for file in files:
  	<li><a href="{{ relativepath }}/{{ file }}">{{ file }}</a></li>
    % end
</ul>