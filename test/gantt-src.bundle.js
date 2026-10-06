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

  // test/gantt-src.js
  var utils = require_utils();
  window.appModules = { utils };
})();
