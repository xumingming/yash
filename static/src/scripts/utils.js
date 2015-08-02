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
