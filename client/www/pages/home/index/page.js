require('elem');
require('cp');
require('./page.css');
require('../../../public-resource/css/swiper.min.css');

const config = require('configModule');
const libs = require('libs');

const Swiper = require('../../../public-resource/libs/swiper.min.js');

$(() => {
    //banner轮播
    $(".js_slides").initPicPlayer();

    // 入驻动态
    var rotateTimer = null;
    var productRotateFuc = function () {
        var proList = $(".trend_list");
        var proItem = proList.find(".trend_item");
        if (proItem.length <= 4) {
            return false;
        }
        proList.css("top", "0px");
        var copareVal = -(136 * Math.ceil(proItem.length / 4));
        var productRotateAnition = function (sVal) {
            if (proList.is(":animated")) {
                return false;
            }
            var val = sVal || 136
            var topVal = parseInt(proList.css("top")) - val;
            if (topVal <= copareVal) {
                topVal = 0;
            }
            if (topVal > 0) {
                topVal = copareVal + 136;
            }
            proList.stop(true, true).animate({
                top: topVal + 'px'
            }, 300);
            rotateTimer = setTimeout(productRotateAnition, 6000);
        };
        rotateTimer = setTimeout(productRotateAnition, 6000);
        proList.off().on({
            mouseover: function () {
                clearTimeout(rotateTimer);
            },
            mouseout: function () {
                clearTimeout(rotateTimer);
                rotateTimer = setTimeout(productRotateAnition, 6000);
            }
        });

        // 上下箭头
        $(".upordown").off().on("click", function () {
            var main = $(this);
            clearTimeout(rotateTimer);
            if (main.hasClass("icon-shangjiantou")) {
                productRotateAnition(-136);
            } else {
                productRotateAnition(136);
            }
        });
    };
    productRotateFuc();

    //进场动画
    $(".jc_bank_cell").unbind().bind("mouseover", function () {
        if (!$(this).hasClass("active")) {
            $(".jc_bank_cell").removeClass("active");
            $(this).addClass("active");
        }
    });


    var bannerTop, trendTop, inquiryTop, shopTop, supplychainTop, sanfangTop, friendTop;
    initScroll();

    function initScroll() {
        bannerTop = $('#banner').offset().top;
        trendTop = $('#trend').offset().top;
        inquiryTop = $('#inquiry').offset().top;
        shopTop = $('#shop').offset().top;
        supplychainTop = $('#supplychain').offset().top;
        sanfangTop = $('#sanfang').offset().top;
        friendTop = $('#friend').offset().top;
        window.onscroll = scrollEvent
    };
    //滚动监听
    function scrollEvent() {
        if (document.documentElement && document.documentElement.scrollTop) {
            targetTop = document.documentElement.scrollTop + 1;
        } else if (document.body) {
            targetTop = document.body.scrollTop + 1;
        }

        if (targetTop >= bannerTop && targetTop < trendTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(0).find("a").addClass("active");
        } else if (targetTop >= trendTop && targetTop < inquiryTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(1).find("a").addClass("active");
        } else if (targetTop >= inquiryTop && targetTop < shopTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(2).find("a").addClass("active");
        } else if (targetTop >= shopTop && targetTop < supplychainTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(3).find("a").addClass("active");
        } else if (targetTop >= supplychainTop && targetTop < sanfangTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(4).find("a").addClass("active");
        } else if (targetTop >= sanfangTop && targetTop < friendTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(5).find("a").addClass("active");
        } else if (targetTop >= friendTop) {
            $(".anchor_warp").find("a.active").removeClass("active");
            $(".anchor_warp ul").find("li").eq(6).find("a").addClass("active");
        }
    };
    // 点击导航条后滑动到相应的位置
    $(".anchor_warp").on("click", "a", function () {
        var barclass = $(this).attr('data-href');
        var top = $("#" + barclass).offset().top;
        $("html,body").animate({
            scrollTop: top
        }, 500);
    });
    //无权限跳转
    $("a[name='nolink']").unbind().bind("click", function () {
        var val = $(this).attr("word");
        $.msgTips({
            type: "warning",
            content: val
        });
        return false;
    });

    // swiper轮播
    var certifySwiper = new Swiper('#certify .swiper-container', {
        watchSlidesProgress: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: {
            disableOnInteraction: false, //默认true
            delay: 5000, //默认3000
        },
        loop: true,
        loopedSlides: 5,
        slideToClickedSlide: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        on: {
            progress: function (progress) {
                for (i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i);
                    var slideProgress = this.slides[i].progress;
                    modify = 1;
                    if (Math.abs(slideProgress) > 1) {
                        modify = (Math.abs(slideProgress) - 1) * 0.1 + 1;
                    }
                    translate = slideProgress * modify * 240 + 'px';
                    scale = 1 - Math.abs(slideProgress) / 5;
                    zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
                    slide.transform('translateX(' + translate + ') scale(' + scale + ')');
                    slide.css('zIndex', zIndex);
                    slide.css('opacity', 1);
                    slide.find(".shop_con_warp").css('opacity', scale);
                    if (Math.abs(slideProgress) > 3) {
                        slide.css('opacity', 0);
                    }
                }
            },
            setTransition: function (transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }

            }
        }
    });
});