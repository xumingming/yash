<html>
  <head>
    % include('head')
    <link rel="stylesheet" href="/static/dist/styles/gantt.css">
  </head>
  <body>
  % include('header')
  <div class="container">
      <div class="filter-container">
        责任人:
        <select id="filterByMan">
          <option value="">All</option>
          %for man in project.mans:
              %if selected_man == man.encode("utf-8"):
                  <option selected>{{man}}</option>
              %else:
                  <option>{{man}}</option>
              %end
          %end
        </select>
      </div>

      <div id="tabs">
        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
          <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">计划</a></li>
          <li role="presentation"><a href="#summary" aria-controls="profile" role="tab" data-toggle="tab">统计信息</a></li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
          <div class="mygantt tab-pane active" id="home" role="tabpanel">
          </div>
          <div role="tabpanel" class="tab-pane" id="summary">
            <div>
              <table data-toggle="table">
                <tr>
                  <td>责任人</td>
                  <td>已完成人日</td>
                  <td>总人日</td>
                  <td>总进度</td>
                </tr>
                <%
                    finished_man_days = 0                
                    total_man_days = 0
                %>
                %for man, stats in man_stats.iteritems():
                <%
                   finished_man_days += stats[0]
                   total_man_days += stats[1]

                   current_man_progress = stats[0] * 100 / stats[1]
                   current_man_progress = "%.2f" % (current_man_progress)
                %>
                <tr>
                  <td>{{man}}</td>
                  <td>{{stats[0]}}</td>
                  <td>{{stats[1]}}</td>
                  <td>
                    <div class="progressbar-container" data-progress="{{current_man_progress}}">
                      <div class="progressbar">
                      </div>
                    </div>
                  </td>
                </tr>
                %end
                <%
                   total_prgress = 0
                   if total_man_days > 0:
                       total_progress = finished_man_days * 100 / total_man_days

                   total_progress = "%.2f" % (total_progress)
                %>
                <tr>
                  <td>总计</td>
                  <td>{{finished_man_days}}</td>
                  <td>{{total_man_days}}</td>
                  <td>
                    <div class="progressbar-container" data-progress="{{total_progress}}">
                      <div class="progressbar">
                      </div>
                    </div>
                  </td>
                </tr>
            </div>
          </div>
        </div>
      </div>

  </div>
    <script>
        var data = {{ !html }}
    </script>
    <script type="text/template" id="__TEMPLATE__gantt">      
        <div class="gantt-container">
            <div class="detail-table sub-container">
                <div class="table-body">
                    <table>
                        <thead>
                            <tr>
                                <th class="name">任务名称</th>
                                <th class="owner">责任人</th>
                                <th class="start">开始时间</th>
                                <th class="end">结束时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            \<% _.each(tasks, function(task){%>
                                <tr>
                                    <td class="ellipsis name" title="<%= task.taskName %>"><%= task.taskName %></td>
                                    <td class="owner"><%= task.owner %></td>
                                    <td class="start"><%= task.start %></td>
                                    <td class="end"><%= task.end %></td>
                                </tr>
                            \<%});%>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="gantt-area sub-container">
                <div class="table-body">
                    <div class="gantt">
                        \<%_.each(tasks, function(task){%>
                            <div>
                                <span></span>
                            </div>
                        \<%});%>
                    </div>
                    <!-- draw background -->
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
                </div>
            </div>
        </div>
    </script>
    % include('footer')
    <script src="/static/lib/underscore/1.8.3/underscore-min.js"></script>
    <script src="/static/dist/scripts/gantt.js"></script>
  </body>
</html>
