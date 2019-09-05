require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');

$(() => {
    // 获取评论列表
    var getMoreComment = function () {
        $("#pages").ajxForPage(config.wwwPath + 'supply/judgeList', {
            company_id: $(".comment_area").attr("company_id")
        }, function () {
            var commentLen = $(".comment_item").length;
            var contentEl = null;
            for (let i = 0; i < commentLen; i++) {
                contentEl = $(".comment_item").eq(i).find(".comment_content");
                for (let j = 2; j < contentEl.length; j++) {
                    contentEl.eq(j).css("display", "none");
                }
            }
        });
    };
    getMoreComment();

    // 更多评论
    $(".comment_area").off().on("click", ".comment_i", function () {
        var main = $(this);
        var commentEl = main.parents(".comment_item");
        var evaluateBox = commentEl.find(".evaluate_box");
        var contentEl = null;
        if (main.hasClass("icon-xiajiantou")) {
            if ($.trim(evaluateBox.html()) === "") {
                // 追加评分
                var score = [];
                var score_list = evaluateBox.attr("score_list");
                if (typeof score_list === "string") {
                    if (typeof(JSON) == "undefined") {
                        score_list = eval('(' + score_list + ')');
                    } else {
                        score_list = JSON.parse(score_list);
                    }
                }
                var score = [parseInt(score_list.price_score), parseInt(score_list.product_score), parseInt(score_list.speed_score), parseInt(score_list.safe_score), parseInt(score_list.amount_score), parseInt(score_list.service_score), parseInt(score_list.correct_score), parseInt(score_list.finace_score)];
                var txtArr = ['价格优势','产品质量','交货准时性','环保性','数量准确性','服务与支持','品种正确性','资金实力'];
                var typeArr = ['极差','较差','一般','良好','优秀'];
                var starHtml = '';
                for (let i = 0; i < txtArr.length; i++) {
                    starHtml += '<div class="evaluate_item"><span class="evaluate_type">' + txtArr[i] +'：</span><div class="evaluate_star_box clearfix">';
                    for (let j = 0; j < typeArr.length; j++) {
                        starHtml += '<dl class="evaluate_star"><dt class="evaluate_cell ';
                        if (j < score[i]) {
                            starHtml += 'evaluate_red';
                        } else {
                            starHtml += 'evaluate_gray';
                        }
                        starHtml += '"></dt><dd class="evaluate_txt">（'+ typeArr[j] +'）</dd></dl>';
                    }
                    starHtml += '</div></div>';
                }
                evaluateBox.html(starHtml);
            }
            main.removeClass("icon-xiajiantou").addClass("icon-shangjiantou");
            evaluateBox.slideDown(400);
            contentEl = commentEl.find(".comment_content");
            for (let n = 2; n < contentEl.length; n++) {
                contentEl.eq(n).slideDown(400);
            }
        } else {
            main.removeClass("icon-shangjiantou").addClass("icon-xiajiantou");
            evaluateBox.slideUp(400);
            contentEl = commentEl.find(".comment_content");
            for (let n = 2; n < contentEl.length; n++) {
                contentEl.eq(n).slideUp(400);
            }
        }
    });
});