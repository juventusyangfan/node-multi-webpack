require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //提问展开收起
    $(".js_more").unbind().bind("click",function(){
        if($(this).parents(".bid_question_cell").hasClass("question_up")){
            $(this).parents(".bid_question_cell").removeClass("question_up");
            $(this).find("span").html("展开");
        }
        else{
            $(this).parents(".bid_question_cell").addClass("question_up");
            $(this).find("span").html("收起");
        }
        return false;
    });
});