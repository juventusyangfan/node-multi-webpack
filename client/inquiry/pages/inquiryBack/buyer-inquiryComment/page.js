require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    //评论列表
    var vm = new Vue({
        el: '#commentList',
        data: {
            imgPath: config.filePath,
            loading: true, //loading图
            list: [], //商品列表
            count: 0, //商品总数
            companyName: "", //公司名字
            averageLevel: 0, //总满意度
            intLevel: 0, //总满意度整数
            floatLevel: 0, //总满意度小数
        },
        mounted() {
            this.getComment(1);
        },
        methods: {
            getComment(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.inquiryPath + '/purchaser/inquiry/getEvaluateList', {
                    quote_company_id: libs.getUrlParam("quote_company_id"),
                    p: vueObj.current
                }, function (dataObj) {
                    if (dataObj.code === 2000) {
                        vueObj.list = dataObj.data.data;
                        vueObj.count = dataObj.data.count;
                        vueObj.companyName = dataObj.data.quote_company_name;
                        vueObj.averageLevel = dataObj.data.average_level;
                        vueObj.intLevel = parseInt(dataObj.data.average_level);
                        if (dataObj.data.average_level.toString().indexOf(".") > -1) {
                            vueObj.floatLevel = dataObj.data.average_level.split(".")[1] > 0 ? "5" : "0";
                        }
                        $(".pDetail_tab_cell").find("span").html(vueObj.count);
                    }
                    vueObj.loading = false;
                });
            }
        }
    });

    //点击查看大图
    $(".pDetail_show_comment").on("click", ".comment_detail .imgs a", function () {
        var imgUrl = $(this).find("img").attr("src");
        $(this).parent().find("a").removeClass("active");
        $(this).addClass("active");
        $(this).parents(".comment_detail").find(".showBimg img").attr("src", imgUrl);
        $(this).parents(".comment_detail").find(".showBimg").show();
        return false;
    });
    //点击空白关闭大图
    $(document).mouseup(function (e) {
        $(".comment_detail .imgs").find("a").removeClass("active");
        $(".comment_detail").find(".showBimg img").attr("src", "");
        $(".comment_detail").find(".showBimg").hide();
    });
});