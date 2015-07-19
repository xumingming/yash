/* globals d3 */
(function(){
    'use strict';
    // helper function
    function getProcess(s){
        return (~~s.slice(0, -1)) / 100;
    }

    // generate test data
    var projectStart = new Date('2015-06-28'),
        cache = {};
    var data = _.map(_.range(15), function(i){
        var user = _.sample(['护城', '远峰', 'X']);
        var during = _.sample([1,2,3,4,5]),
            start = projectStart,
            end = d3.time.day.offset(start, during),
            process = _.sample(['10%', '30%', '50%', '70%', '100%']);
        if (!cache[user]) {
            cache[user] = {
                start: projectStart,
                end: end
            };
        } else {
            start = d3.time.day.offset(cache[user].end, 0);
            end = d3.time.day.offset(start, during);
            cache[user].start = start;
            cache[user].end = end;
        }
        return {
            owner: user,
            start: start,
            task: 'task' + i,
            during: during,
            process: process,
            end: d3.time.day.offset(start, during)
        };
    });

    // gantt
    data.sort(function(p, n){
        if(p.owner === n.owner) {
            return (p.start < n.start) ? -1 : (p.start > n.start) ? 1 : 0;
        }
        else {
            return (p.owner < n.owner) ? -1 : 1;
        }
    });

    var width = 800,
        cellHeight = 20, // 单位高度
        height = data.length * cellHeight,
        marginHeight = 50,
        marginWidth = 50;


    var graph = d3.select('.chart-gantt')
                .attr('width', 1200)
                .attr('height', height + marginHeight);

    // x轴
    var x = d3.time.scale()
            .domain([d3.min(data, function(d){
                return d.start;
            }), d3.max(data, function(d){
                var endDate = d.end;
                return endDate;
            })])
            .range([marginWidth, width]);
    var xAxis = d3.svg.axis()
                .scale(x)
                .ticks(d3.time.days, 1)
                .tickFormat(d3.time.format('%b %d'))
                .tickSize(2)
                .orient("bottom");

    // y轴
    var y = d3.scale.ordinal()
            .domain(_.map(data, function(d){
                return d.task;
            }))
            .rangeRoundBands([0, height], 0.1);

    var yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(4)
                .orient("left")
                .tickPadding(8);

    graph.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('y', 0)
        .attr('x', 9)
        .attr('dy', '.35em')
        .attr('font-size', 12)
        .attr('transform', 'rotate(90)')
        .style('text-anchor', 'start');

    graph.append('g')
        .attr('transform', 'translate(' + marginWidth + ', 0)')
        .attr('class', 'y axis')
        .call(yAxis)
        .selectAll('text')
        .attr('font-size', 12);

    // 任务区域
    var task = graph.append('g')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function(d, i){
                return 'translate(' + x(d.start) + ',' + i * cellHeight + ')';
            });

    // 初始任务
    task.append('rect')
        .attr('fill', '#669900')
        .attr('height', cellHeight)
        .attr('width', function(d){
            return x(d.end) - x(d.start);
        });

    // 已完成任务进度
    task.append('rect')
        .attr('fill', 'yellow')
        .attr('height', cellHeight)
        .attr('width', function(d){
            return (x(d.end) - x(d.start)) * getProcess(d.process);
        });

    task.append('text')
        .attr('x', 0)
        .attr('y', cellHeight / 2)
        .attr('dy', '.35em')
        .text(function(d){
            return d.owner;
        });


}());

