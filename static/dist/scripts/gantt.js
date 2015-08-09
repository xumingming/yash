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
    _getTasksPosition: function(tasks, projectStartDate){
        /**
         * @description : compute the position info for drawing gantt of each task
         * @param       : {Array} tasks
         * @param       : {String} projectStartDate, the min start date of the project
         * @return      : {Array}
         */

        var owners = {};
        return _.map(tasks, function(task, i){
            // conside about half day
            var extra = 0;
            if (!owners[task.owner]) {
                owners[task.owner] = {
                    end: task.end,
                    extra: 0
                };
            } else if(task.start === owners[task.owner].end){
                // if this task's start date is same with last task's end date
                extra = owners[task.owner].extra + task.cost;
                extra = owners[task.owner].extra = extra - Math.floor(extra);
                owners[task.owner].end = task.end;
            } else {
                owners[task.owner].end = task.end;
            }
            return  {
                left: (utils.datetime.getRangeDays(projectStartDate, task.start) + extra) * DATE_WIDTH,
                width: task.cost * DATE_WIDTH,
                progress: task.progress
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
            var bgcolor = 'blue'
            
            if (pos.progress > 10) {
                var green = 150 + Math.floor(50 * pos.progress / 100)
                console.log("green: " + green)
                bgcolor = 'rgb(60, %green, 60)'.replace('%green', green)
            }
            
            block.setAttribute('style', 'transform:translate(%left, 0); width:%wh; background-color:%bgcolor'
                               .replace('%left', pos.left + 'px')
                               .replace('%wh', pos.width + 'px')
                               .replace('%bgcolor', bgcolor)
                              );
        });
    },
    _render: function(data){
        this.container.html(_.template(this.template)(data));
    }
};

new Gantt({
    template: $('#__TEMPLATE__gantt').html(),
    data: window.data,
    container: $('.container')
});

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
