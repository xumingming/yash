"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // static/src/scripts/utils.js
  var require_utils = __commonJS({
    "static/src/scripts/utils.js"(exports, module) {
      "use strict";
      var utils2 = {
        datetime: {
          getRangeDays: function(start, end) {
            var ONE_DAY_TIME = 1e3 * 3600 * 24, startTime = new Date(start).getTime(), endTime = new Date(end).getTime();
            if (endTime < startTime) {
              throw new Error("end date should not be earlier than begin date");
            }
            return (endTime - startTime) / ONE_DAY_TIME;
          },
          listDates: function(start, end) {
            var startTime = new Date(start), endTime = new Date(end), dateList = [], currDate = startTime, formatDate = function(date) {
              return "YYYY-MM-dd".replace("YYYY", date.getFullYear()).replace("MM", utils2.format.fillIn(date.getMonth() + 1, 2, "0")).replace("dd", utils2.format.fillIn(date.getDate(), 2, "0"));
            };
            while (currDate < endTime) {
              dateList.push(formatDate(currDate));
              currDate = utils2.datetime.addDay(currDate, 1);
            }
            dateList.push(formatDate(endTime));
            return dateList;
          },
          addDay: function(date, day) {
            date = new Date(date);
            date.setDate(date.getDate() + day);
            return date;
          }
        },
        format: {
          fillIn: function(str, num, fillChar) {
            str = str.toString();
            if (str.length < num) {
              str = _.reduce(_.range(num - str.length), function(s) {
                s += fillChar;
                return s;
              }, "") + str;
            }
            return str;
          }
        }
      };
      module.exports = utils2;
    }
  });

  // static/src/scripts/gantt.js
  var utils = require_utils();
  var Gantt = function(opt) {
    _.extend(this, opt);
    this.init();
  };
  var DATE_WIDTH = 50;
  Gantt.prototype = {
    init: function() {
      var data = this.data, maxRange = this._getMaxRange(data), tasksPosition = this._getTasksPosition(data, maxRange[0]), dates = this._getDates(maxRange[0], maxRange[1]);
      this._render({
        tasks: data,
        dates
      });
      this._renderTasks(tasksPosition);
      this._bindEvent();
    },
    filter: function(prop, value, filterType) {
      filterType = filterType || "equal";
      var $tables = this.container.find("tbody"), $blocks = this.container.find(".gantt div");
      if (!value) {
        $blocks.show();
        $tables.find("tr").show();
        return;
      }
      _.each($tables.eq(0).find("tr"), function(rowNode, i) {
        var $tr = $(rowNode), $trs = $tr.add($tables.eq(1).find("tr").eq(i)).add($blocks.eq(i)), propVal = $tr.find("." + prop).text();
        if (filterType === "equal") {
          if (propVal !== value) {
            $trs.hide();
          } else {
            $trs.show();
          }
        } else {
          if (new RegExp(value, "i").test(propVal)) {
            $trs.show();
          } else {
            $trs.hide();
          }
        }
      });
    },
    _getDates: function(start, end) {
      var dates = utils.datetime.listDates(start, end);
      return _.map(dates, function(date) {
        var weekDay = new Date(date).getDay();
        return {
          name: date.split("-").slice(1).join("-"),
          // rm year
          isWeekend: weekDay === 0 || weekDay === 6
        };
      });
    },
    _getCostWithWeekend: function(start, end, cost, extra) {
      var days = utils.datetime.getRangeDays(start, end);
      if (start === end) {
        return cost;
      }
      if (extra) {
        return days;
      }
      if (cost % 1 === 0.5) {
        return days + 0.5;
      }
      return days + 1;
    },
    _getTasksPosition: function(tasks, projectStartDate) {
      var self = this, owners = {};
      return _.map(tasks, function(task) {
        var extra = 0;
        if (!owners[task.owner]) {
          owners[task.owner] = [];
        } else if (-1 !== _.indexOf(owners[task.owner], task.start)) {
          extra = 0.5;
        }
        owners[task.owner].push(task.end);
        return {
          // xumingmingv: 这里看起来是在凑数字?
          left: (utils.datetime.getRangeDays(projectStartDate, task.start) + extra) * DATE_WIDTH - 1,
          width: self._getCostWithWeekend(task.start, task.end, task.cost, extra) * DATE_WIDTH,
          progress: task.progress,
          isDelayed: task.isDelayed
        };
      });
    },
    _getMaxRange: function(tasks) {
      var minDate, maxDate, minIdx = 0, maxIdx = 0;
      _.each(tasks, function(task, i) {
        var startTime = new Date(task.start).getTime(), endTime = new Date(task.end).getTime();
        if (!minDate) {
          minDate = startTime;
          maxDate = endTime;
          minIdx = i;
          maxIdx = i;
        } else {
          if (minDate > startTime) {
            minDate = startTime;
            minIdx = i;
          }
          if (maxDate < endTime) {
            maxDate = endTime;
            maxIdx = i;
          }
        }
      });
      return [
        tasks[minIdx].start,
        tasks[maxIdx].end
      ];
    },
    _renderTasks: function(positions) {
      var $blocks = this.container.find(".gantt div");
      _.each($blocks, function(block, i) {
        var pos = positions[i];
        block.setAttribute(
          "style",
          "transform:translate(%left, 0); width:%wh; ".replace("%left", pos.left + "px").replace("%wh", pos.width + "px")
        );
        if (pos.isDelayed === "True") {
          $(block).css("background-color", "#e66");
        }
        var width = Math.max(pos.width * pos.progress / 100 - 6, 0);
        if (width > 0) {
          block.querySelector("span").style.width = width;
        } else {
          block.querySelector("span").style.display = "none";
        }
      });
    },
    _render: function(data) {
      this.container.html(_.template(this.template)(data));
      this.container.find(".gantt-area table").width(data.dates.length * DATE_WIDTH);
    },
    _bindEvent: function() {
      var $tables = this.container.find("tbody");
      $tables.on("click", "tr", function() {
        var $tr = $(this), i = $tr.index(), isActive = $tr.hasClass("active"), $trs = $tables.eq(0).find("tr:eq(" + i + ")").add($tables.eq(1).find("tr:eq(" + i + ")"));
        $tables.find("tr").removeClass("active");
        if (isActive) {
          $trs.removeClass("active");
        } else {
          $trs.addClass("active");
        }
      });
    }
  };
  var gantt = new Gantt({
    template: $("#__TEMPLATE__gantt").html(),
    data: window.data,
    container: $(".mygantt")
  });
  var $filterByMan = $("#filterByMan");
  $filterByMan.on("change", function() {
    var val = $filterByMan.val();
    gantt.filter("owner", val);
    if (window.history.replaceState) {
      window.history.replaceState(null, null, "?man=" + val);
    }
  });
  var search = window.location.search;
  var res = search.match(/\?man=(.+)/);
  if (res && res.length > 1) {
    gantt.filter("owner", decodeURIComponent(res[1]));
  }
  $("#tabs .nav-tabs a").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
})();
