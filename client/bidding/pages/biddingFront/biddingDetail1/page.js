require('cp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    $(".js_login").unbind().bind("click",function(){
        $.loginDialog();
        return false;
    });
});