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
        channel: 'trace_tenderEvaluate_' + $("input[name='tender_id']").val(),
        signUrl: config.pingbiaoPath + 'getSign',
        subUrl: config.pullPath + 'sub',
        callback: function callback(content, type) {
            try {
                content = eval('(' + content + ')');
            } catch (ex) {
                content = content;
            }
            if (content.code == 2000) {
                //开始唱标状态
                if (content.act == "OpenTenderSuccess") {
                    var isLeader = $(".room_container").attr("is_leader"),
                        roleType = isLeader == "1" ? 'leader' : 'expert';
                    //根据角色跳转指定的地址
                    window.location.href = content.data[roleType];
                }
                if (content.act == "startAnnounceTender") {
                    window.location.href = content.data;
                }
            }
        }
    });
});