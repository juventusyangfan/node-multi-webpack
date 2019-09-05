/**
 * Created by yangfan on 2017/7/5.
 */
const moduleExports = {
    checkUser(str) {
        var re = /^(?!_)(?!.*?_$)/;
        if (re.test(str) && str.length >= 4 && str.length <= 20) {
            return true;
        } else {
            return false;
        }
    },
    //验证代码
    checkCode(str) {
        var re = /^[a-zA-Z0-9]+$/;
        if (re.test(str) && str.length >= 8 && str.length <= 30) {
            return true;
        } else {
            return false;
        }
    },
    //验证手机号码
    //验证规则：11位数字，以1开头。
    checkMobile(str) {
        var re = /^1\d{10}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },

    //验证电话号码
    //验证规则：区号+号码，区号以0开头，3位或4位
    //号码由7位或8位数字组成
    //区号与号码之间可以无连接符，也可以“-”连接
    //如01088888888,010-88888888,0955-7777777
    checkPhone(str) {
        var re = /^0\d{2,3}-?\d{7,8}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },

    //验证邮箱
    //验证规则：邮箱地址分成“第一部分@第二部分”这样
    //第一部分：由字母、数字、下划线、短线“-”、点号“.”组成，
    //第二部分：为一个域名，域名由字母、数字、短线“-”、域名后缀组成，
    //而域名后缀一般为.xxx或.xxx.xx，一区的域名后缀一般为2-4位，如cn,com,net，现在域名有的也会大于4位
    checkEmail(str) {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },

    //验证中文
    checkNameCH(str) {
        var re = /[^\u4E00-\u9FA5]/g;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    //验证仓库长度
    checkWarehouse(str) {
        var re = /^[\u4E00-\u9FA5]{2,5}$/g;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    },
    //验证身份证号
    checkIDcards(str) {
        var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        var iSum = 0;
        var info = "";
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(str))) {
            return false;
        }
        str = str.replace(/x$/i, "a");
        if (aCity[parseInt(str.substr(0, 2))] == null) {
            return false;
        }
        var sBirthday = str.substr(6, 4) + "-" + Number(str.substr(10, 2)) + "-" + Number(str.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, "/"));
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
            return false;
        }
        for (var i = 17; i >= 0; i--) {
            iSum += (Math.pow(2, i) % 11) * parseInt(str.charAt(17 - i), 11);
        }
        if (iSum % 11 != 1) {
            return false;
        }
        return true;
    },
    //验证邮政编码
    checkPostal(str) {
        var re = /^\d{6}$/;
        return re.test(str) ? true : false;
    },
    //验证车牌号
    checkNumberPlate(str) {
        var re = /^[\u4e00-\u9fa5a]{1}[A-Z]{1}[A-Z0-9]{5}$/;
        return re.test(str) ? true : false;
    },
    //验证数字，第一位不为0
    checkNumber(str) {
        var re = /^[0-9]+(.[0-9]{1,3})?$/;
        return re.test(str) ? true : false;
    },
    //验证金额，两位小数
    checkMoney(str) {
        var re = /^[0-9]+([.]\d{1,2})?$/;
        return re.test(str) ? true : false;
    },
    //验证重量,三位小数
    checkWeight(str) {
        var re = /^[0-9]+([.]\d{1,3})?$/;
        return re.test(str) ? true : false;
    },
    //验证银行卡号
    checkBankCardNum(str) {
        var re = /^\d{16}|\d{19}$/;
        return re.test(str) ? true : false;
    },
    //验证街道地址
    //中英文数字
    checkAddress(str) {
        var re = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
        return re.test(str) ? true : false;
    },
    //验证密码
    checkPassword(str) {
        var re = /^[\S]{8,20}$/;
        return re.test(str) ? true : false;
    },
    //验证QQ号
    checkQQ(str) {
        var re = /^[1-9]\d{5,10}$/;
        return re.test(str) ? true : false;
    },
    //HTML标签的转义
    html2Escape(sHtml) {
        return sHtml.replace(/[<>&"]/g, function (c) {
            return {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;'
            } [c];
        });
    },
    //HTML标签反转义
    escape2Html(str) {
        var arrEntities = {
            'lt': '<',
            'gt': '>',
            'nbsp': ' ',
            'amp': '&',
            'quot': '"'
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    },
    //获取url地址参数
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(decodeURIComponent(r[2]));
        return null; //返回参数值
    },
    //替换地址中参数值
    replaceUrlParamVal(url, paramName, replaceWith) {
        var re = eval('/(' + paramName + '=)([^&]*)/gi');
        var nUrl = url.replace(re, paramName + '=' + replaceWith);
        return nUrl;
    },
    //删除地址中参数
    delUrlParam(url, delParam) {
        var reg = new RegExp("[\?&]" + delParam + "=[^&]*&?$", 'g'); //构造一个含有目标参数的正则表达式对象
        return url.replace(reg, '');
    },
    //输入框小数位数限制
    lenNumber(obj, len) {
        if (obj.value.split(".").length > 2) {
            var valArr = obj.value.split(".");
            if (valArr[0] != "") {
                obj.value = valArr[0] + "." + valArr[1] + valArr[2]
            } else {
                obj.value = valArr[1] + "." + valArr[2]
            }
        } else {
            len = len ? len : 0;
            if (len == 0) {
                obj.value = obj.value.replace(/[^0-9]/g, '');
            } else {
                obj.value = obj.value.replace(/[^0-9.]/g, '');
                if (obj.value != "") {
                    obj.value = /^\d+\.?\d{0,1}$/.test(obj.value) ?
                        obj.value : obj.value.split('.')[1].length == 1 ?
                        obj.value : obj.value = obj.value.split('.')[0] == "" ? "" : obj.value = obj.value.split('.')[0] + '.' + obj.value.split('.')[1].substr(0, len);
                }
            }
        }
    },
    //金额转大写
    changeMoneyToChinese(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);

        var s = '';

        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);

        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    },
    //时间加减
    dateADD(nowData, days) {
        function formatDate(num) {
            return parseInt(num) < 10 ? "0" + num : num;
        }

        var d = new Date(nowData);
        d.setDate(d.getDate() + days);
        var addData = d.getFullYear() + "-" + formatDate((d.getMonth() + 1)) + "-" + formatDate(d.getDate());
        return addData
    },
    //时间戳转换日期
    UnixToDate(unixTime, isFull, timeZone) {
        function btok(str, count, charStr) {
            var disstr = "";
            for (var i = 1; i <= (count - str.length); i++) {
                disstr += charStr;
            }
            str = disstr + str;
            return str;
        }

        if (typeof (timeZone) == 'number') {
            unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
        }
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += time.getUTCFullYear() + "-";
        ymdhis += btok((time.getUTCMonth() + 1).toString(), 2, '0') + "-";
        ymdhis += btok(time.getUTCDate().toString(), 2, '0');
        if (isFull === true) {
            ymdhis += " " + btok((parseInt(time.getUTCHours() + 8)).toString(), 2, '0') + ":";
            ymdhis += btok(time.getUTCMinutes().toString(), 2, '0');
        }
        return ymdhis;
    },
    //设置cookie
    setCookie(name, value, days) {
        var exp = new Date(new Date() + (86400000 * days) - (new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds()) * 1000);
        exp.setTime(exp.getTime());
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString();
    },
    //读取cookie
    getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    //删除cookie
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
        }
    },
    //前端生成UUID值
    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    //返回顶部
    goTop(top) {
        var scrolltop = top || 0;
        var time = $('html,body').scrollTop() / 4;
        $('html,body').animate({
            scrollTop: scrolltop
        }, time);
    },
    //字符串转json
    jsonToObj(str) {
        var obj = null;
        try {
            obj = JSON.parse(str);
        } catch (e) {
            obj = eval('(' + str + ')');
        }
        return obj;
    },
    //base64转换为Blob形式
    convertBase64UrlToBlob(urlData) {
        var bytes = window.atob(urlData.split(',')[1]);
        //  处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {
            type: 'image/jpg'
        });
    },
    /*
    长连接方法
config = {
    channel: 'abc',
    signUrl: 'http://...',
    subUrl: 'http://...',
    callback: function(content, type){}
};
*/
    webPull(config) {
        var self = this;
        if (typeof (id__) == "undefined") {
            id__ = 0;
        }
        config.sub_url = config.sub_url || config.subUrl;
        config.pub_url = config.pub_url || config.pubUrl;
        config.sign_url = config.sign_url || config.signUrl;

        self.cname = config.channel;
        self.sub_cb = function (msg) {
            self.log('proc', JSON.stringify(msg));
            var cb = config.callback || config.sub_callback;
            if (cb) {
                try {
                    cb(msg.content, msg.type);
                } catch (e) {
                    self.log(e);
                }
            }
        }
        self.sub_timeout = config.sub_timeout || (60 * 1000);

        self.id = id__++;
        self.cb = 'callback_' + self.id;
        self.timer = null;
        self.stopped = true;
        self.last_msg_time = 0;
        self.token = '';

        self.data_seq = 0;
        self.noop_seq = 0;
        self.sign_cb = null;

        self.pub_url = config.pub_url;
        if (config.sub_url.indexOf('?') == -1) {
            self.sub_url = config.sub_url + '?';
        } else {
            self.sub_url = config.sub_url + '&';
        }
        self.sub_url += 'cb=' + self.cb;
        if (config.sign_url) {
            if (config.sign_url.indexOf('?') == -1) {
                self.sign_url = config.sign_url + '?';
            } else {
                self.sign_url = config.sign_url + '&';
            }
            self.sign_url += 'cb=' + self.cb + '&cname=' + self.cname;
        }

        self.onmessage = function (msg) {
            // batch repsonse
            if (msg instanceof Array) {
                self.log('batch response', msg.length);
                self.long_polling_pause = true;
                for (var i in msg) {
                    self.proc_message(msg[i]);
                    if (i == msg.length - 1) {
                        self.long_polling_pause = true;
                    }
                }
            } else {
                self.proc_message(msg);
            }
        }

        self.proc_message = function (msg) {
            self.log('resp', JSON.stringify(msg));
            if (self.stopped) {
                return;
            }
            if (!msg) {
                return;
            }
            self.last_msg_time = (new Date()).getTime();

            if (msg.type == '404') {
                // TODO channel id error!
                alert('channel not exists!');
                return;
            }
            if (msg.type == '401') {
                // TODO token error!
                alert('token error!');
                return;
            }
            if (msg.type == '429') {
                //alert('too many connections');
                self_sub(5000 + Math.random() * 5000);
                return;
            }
            if (msg.type == 'sign') {
                self.sign_cb(msg);
                return;
            }
            if (msg.type == 'noop') {
                self.onmessage_noop(msg);
                return;
            }
            if (msg.type == 'next_seq') {
                self.onmessage_next_seq(msg);
                return;
            }
            if (msg.type == 'data' || msg.type == 'broadcast') {
                self.onmessage_data(msg);
                return;
            }
        }

        self.onmessage_noop = function (msg) {
            if (msg.seq == self.noop_seq) {
                if (self.noop_seq == 2147483647) {
                    self.noop_seq = -2147483648;
                } else {
                    self.noop_seq++;
                }
                // if the channel is empty, it is probably empty next time,
                // so pause some seconds before sub again
                self_sub(Math.random() * 1000);
            } else {
                // we have created more than one connection, ignore it
                self.log('ignore exceeded connections');
            }
        }

        self.onmessage_next_seq = function (msg) {
            self.data_seq = msg.seq;
            // disconnect & connect
            self_sub();
        }

        self.onmessage_data = function (msg) {
            if (msg.seq != self.data_seq) {
                if (msg.seq == 0 || msg.seq == 1) {
                    self.log('server restarted');
                    // TODO: lost_cb(msg);
                    self.sub_cb(msg);
                } else if (msg.seq < self.data_seq) {
                    self.log('drop', msg);
                } else {
                    self.log('msg lost', msg);
                    // TODO: lost_cb(msg);
                    self.sub_cb(msg);
                }

                self.data_seq = msg.seq;
            } else {
                self.sub_cb(msg);
            }
            if (self.data_seq == 2147483647) {
                self.data_seq = -2147483648;
            } else {
                self.data_seq++;
            }
            self_sub();
        }

        var self_sub = function (delay) {
            var url = self.sub_url +
                '&cname=' + self.cname +
                '&seq=' + self.data_seq +
                '&noop=' + self.noop_seq +
                '&token=' + self.token +
                '&_=' + new Date().getTime();
            if (typeof (EventSource) !== "undefined") {
                if (self.EventSource) {
                    return;
                }
                self.stopped = false;
                self.last_msg_time = (new Date()).getTime();
                url = url.replace('/sub?', '/sse?');
                self.log('sub SSE ' + url);
                try {
                    self.EventSource = new EventSource(url);
                    self.EventSource.onmessage = function (e) {
                        self.onmessage(JSON.parse(e.data));
                    }
                    self.EventSource.onerror = function () {
                        self.log('EventSource error');
                        self.EventSource.close();
                        self.EventSource = null;
                    }
                } catch (e) {
                    self.log(e.message);
                }
            } else {
                if (self.long_polling_pause) {
                    return;
                }
                delay = delay | 0;
                setTimeout(function () {
                    self.stopped = false;
                    self.last_msg_time = (new Date()).getTime();
                    $('script.' + self.cb).remove();
                    self.log('sub Long-Polling ' + url);
                    $.ajax({
                        url: url,
                        dataType: "jsonp",
                        jsonpCallback: self.cb ///////
                    });
                }, delay);
            }
        }

        self.sign_cb = function (msg) {
            if (self.stopped) {
                return;
            }
            self.cname = msg.cname;
            self.token = msg.token;
            try {
                var a = parseInt(msg.sub_timeout) || 0;
                self.sub_timeout = (a * 1.3) * 1000;
            } catch (e) {}
            self_sub();
        }

        self.start = function () {
            // sign, long-polling 闇€瑕佹敞鍐屾鍑芥暟
            // 缃戠粶寮傚父鍚�, 鍑芥暟娉ㄥ唽浼氫涪澶�, 闇€瑕侀噸鏂版敞鍐�.
            window[self.cb] = self.onmessage;

            self.log('start');
            self.stopped = false;
            self.last_msg_time = (new Date()).getTime();

            if (!self.timer) {
                self.timer = setInterval(function () {
                    var now = (new Date()).getTime();
                    if (now - self.last_msg_time > self.sub_timeout) {
                        self.log('timeout');
                        self.stop();
                        self.start();
                    }
                }, 1000);
            }

            if (self.sign_url) {
                self.log('sign in webPull server...');
                var url = self.sign_url + '&_=' + new Date().getTime();
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    jsonpCallback: self.cb ///////////
                });
            } else {
                self_sub();
            }
        }

        self.stop = function () {
            self.log('stop');
            self.stopped = true;
            self.last_msg_time = 0;
            if (self.timer) {
                clearTimeout(self.timer);
                self.timer = null;
            }
            if (self.EventSource) {
                self.EventSource.close();
                self.EventSource = undefined;
            }
        }

        // msg must be string
        self.pub = function (content, callback) {
            if (typeof (content) != 'string' || !self.pub_url) {
                alert(self.pub_url);
                return false;
            }
            if (callback == undefined) {
                callback = function () {};
            }
            var data = {};
            data.cname = self.cname;
            data.content = content;

            $.getJSON(self.pub_url, data, callback);
        }

        self.log = function () {
            return;
            try {
                var v = arguments;
                var p = 'webPull[' + self.id + ']';
                var t = new Date().toTimeString().substr(0, 8);
                if (v.length == 1) {
                    console.log(t, p, v[0]);
                } else if (v.length == 2) {
                    console.log(t, p, v[0], v[1]);
                } else if (v.length == 3) {
                    console.log(t, p, v[0], v[1], v[2]);
                } else if (v.length == 4) {
                    console.log(t, p, v[0], v[1], v[2], v[3]);
                } else if (v.length == 5) {
                    console.log(t, p, v[0], v[1], v[2], v[3], v[4]);
                } else {
                    console.log(t, p, v);
                }
            } catch (e) {}
        }

        self.start();
    }

};
module.exports = moduleExports;