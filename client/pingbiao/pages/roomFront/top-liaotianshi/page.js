/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    var pull = new libs.webPull({
        channel: 'liaotianshi',
        signUrl: config.pingbiaoPath + 'getSign',
        subUrl: 'https://pull.dev.materialw.com/sub',
        callback: function (content, type) {
            try {
                content = eval('(' + content + ')');
            } catch (ex) {
                content = content;
            }
            //if (content.code == 2000 && content.data.sender_id != $("input[name='user_id']").val()) {
                showBox({
                    type: content.action,
                    data: {
                        userName: content.data.sender_name,
                        userPhone: $("input[name='user_phone']").val(),
                        message: content.data.content
                    }
                });
            //}
        }
    });

    //发送消息
    $(".room_box_enter").unbind().bind("click", function () {
        var _content = $(".room_box_text").val();
        $.ajaxForJson(config.pingbiaoPath + "chat/sendMsg", {
            content: _content
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                showBox({
                    type: 'mine',
                    data:{
                        userName: $("input[name='user_name']").val(),
                        userPhone: $("input[name='user_phone']").val(),
                        message: _content
                    }
                });
                $(".room_box_text").val("");
            }
        });
        return false;
    });

    //键盘输入
    $(".room_box_text").keydown(function (e) {
        if (e.ctrlKey && e.which == 13){
            $(".room_box_enter").trigger("click");
        }
    });

    //渲染聊天框
    function showBox(options) {
        var _html = '';
        if (options.type == "mine" || options.type == "other") {
            _html = '<div class="room_box_' + options.type + ' clearfix"><div class="room_box_itemInfo">' + options.data.userName + '（' + options.data.userPhone + '）<i class="iconKBR_big"></i></div><div class="room_box_itemCon">' + options.data.message + '</div></div>';
        }
        else if (options.type == "join") {
            _html = '<p class="room_box_msg"><span>' + options.data.userName + ' 进入在线评标室</span></p>';
        }
        $(".room_box_con").append(_html);
        var scrollHeight = $(".room_box_con").prop("scrollHeight");
        $(".room_box_con").scrollTop(scrollHeight, 200);

    }
});