/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    var end_time = "00:00:00",
        timer = null;

    function setTime() {
        clearTimeout(timer);
        if (end_time != "" && end_time != "0" && end_time != "00:00:00") {
            var timeArr = end_time.split(":");
            var sec = 0,
                min = 0,
                hr = 0;
            if (parseInt(timeArr[2]) == 0) {
                if (parseInt(timeArr[1]) == 0) {
                    if (parseInt(timeArr[0]) == 0) {
                        sec = 0;
                        min = 0;
                        hr = 0;
                    } else {
                        sec = 59;
                        min = 59;
                        hr = parseInt(timeArr[0]) - 1;
                    }
                } else {
                    sec = 59;
                    min = parseInt(timeArr[1]) - 1;
                    hr = parseInt(timeArr[0]);
                }
            } else {
                sec = parseInt(timeArr[2]) - 1;
                min = parseInt(timeArr[1]);
                hr = parseInt(timeArr[0]);
            }

            if (parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                hr = '00';
                min = '00';
                sec = '00';
                end_time = hr + ':' + min + ':' + sec;
            } else {
                hr = hr > 9 ? hr : '0' + hr;
                min = min > 9 ? min : '0' + min;
                sec = sec > 9 ? sec : '0' + sec;
                end_time = hr + ':' + min + ':' + sec;
            }
            $(".box_info_time").find("span").eq(0).html(hr.toString().substring(0, 1));
            $(".box_info_time").find("span").eq(1).html(hr.toString().substring(1));
            $(".box_info_time").find("span").eq(2).html(min.toString().substring(0, 1));
            $(".box_info_time").find("span").eq(3).html(min.toString().substring(1));
            $(".box_info_time").find("span").eq(4).html(sec.toString().substring(0, 1));
            $(".box_info_time").find("span").eq(5).html(sec.toString().substring(1));

            // 一秒后递归
            timer = setTimeout(function () {
                setTime();
            }, 1000);
        } else {
            $(".box_info_time").find("span").eq(0).html(0);
            $(".box_info_time").find("span").eq(1).html(0);
            $(".box_info_time").find("span").eq(2).html(0);
            $(".box_info_time").find("span").eq(3).html(0);
            $(".box_info_time").find("span").eq(4).html(0);
            $(".box_info_time").find("span").eq(5).html(0);
        }
    }

    var vm = new Vue({
        el: '#roomBox',
        data() {
            return {
                loading: true,
                bidPath: config.bidPath,
                score_type: 1, //1纵向；2横向
                bid_company_id: '', //供应商ID
                bid_file_path: [], //评标文件
                supplier_info: '', //供应商信息
                supplier_all: null, //所有供应商信息
                supplier_ids: [], //已打分的公司ID
                tender_package_id: 0, //包件ID
                tender_id: $("input[name='tender_id']").val(), //招标ID
                tender_package_info: [], //包件信息
                prev_supplier_id: '', //上一家供应商ID
                next_supplier_id: '', //下一家供应商ID
                template_id: '', //模板ID
                template_detail: [], //模板信息
                template_content: [], //模板内容
                score_info: null, //评分信息
                score_len: 0, //总分列数
                score_total: 0 //总分
            }
        },
        mounted() {
            this.getSupplier();
        },
        methods: {
            getSupplier() {
                var that = this;
                that.loading = true;
                var reqObj = {
                    tender_id: that.tender_id,
                    tender_package_id: that.tender_package_id,
                    bid_company_id: that.bid_company_id,
                    score_type: that.score_type
                }
                $.ajaxForJson(config.pingbiaoPath + 'EvaluateTender/expertIndexAjax', reqObj, function (dataObj) {
                    if (dataObj.code == 2000) {
                        end_time = dataObj.data.expire_time; //过期时分秒
                        setTime();

                        that.score_type = dataObj.data.score_type;
                        that.bid_company_id = dataObj.data.bid_company_id;
                        that.bid_file_path = dataObj.data.supplier_info.bid_file_path;
                        that.supplier_info = dataObj.data.supplier_info;
                        that.supplier_all = dataObj.data.supplier_all;
                        that.supplier_ids = dataObj.data.have_data_supplier_ids;
                        that.prev_supplier_id = dataObj.data.prev_supplier_id;
                        that.next_supplier_id = dataObj.data.next_supplier_id;
                        that.tender_package_id = dataObj.data.tender_package_id;
                        that.tender_package_info = dataObj.data.tender_package_info;
                        that.template_id = dataObj.data.template_id;
                        that.template_detail = [];
                        that.score_info = dataObj.data.score_info;
                        if (that.score_type == 1) {
                            for (var i = 0; i < dataObj.data.template_detail.length; i++) {
                                for (var j = 0; j < dataObj.data.template_detail[i].content.length; j++) {
                                    let _obj = {
                                        content: dataObj.data.template_detail[i].content[j],
                                        name: dataObj.data.template_detail[i].name,
                                        len: dataObj.data.template_detail[i].content.length,
                                        index: i,
                                        idx: j
                                    }
                                    that.template_detail.push(_obj);
                                }
                            }
                            that.score_total = 0;
                            if (that.score_info && that.score_info.scores) {
                                that.score_len = that.score_info.scores.length;
                                for (var i = 0; i < that.score_info.scores.length; i++) {
                                    let _score = that.score_info.scores[i] == "" ? 0 : parseFloat(that.score_info.scores[i])
                                    that.score_total += _score;
                                }
                            }
                        } else if (that.score_type == 2) {
                            that.template_detail = dataObj.data.template_detail;
                            that.score_total = [];
                            for (var i in that.score_info) {
                                for (var j in that.supplier_all) {
                                    if (that.score_info[i].bid_company_id == j) {
                                        that.$set(that.score_info[i], 'bid_company_name', that.supplier_all[j]); //添加供应商名称
                                    }
                                }
                            }
                            that.template_content = [];
                            for (var n = 0; n < that.template_detail.length; n++) {
                                var _totalQz = 0;
                                for (var m = 0; m < that.template_detail[n].content.length; m++) {
                                    _totalQz += parseFloat(that.template_detail[n].content[m][1]);
                                    that.template_content.push(that.template_detail[n].content[m]);
                                }
                                that.$set(that.template_detail[n], 'total', _totalQz); //添加总权重
                            }
                        }

                        $(".room_box_title span.textCoffee").html("（评标进度：" + dataObj.data.step_info.confirm_num + "/" + dataObj.data.step_info.total_num + "）");

                        that.$nextTick(function () {
                            function getTotal() {
                                that.score_total = 0;
                                $(".page_list").find("input.input_qz").each(function () {
                                    var _score = $.trim($(this).val()) == "" ? 0 : parseFloat($(this).val());
                                    that.score_total += _score;
                                });
                                $(".input_total").val(that.score_total);
                            }

                            function getTrTotal(trObj) {
                                var _trTotal = 0;
                                trObj.find("input.input_qz").each(function () {
                                    var _score = $.trim($(this).val()) == "" ? 0 : parseFloat($(this).val());
                                    _trTotal += _score;
                                });
                                trObj.find(".input_total").val(_trTotal);
                            }
                            $(".page_list").find("input.input_qz").each(function (n) {
                                if (that.score_type == 1) {
                                    $(this).val(that.score_info.scores[n]);
                                }
                                $(this).unbind().bind({
                                    input: function () {
                                        libs.lenNumber(this, 2);
                                        if (that.score_type == 1) {
                                            getTotal();
                                        } else if (that.score_type == 2) {
                                            getTrTotal($(this).parents("tr"));
                                        }
                                    },
                                    blur: function () {
                                        $.ajaxForJson(config.pingbiaoPath + "EvaluateTender/publishScoreAjax", $("form").serialize(), function (dataObj) {
                                            if (dataObj.code != 2000) {
                                                $.msgTips({
                                                    type: "warning",
                                                    content: dataObj.msg
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    }
                    that.loading = false;
                });
            },
            changeCompany(supplierId) {
                this.bid_company_id = supplierId;
                this.getSupplier();
            },
            changeType(scoreType) {
                this.score_type = scoreType;
                this.getSupplier();
            },
            changePackge(packageId) {
                this.tender_package_id = packageId;
                this.bid_company_id = '';
                this.getSupplier();
            },
            showFile() {
                var _html = '<div style="padding: 0 20px;">';
                for (var i = 0; i < this.bid_file_path.length; i++) {
                    _html += '<div style="margin-bottom:10px;"><a href="' + config.filePath + this.bid_file_path[i].path + '" target="_blank" class="textBlue">' + this.bid_file_path[i].name + '</a></div>';
                }
                _html += '</div>';
                $.dialog({
                    title: '投标详情',
                    content: _html,
                    width: 540,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    },
                    cancel: {
                        show: true,
                        allow: true,
                        name: "取消"
                    },
                    callback: function () {
                        $(".cjy-cancel-btn").unbind().bind("click", function () {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            return false;
                        });
                    }
                });
            }
        }

    });

    //进度通道
    var pull = new libs.webPull({
        channel: 'trace_tenderEvaluate_' + $("input[name='tender_id']").val(),
        signUrl: config.pingbiaoPath + 'getSign',
        subUrl: config.pullPath + 'sub',
        callback: function (content, type) {
            try {
                content = eval('(' + content + ')');
            } catch (ex) {
                content = content;
            }
            if (content.code == 2000) { //开始唱标状态
                if (content.act == "confirmEvaluateTender") {
                    $(".room_box_title span.textCoffee").html("（评标进度：" + content.data.expert.confirm_num + "/" + content.data.expert.total_num + "）");
                } else if (content.act == "autoConfirmEvaluateTender") {
                    window.location.href = content.data;
                }
            }
        }
    });

    //提交评标
    $(".box_title_going").unbind().bind("click", function () {
        if (!$(this).hasClass("disNone")) {
            $.ajaxForJson(config.pingbiaoPath + "EvaluateTender/confirmInfoAjax", {
                tender_id: $("input[name='tender_id']").val()
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.dialog({
                        title: '提交评分',
                        content: '<div class="rateCfmDlg-content"><i class="iconfont icon-gantanhao"></i><span class="rateCfmDlg-txt">剩余评分时长：<span class="textRed js_hr">00</span> 小时 <span class="textRed js_min">00</span> 分 <span class="textRed js_sec">00</span> 秒 <br>您已完成  <span class="textRed">' + dataObj.data.finish_count + '</span>  家供应商的打分，提交评分后将不得更改，继续提交吗？ <br><a href="' + config.pingbiaoPath + 'EvaluateTender/previewEvaluate?tender_id=' + $("input[name='tender_id']").val() + '" target="_blank" class="textGreen">预览我的打分</a></span></div>',
                        width: 540,
                        confirm: {
                            show: true,
                            allow: true,
                            name: "确定"
                        },
                        cancel: {
                            show: true,
                            allow: true,
                            name: "取消"
                        },
                        callback: function () {
                            var less_time = dataObj.data.lessTimestamp,
                                lessTimer = null;

                            function setLessTime() {
                                clearTimeout(lessTimer);
                                if (less_time != "") {
                                    var timeArr = less_time.split(":");
                                    var sec = 0,
                                        min = 0,
                                        hr = 0;
                                    if (parseInt(timeArr[2]) == 0) {
                                        if (parseInt(timeArr[1]) == 0) {
                                            if (parseInt(timeArr[0]) == 0) {
                                                sec = 0;
                                                min = 0;
                                                hr = 0;
                                            } else {
                                                sec = 59;
                                                min = 59;
                                                hr = parseInt(timeArr[0]) - 1;
                                            }
                                        } else {
                                            sec = 59;
                                            min = parseInt(timeArr[1]) - 1;
                                            hr = parseInt(timeArr[0]);
                                        }
                                    } else {
                                        sec = parseInt(timeArr[2]) - 1;
                                        min = parseInt(timeArr[1]);
                                        hr = parseInt(timeArr[0]);
                                    }

                                    if (parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                                        hr = '00';
                                        min = '00';
                                        sec = '00';
                                        less_time = hr + ':' + min + ':' + sec;
                                    } else {
                                        hr = hr > 9 ? hr : '0' + hr;
                                        min = min > 9 ? min : '0' + min;
                                        sec = sec > 9 ? sec : '0' + sec;
                                        less_time = hr + ':' + min + ':' + sec;
                                    }
                                    $(".rateCfmDlg-txt .js_hr").html(hr);
                                    $(".rateCfmDlg-txt .js_min").html(min);
                                    $(".rateCfmDlg-txt .js_sec").html(sec);
                                } else {
                                    $(".rateCfmDlg-txt .js_hr").html('00');
                                    $(".rateCfmDlg-txt .js_min").html('00');
                                    $(".rateCfmDlg-txt .js_sec").html('00');
                                }
                                // 一秒后递归
                                lessTimer = setTimeout(function () {
                                    setLessTime();
                                }, 1000);
                            }
                            setLessTime();

                            $(".cjy-cancel-btn").unbind().bind("click", function () {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                return false;
                            });
                            $(".cjy-confirm-btn").off().on("click", function () {
                                $.ajaxForJson(config.pingbiaoPath + "EvaluateTender/evaluateConfirm", {
                                    tender_id: $("input[name='tender_id']").val()
                                }, function (jsonObj) {
                                    if (jsonObj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: jsonObj.msg,
                                            callback: function () {
                                                window.location.href = jsonObj.data;
                                            }
                                        });
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: jsonObj.msg
                                        });
                                    }
                                });
                            });
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
            });
        }
        return false;
    });
});