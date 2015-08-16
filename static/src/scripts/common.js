/*
 * @author       : 远峰
 * @description* : 公共脚本
 */

$(function(){
    'use strict';

    // initialize all popover
    $('.J-popover').popover();

    function isInSearchBox() {
        var ae = document.activeElement;
        if (ae) {
            ae = $(ae);
            if (ae.attr("name") == "w") {
                return true;
            }
        }

        return false;
    }
    
    document.onkeydown = checkKey;
    function checkKey(e) {
        e = e || window.event;

        console.log("keycode: " + e.keyCode);

        if (e.keyCode == '72' && !isInSearchBox()) { // 'h' to go to home page
            var newhref = window.location.href
            var idx = newhref.indexOf("/")
            idx = newhref.indexOf("/", idx + 1)
            idx = newhref.indexOf("/", idx + 1)
            
            if (idx >= 0) {
                newhref = newhref.substr(0, idx);
                window.location = newhref;
            }
        }
        
        if (e.keyCode == '85' && !isInSearchBox()) { // 'u' to go to parent folder
            var newhref = window.location.href
            var idx = newhref.lastIndexOf("/")
            if (idx >= 0) {
                newhref = newhref.substr(0, idx)
                window.location = newhref;
            }
        }

        if (e.keyCode == '83' && !isInSearchBox()) { // 's' to search
            var searchBox = $("input[name=w]")[0];
            searchBox = $(searchBox);
            searchBox.focus();
            e.preventDefault();
        }

        if (e.keyCode == '65' && !isInSearchBox()) { // 'a' to focus the first item in listing page
            var items = $(".list-group")
            if (items) {
                var firstItem = items.children()[0];
                firstItem = $(firstItem)
                var firstLink = firstItem.find("a").focus()                
                firstLink.focus();
            }
        }

        if (e.keyCode == '74') { // 'j' to go up one item in listing page
            var ae = document.activeElement;
            if (ae && ae.tagName == "A" && $(ae).parent()[0].tagName == "LI") {
                ae = $(ae);
                var nextAe = ae.parent().prev().find("a");
                nextAe.focus();
            }
        }
        
        if (e.keyCode == '75' && !isInSearchBox()) { // 'k' to go up one item in listing page
            var ae = document.activeElement;
            if (ae && ae.tagName == "A" && $(ae).parent()[0].tagName == "LI") {
                ae = $(ae);
                var nextAe = ae.parent().next().find("a");
                nextAe.focus();
            }
        }
    }
});
