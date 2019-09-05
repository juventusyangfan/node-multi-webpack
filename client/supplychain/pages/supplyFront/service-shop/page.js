require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    //banner轮播
    $(".js_slides").initPicPlayer();

    // 产品服务滚动
    var productRotate = {
        dotBtns: $(".shop_product").find(".carousel_dot").find(".carousel_dot_span"),
        containerEl: $(".product_container"),
        oUl: $(".product_container").find("ul"),
        page: 0,
        render: function () {
            this.oUl = $(".product_container").find("ul");
            if (this.oUl.length < 2) {
                $(".rotate_right").remove();
                $(".rotate_left").remove();
                return false;
            }
            this.init();
        },
        init: function () {
            // 初始化数据
            // this.containerEl.append(this.oUl.eq(0).clone(true));
            // this.containerEl.prepend(this.oUl.eq(this.oUl.length - 1).clone(true));
            // this.containerEl.css("left", "-100%");
            this.btnEvent();
            this.dotEvent();
        },
        rotateAni: function (moveVal) {
            this.containerEl = $(".product_container");
            if (this.containerEl.is(":animated")) {
                return false;
            }
            var that = this;
            var len = this.oUl.length;
            var curVal = null;
            if (moveVal < 0) {
                this.page++;

            } else {
                this.page--;
            }
            if (this.page >= len) {
                this.page = len - 1;
                return false;
            }
            if (this.page < 0) {
                this.page = 0;
                return false;
            }
            curVal = this.page * -1140;
            var minPercent = -(len * 1140);
            this.containerEl.stop(true, true).animate({
                left: curVal + 'px'
            }, 500, function () {
                // if (curVal < minPercent) {
                //     that.containerEl.css("left", "-1140px");
                // }
                // if (curVal > -100) {
                //     that.containerEl.css("left", minPercent + 'px');
                // }
            });
            // this.dotBtns.removeClass("active");
            // this.dotBtns.eq(this.page - 1).addClass("active");
            vm.current = this.page;
        },
        dotEvent: function () {
            var that = this;
            this.dotBtns.off().on("click", function () {
                var main = $(this);
                var dotSpan = main.parents(".carousel_dot").find(".carousel_dot_span");
                that.page = dotSpan.index(main);
                that.rotateAni(-100);
            });
        },
        btnEvent: function () {
            // 控制按钮
            var that = this;
            $(".rotate_left").off().on("click", function () {
                that.rotateAni(100);
            });
            $(".rotate_right").off().on("click", function () {
                that.rotateAni(-100);
            });
        }
    };

    // 获取产品服务数据
    var vm = new Vue({
        el: '#productList',
        data: {
            imgPath: config.filePath,
            loading: true,
            list: [],
            count: 0,
            perCount: 6,
            ulCount: 0,
            limit: 18,
            current: 0
        },
        mounted() {
            this.getProductList();
        },
        computed: {
            listTemp: function () {
                var list = this.list;
                var arrTemp = [];
                var index = 0;
                var sectionCount = this.perCount;
                for (var i = 0; i < list.length; i++) {
                    index = parseInt(i / sectionCount);
                    if (arrTemp.length <= index) {
                        arrTemp.push([]);
                    }
                    arrTemp[index].push(list[i]);
                }
                return arrTemp;
            }
        },
        methods: {
            getProductList() {
                var vueObj = this;
                vueObj.loading = true;
                $.ajaxForJson(config.jcPath + 'Product/ajaxProductList', {
                    bank_id: $(".product_con").attr("bank_id"),
                    p: 1,
                    limit: 18
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.data;
                        vueObj.count = json.data.count;
                        vueObj.ulCount = Math.ceil(vueObj.count / vueObj.perCount);

                        vueObj.$nextTick(function () {
                            productRotate.render();
                            $(".intention_btn").off().on("click", function () {
                                if ($(this).attr("login_val") === "-1") {
                                    $.loginDialog();
                                } else {
                                    $(this).intentionFormFuc();
                                }
                            });
                        });
                    }
                    vueObj.loading = false;
                });
            }
        }
    });

    //视频播放
    $(".video_play").unbind().bind("click", function () {
        var src = $(this).attr("data-url");

        $(".video_box").html('<video id="video" style="object-fit: fill;width: 1200px;height: 680px;" controls><source src="' + src + '"></video>');
        $("body").append('<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>');
        $(".video_box").css("top", ($(document).scrollTop() + 100) + 'px');
        $(".video_box").show();

        $(".cjy-bg").unbind().bind("click", function () {
            $(".cjy-bg").remove();
            $(".video_box video").remove();
            $(".video_box").hide();
        });
    });
});