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
        if (r != null) return decodeURIComponent(r[2]);
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
    }

};
module.exports = moduleExports;