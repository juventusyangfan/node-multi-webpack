require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';

const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#tenderList',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1
            }
        },
        mounted() {
            this.getTenderList(1);
        },
        methods: {
            getTenderList(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + "/ajaxTenderList", {
                    status: $("select[name='status']").val(),
                    type: $("select[name='type']").val(),
                    time: $("input[name='time']").val(),
                    keyWord: $("input[name='keyWord']").val(),
                    sort: $(".back_list_nav").find("span.active").attr("value"),
                    menu: $("input[name='menu']").val(),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        for (var n = 0; n < that.list.length; n++) {
                            var editActHTML = '<div>',
                                seeActHTML = '<div>';
                            for (var i = 0; i < that.list[n].editAct.length; i++) {
                                editActHTML += '<a href="' + that.list[n].editAct[i].url + '" target="_blank" class="editActCell">' + that.list[n].editAct[i].name + '</a>';
                            }
                            if (that.list[n].del == 1) {
                                editActHTML += '<a href="javascript:;" target="_blank" class="editActCell shanchu_link">删除</a>';
                            }
                            for (var j = 0; j < that.list[n].seeAct.length; j++) {
                                if (j == 0) {
                                    seeActHTML += '<a href="' + that.list[n].seeAct[j].url + '" target="_blank" class="seeActCell">' + that.list[n].seeAct[j].name + '</a>';
                                } else {
                                    seeActHTML += '<span class="seeActLine">/</span><a href="' + that.list[n].seeAct[j].url + '" target="_blank" class="seeActCell">' + that.list[n].seeAct[j].name + '</a>';
                                }
                            }
                            if (that.list[n].pingjiaBox == 1) {
                                seeActHTML += '<span class="seeActLine">/</span><a href="javascript:;" target="_blank" class="seeActCell pingjia_box">评价</a>';
                            }
                            editActHTML += "</div>";
                            seeActHTML += "</div>";
                            that.$set(that.list[n], "actHTML", editActHTML + seeActHTML);
                        }
                        $(".back_list_nav").find("span.floatR").html("共计：" + that.count);
                    }
                    that.loading = false;
                });
            },
            showReason(tenderId, index) {
                var that = this;
                $.ajaxForJson(config.wwwPath + "getCheckCause", {
                    tenderId: tenderId
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.$set(that.list[index], "reasonStr", dataObj.data);
                        that.$set(that.list[index], "reasonShow", true);
                    }
                });
            }
        }
    });

    //检索招标列表
    $(".btn_confirm").unbind().bind("click", function () {
        vm.getTenderList(1);
        return false;
    });

    //切换排序方式
    $(".back_list_nav span[name='sort']").unbind().bind("click", function () {
        $(".back_list_nav span[name='sort']").removeClass("active");
        $(this).addClass("active");
        $(".btn_confirm").trigger("click");
    });

    // 评价
    $(".back_list_con").on("click", ".pingjia_box", function () {
        var that = $(this);
        var supply_id = that.parents("tr").attr("supplier-id");
        var tender_id = that.parents("tr").attr("tender-id");
        $.ajaxForJson(config.wwwPath + 'evaluate/getinfo', {
            supply_id: supply_id,
            tender_id: tender_id
        }, function (json) {
            if (json.code === 2000) {
                var txtArr = ['价格优势', '产品质量', '交货准时性', '环保性', '数量准确性', '服务与支持', '品种正确性', '资金实力'];
                var typeArr = ['极差', '较差', '一般', '良好', '优秀'];
                var scoreList = json.data.score_list;
                var score = [parseInt(scoreList.price_score), parseInt(scoreList.product_score), parseInt(scoreList.speed_score), parseInt(scoreList.safe_score), parseInt(scoreList.amount_score), parseInt(scoreList.service_score), parseInt(scoreList.correct_score), parseInt(scoreList.finace_score)];
                var contentHtml = '<div class="gys_comment"><p class="company_project"><span>中标单位：</span><a href="https://' + json.data.win_company_url + '" target="_blank">' + json.data.win_company_name + '</a><span>集采名称：</span><a href="https://' + json.data.tender_url + '" target="_blank">' + json.data.tender_name + '</a></p><div class="gys_comment_item"><h2>评分</h2><b>（评分提交后可修改）</b><span class="gys_comment_line"></span></div><div class="evaluate_box clearfix">';
                for (let i = 0; i < txtArr.length; i++) {
                    contentHtml += '<div class="evaluate_item"><span class="evaluate_type">' + txtArr[i] + '：</span><div class="evaluate_star_box clearfix" data-star="' + score[i] + '">';
                    for (let j = 0; j < typeArr.length; j++) {
                        contentHtml += '<dl class="evaluate_star"><dt class="evaluate_cell ';
                        if (j < score[i]) {
                            contentHtml += 'evaluate_red';
                        } else {
                            contentHtml += 'evaluate_gray';
                        }
                        contentHtml += '"></dt><dd class="evaluate_txt">（' + typeArr[j] + '）</dd></dl>';
                    }
                    contentHtml += '</div></div>';
                }
                contentHtml += '</div><div class="gys_comment_item"><h2>文字评价</h2><span class="gys_comment_line"></span></div><textarea class="cjy-textarea comment_textarea" name="content " maxlen="400" rows="3" style="width: 1026px;">' + json.data.content + '</textarea><div class="gys_comment_btn">';
                if (json.data.hasOwnProperty("is_hidden")) {
                    contentHtml += '<input type="checkbox" title="匿名" name="is_hidden" value="1" />';
                }
                contentHtml += '<button>提交</button></div></div>';
                $.dialog({
                    title: '供应商评价',
                    content: contentHtml,
                    width: 1110,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    }
                });
                $(".gys_comment input").initCheckbox();
                $(".gys_comment .cjy-textarea").initTextarea();

                $(".evaluate_box").on("mouseover", ".evaluate_star", function () {
                    var main = $(this);
                    var starList = main.parents(".evaluate_star_box").find(".evaluate_star");
                    var num = starList.index(main);
                    for (let i = 0; i < num + 1; i++) {
                        starList.eq(i).find(".evaluate_cell").removeClass("evaluate_gray").addClass("evaluate_red");
                    }
                    for (let j = num + 1; j < starList.length; j++) {
                        starList.eq(j).find(".evaluate_cell").removeClass("evaluate_red").addClass("evaluate_gray");
                    }
                });

                $(".evaluate_box").on("mouseout", ".evaluate_star", function () {
                    var main = $(this);
                    var starList = main.parents(".evaluate_star_box").find(".evaluate_star");
                    var num = parseInt(main.parents(".evaluate_star_box").attr("data-star"));
                    for (let i = 0; i < num; i++) {
                        starList.eq(i).find(".evaluate_cell").removeClass("evaluate_gray").addClass("evaluate_red");
                    }
                    for (let j = num; j < starList.length; j++) {
                        starList.eq(j).find(".evaluate_cell").removeClass("evaluate_red").addClass("evaluate_gray");
                    }
                });

                $(".evaluate_box").on("click", ".evaluate_star", function () {
                    var main = $(this);
                    var starList = main.parents(".evaluate_star_box").find(".evaluate_star");
                    var num = starList.index(main);
                    for (let i = 0; i < num + 1; i++) {
                        main.parents(".evaluate_star_box").attr("data-star", num + 1);
                        starList.eq(i).find(".evaluate_cell").removeClass("evaluate_gray").addClass("evaluate_red");
                    }
                    for (let j = num + 1; j < starList.length; j++) {
                        starList.eq(j).find(".evaluate_cell").removeClass("evaluate_red").addClass("evaluate_gray");
                    }
                });

                // 提交
                $(".gys_comment_btn button").off().on("click", function () {
                    var main = $(this);
                    var starEl = $(".evaluate_box").find(".evaluate_star_box");
                    for (let i = 0; i < starEl.length; i++) {
                        if (starEl.eq(i).attr("data-star") === "0") {
                            $.msgTips({
                                type: "warning",
                                content: '还有选项未评分'
                            });
                            return false;
                        }
                    }
                    if ($.trim($(".comment_textarea").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: '评价不能为空'
                        });
                        return false;
                    }

                    var reqData = '';
                    var score_list = [];
                    var starName = ['price_score', 'product_score', 'speed_score', 'safe_score', 'amount_score', 'service_score', 'correct_score', 'finace_score'];
                    for (let j = 0; j < starEl.length; j++) {
                        score_list.push('score_list[' + starName[j] + ']=' + parseInt(starEl.eq(j).attr("data-star")));
                    }
                    score_list = score_list.join("&");
                    if ($("input[name='is_hidden']").length > 0 && $("input[name='is_hidden']").is(":checked")) {
                        reqData = 'supply_id=' + supply_id + '&tender_id=' + tender_id + '&is_hidden=1&content=' + $.trim($(".comment_textarea").val()) + '&' + score_list;
                    } else {
                        reqData = 'supply_id=' + supply_id + '&tender_id=' + tender_id + '&content=' + $.trim($(".comment_textarea").val()) + '&' + score_list;
                    }

                    $.ajaxForJson(config.wwwPath + 'evaluate/evaluate', reqData, function (dataObj) {
                        if (dataObj.code === 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });
    // 删除
    $(".back_list_con").on("click", ".shanchu_link", function () {
        var that = $(this);
        var tender_id = that.parents("tr").attr("tender-id");
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '是否移除该条招标信息？'],
            content: '',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + 'delTender', {
                        tenderId: tender_id
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                });
            }
        });
    });

    //点击空白区隐藏下拉框
    $(document).mouseup(function (e) {
        var _con = $('.showReason'); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
            for (var i = 0; i < vm.list.length; i++) {
                vm.list[i].reasonShow = false;
            }
        }
    });
});