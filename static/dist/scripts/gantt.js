(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author       : 远峰
 * @description* : gantt
 */

'use strict';

var utils = require('./utils');

var Gantt = function(opt){
        _.extend(this, opt);
        this.init();
    },
    DATE_WIDTH = 50; // width of each day in gantt

Gantt.prototype = {
    init: function(){
        var data = this.data,
            maxRange = this._getMaxRange(data),
            tasksPosition = this._getTasksPosition(data, maxRange[0]),
            dates = this._getDates(maxRange[0], maxRange[1]);
        this._render({
            tasks: data,
            dates: dates
        });
        console.log(data);
        this._renderTasks(tasksPosition);
        this._bindEvent();
    },
    filter: function(prop, value, filterType){
        /**
         * @description : filter rows by task property
         * @param       : {String} prop, task property
         * @param       : {String} value, task property value
         * @param       : {String} filterType, filterType, includes 'match', 'equal'
         */
        filterType = filterType || 'equal';
        var $tables = this.container.find('tbody'),
            $blocks = this.container.find('.gantt div');
        if (!value) {
            $blocks.show();
            $tables.find('tr').show();
            return;
        }
        _.each($tables.eq(0).find('tr'), function(rowNode, i){
            var $tr = $(rowNode),
                $trs = $tr.add($tables.eq(1).find('tr').eq(i)).add($blocks.eq(i)),
                propVal = $tr.find('.' + prop).text();
            if (filterType === 'equal') {
                if (propVal !== value) {
                    $trs.hide();
                } else {
                    $trs.show();
                }
            } else {
                if (new RegExp(value, 'i').test(propVal)) {
                    $trs.show();
                } else {
                    $trs.hide();
                }
            }
        });

    },
    _getDates: function(start, end){
        /**
         * @description : get date name and isWeekend between start and end
         * @param       : {String} start, start date
         * @param       : {String} end, end date
         * @return      : {Array}, item includes {name, isWeekend}
         */
        var dates = utils.datetime.listDates(start, end);
        return _.map(dates, function(date){
            var weekDay = new Date(date).getDay();
            return {
                name: date.split('-').slice(1).join('-'), // rm year
                isWeekend: weekDay === 0 || weekDay === 6
            };
        });

    },
    _getCostWithWeekend: function(start, end, cost, extra){
        /**
         * @description : get cost days, take weekend into consideration
         */
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
    _getTasksPosition: function(tasks, projectStartDate){
        /**
         * @description : compute the position info for drawing gantt of each task
         * @param       : {Array} tasks
         * @param       : {String} projectStartDate, the min start date of the project
         * @return      : {Array}
         */

        var self = this,
            owners = {};
        return _.map(tasks, function(task){
            // conside about half day
            var extra = 0;
            if (!owners[task.owner]) {
                owners[task.owner] = [];
            } else if(-1 !== _.indexOf(owners[task.owner], task.start)){
                // if this task's start date is same with last task's end date
                extra = 0.5;
            }
            owners[task.owner].push(task.end);
            return  {
                left: (utils.datetime.getRangeDays(projectStartDate, task.start) + extra) * DATE_WIDTH,
                width: self._getCostWithWeekend(task.start, task.end, task.cost, extra) * DATE_WIDTH,
                progress: task.progress,
                isDelayed: task.isDelayed
            };
        });
    },
    _getMaxRange: function(tasks){
        /**
         * @description : get min begin date, max end date
         * @param       : {Array} tasks, which includes start, end
         * @return      : {Array} [min date string, max date string]
         */
        var minDate,
            maxDate,
            minIdx = 0,
            maxIdx = 0;
        _.each(tasks, function(task, i){
            var startTime = new Date(task.start).getTime(),
                endTime = new Date(task.end).getTime();
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
    _renderTasks: function(positions){
        var $blocks = this.container.find('.gantt div');
        _.each($blocks, function(block, i){
            var pos = positions[i];
            block.setAttribute('style', 'transform:translate(%left, 0); width:%wh; '
                               .replace('%left', pos.left + 'px')
                               .replace('%wh', pos.width + 'px')
                              );
            // render task as red if it is delayed
            if (pos.isDelayed === "True") {
                $(block).css("background-color", "#e66");
            }

            block.querySelector('span').style.width = Math.max(pos.width * pos.progress / 100 - 6, 0);
        });
    },
    _render: function(data){
        this.container.html(_.template(this.template)(data));
        this.container.find('.gantt-area table').width(data.dates.length * DATE_WIDTH);
    },
    _bindEvent: function(){
        var $tables = this.container.find('tbody');

        $tables.on('click', 'tr', function(){
            var $tr = $(this),
                i = $tr.index(),
                isActive = $tr.hasClass('active'),
                $trs = $tables.eq(0).find('tr:eq(' + i + ')').add($tables.eq(1).find('tr:eq(' + i + ')'));
            $tables.find('tr').removeClass('active');
            if (isActive) {
                $trs.removeClass('active');
            } else {
                $trs.addClass('active');
            }
        });
    }
};

var gantt = new Gantt({
        template: $('#__TEMPLATE__gantt').html(),
        data: window.data,
        container: $('.mygantt')
    });

// filter
var $filterByMan = $('#filterByMan');
$filterByMan.on('change', function(){
    var val = $filterByMan.val();
    gantt.filter('owner', val);

    if (window.history.replaceState) {
        window.history.replaceState(null, null, '?man=' + val);
    }
});

// filter onload if owner is selected
var search = window.location.search,
    res = search.match(/\?man=(.+)/);
if (res && res.length > 1) {
    gantt.filter('owner', decodeURIComponent(res[1]));
}

$('#tabs a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

// $(".progressbar-container").each(function(idx, item) {
//     item = $(item);
//     var progress = item.attr("data-progress");
//     item.find(".progressbar").width(progress + "px");
//     item.append("<span style='position:relative;top:-2px'>" + progress + "%</span>");
// });

},{"./utils":2}],2:[function(require,module,exports){
/*
 * @author       : 远峰
 * @description* : utils
 */

'use strict';

var utils = {
    datetime: {
        getRangeDays: function(start, end){
            /**
             * @description : compute the range between two date
             * @param       : {String} start, begin date
             * @param       : {String} end, end date
             * @return      : {Number}, days
             */
            var ONE_DAY_TIME = 1000 * 3600 * 24,
                startTime = new Date(start).getTime(),
                endTime = new Date(end).getTime();
            if (endTime < startTime) {
                throw new Error('end date should not be earlier than begin date');
            }
            return (endTime - startTime) / ONE_DAY_TIME;
        },
        listDates: function(start, end){
            /**
             * @description : list all dates between start and end
             * @param       : {String} start, begin date
             * @param       : {String} end, end date
             * @return      : {Array} dates
             */
            var startTime = new Date(start),
                endTime = new Date(end),
                dateList = [],
                currDate = startTime,
                formatDate = function(date) {
                    return 'YYYY-MM-dd'
                                .replace('YYYY', date.getFullYear())
                                .replace('MM', utils.format.fillIn(date.getMonth() + 1, 2, '0'))
                                .replace('dd', utils.format.fillIn(date.getDate(), 2, '0'));
                };

            while(currDate < endTime){
                dateList.push(formatDate(currDate));
                currDate = utils.datetime.addDay(currDate, 1);
            }
            dateList.push(formatDate(endTime));

            return dateList;
        },
        addDay: function(date, day){
            date = new Date(date);
            date.setDate(date.getDate() + day);
            return date;
        }
    },
    format: {
        fillIn: function(str, num, fillChar){
            /**
             * @description : fill in string
             * @param       : {String} str
             * @param       : {Number} num, the length of the string should be
             * @param       : {String} char
             * @return      : {String}
             * @syntax      : fillIn('6', 2, '0') -> '06'
             */
            str = str.toString();
            if (str.length < num) {
                str = _.reduce(_.range(num - str.length), function(s){
                    s += fillChar;
                    return s;
                }, '') + str;
            }
            return str;
        }
    }
};
module.exports = utils;

},{}]},{},[1]);
