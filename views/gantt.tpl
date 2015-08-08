<html>
  <head>
    <title>gantt</title>
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
        <div class="gantt-container">
            <div class="detail-table sub-container">
                <div class="table-header">
                    <table>
                        <tr>
                            <th>owner</th>
                            <th>taskName</th>
                        </tr>
                    </table>
                </div>
                <div class="table-body">
                    <table>
                        \<% _.each(tasks, function(task){%>
                            <tr>
                                <td><%= task.owner %></td>
                                <td class="ellipsis" title="<%= task.taskName %>"><%= task.taskName %></td>
                            </tr>
                        \<%});%>
                    </table>
                </div>
            </div>
            <div class="gantt-area sub-container">
                <!-- draw background -->
                <div class="table-header">
                    <table>
                        <tr>
                            \<%_.each(dates, function(date){%>
                                <th><%= date.name %></th>
                            \<%});%>
                        </tr>
                    </table>
                </div>
                <div class="table-body">
                    <table>
                        \<%_.each(tasks, function(){%>
                            <tr>
                                \<%_.each(dates, function(date){%>
                                    <td class="<%if(date.weekend){%>weekend<%}%>"></td>
                                \<%});%>
                            </tr>
                        \<%});%>
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
