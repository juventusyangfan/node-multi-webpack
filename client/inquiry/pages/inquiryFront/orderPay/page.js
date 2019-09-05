/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');

const config = require('configModule');
const libs = require('libs');

$(() => {
    var end_time = $("span[end_time]").attr("end_time"),
        timeStr = "",
        timer = null;

    function setTime() {
        clearTimeout(timer);
        if (end_time != "") {
            var timeArr = end_time.split(":");
            var sec = 0,
                min = 0,
                hr = 0,
                day = 0;
            if (parseInt(timeArr[3]) == 0) {
                if (parseInt(timeArr[2]) == 0) {
                    if (parseInt(timeArr[1]) == 0) {
                        if (parseInt(timeArr[0]) == 0) {
                            sec = 0;
                            min = 0;
                            hr = 0;
                            day = 0;
                        } else {
                            sec = 59;
                            min = 59;
                            hr = 23;
                            day = parseInt(timeArr[0]) - 1;
                        }
                    } else {
                        sec = 59;
                        min = 59;
                        hr = parseInt(timeArr[1]) - 1;
                        day = parseInt(timeArr[0]);
                    }
                } else {
                    sec = 59;
                    min = parseInt(timeArr[2]) - 1;
                    hr = parseInt(timeArr[1]);
                    day = parseInt(timeArr[0]);
                }
            } else {
                sec = parseInt(timeArr[3]) - 1;
                min = parseInt(timeArr[2]);
                hr = parseInt(timeArr[1]);
                day = parseInt(timeArr[0]);
            }

            if (parseInt(day) == 0 && parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                timeStr = "交易关闭";
                $(".order_confirm").removeClass("order_confirm").addClass("order_confirm_none");
            } else {
                day = day > 9 ? day : '0' + day
                hr = hr > 9 ? hr : '0' + hr
                min = min > 9 ? min : '0' + min
                sec = sec > 9 ? sec : '0' + sec
                end_time = day + ':' + hr + ':' + min + ':' + sec;
                timeStr = day + '天' + hr + '小时' + min + '分' + sec + '秒';
            }
            $("span[end_time]").html(timeStr);
        }
        // 一秒后递归
        timer = setTimeout(function () {
            setTime();
        }, 1000);
    }
    setTime();
});