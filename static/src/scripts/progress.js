/**
 * @author       : 远峰
 * @description* : 进度条
 * @time         : 2015-09-18 20:41
 */

'use strict';

var ProgressController = function(){
    this.init();
};

ProgressController.prototype = {
    init: function(){

        this.$element = $()
    },
    _renderItem: function(percentage){

    },
    $: function(selector){
        this.$element.find(selector);
    }
}

module.exports = ProgressController;
