/*
 * @author       : 远峰
 * @description* : 公共脚本
 */

$(function(){
    'use strict';

    // initialize all popover
    $('.J-popover').popover();

    document.onkeydown = checkKey;
    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == '74') { // 'j' to go to parent folder
            var newhref = window.location.href
            var idx = newhref.lastIndexOf("/")
            if (idx >= 0) {
                newhref = newhref.substr(0, idx)
                window.location = newhref;
            }
        }
    }
});
