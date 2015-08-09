/*
 * @author       : 远峰
 * @description* : 公共脚本
 */

$(function(){
    'use strict';

    // initialize all popover
    $('.J-popover').popover();

	$('#filterByMan').on('change', function() {
		var selectedMan = $('#filterByMan').val();
		alert(window.location);
		window.location = window.location + "?man=" + selectedMan;
	})
});
