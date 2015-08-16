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

        console.log("keycode: " + e.keyCode);
        if (e.keyCode == '74') { // 'j' to go to parent folder
            var newhref = window.location.href
            var idx = newhref.lastIndexOf("/")
            if (idx >= 0) {
                newhref = newhref.substr(0, idx)
                window.location = newhref;
            }
        }

        if (e.keyCode == '83') { // 's' to search
            var searchBox = $("input[name=w]")[0];
            searchBox = $(searchBox);
            searchBox.focus();
            e.preventDefault();
        }
    }
});
