<html>
  <head>
    % include('head')
    <link rel="stylesheet" href="/static/dist/styles/gantt.css">
  </head>
  <body>
  % include('header')
  <div class="container">
  </div>
    <script>
        var data = {{ !html }}
    </script>
    <script type="text/template" id="__TEMPLATE__gantt">
      <form action="/">
        责任人:
        <select id="filterByMan">
          <option value="All">All</option>
          %for man in project.mans:
              %if selected_man == man.encode("utf-8"):
                  <option selected>{{man}}</option>
              %else:
                  <option>{{man}}</option>
              %end
          %end
        </select>
      </form>
        <div class="gantt-container">
            <div class="detail-table sub-container">
                <div class="table-body">
                    <table>
                        <thead>
                            <tr>
                                <th>任务名称</th>
                                <th>责任人</th>
                                <th>开始时间</th>
                                <th>结束时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            \<% _.each(tasks, function(task){%>
                                <tr>
                                    <td class="ellipsis" title="<%= task.taskName %>"><%= task.taskName %></td>
                                    <td><%= task.owner %></td>
                                    <td><%= task.start %></td>
                                    <td><%= task.end %></td>
                                </tr>
                            \<%});%>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="gantt-area sub-container">
                <!-- draw background -->
                <div class="table-body">
                    <table>
                        <thead>
                            <tr>
                                \<%_.each(dates, function(date){%>
                                    <th<%if(date.isWeekend){%> class="weekend"<%}%>><%= date.name %></th>
                                \<%});%>
                            </tr>
                        </thead>
                        <tbody>
                            \<%_.each(tasks, function(){%>
                                <tr>
                                    \<%_.each(dates, function(date){%>
                                        <td class="<%if(date.isWeekend){%>weekend<%}%>"></td>
                                    \<%});%>
                                </tr>
                            \<%});%>
                        </tbody>
                    </table>
                    <div class="gantt">
                        \<%_.each(tasks, function(task){%>
                            <div></div>
                        \<%});%>
                    </div>
                </div>
            </div>
        </div>
    </script>
    % include('footer')
    <script src="/static/lib/underscore/1.8.3/underscore-min.js"></script>
    <script src="/static/dist/scripts/gantt.js"></script>
  </body>
</html>
