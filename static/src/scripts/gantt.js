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
                width: task.cost * DATE_WIDTH
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
            block.setAttribute('style', 'transform:translate(%left, 0);width:%wh'.replace('%left', pos.left + 'px')
                              .replace('%wh', pos.width + 'px'));
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
