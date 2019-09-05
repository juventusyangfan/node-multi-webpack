require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

$(() => {
    //查看大图
    $(".back_info_item img").unbind().bind("click", function () {
        var path = $(this).attr("src");
        $.showPhoto(path);
        return false;
    });
});