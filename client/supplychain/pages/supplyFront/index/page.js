require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 首页轮播图
    $(".js_slides").initPicPlayer();

    // 新产品滚动
    var rotateTimer = null;
    var productRotateFuc = function () {
        var proList = $(".prodcut_list");
        var proItem = proList.find(".product_item");
        if (proItem.length <= 3) {
            return false;
        }
        proList.css("top", "0px");
        var copareVal = -(531 * Math.ceil(proItem.length / 3));
        var productRotateAnition = function () {
            if (proList.is(":animated")) {
                return false;
            }
            var topVal = parseInt(proList.css("top")) - 531;
            if (topVal <= copareVal) {
                topVal = 0;
            }
            proList.stop(true, true).animate({
                top: topVal + 'px'
            }, 1000);
            rotateTimer = setTimeout(productRotateAnition, 6000);
        };
        rotateTimer = setTimeout(productRotateAnition, 6000);
        proList.off().on({
            mouseover: function () {
                clearTimeout(rotateTimer);
            },
            mouseout: function () {
                rotateTimer = setTimeout(productRotateAnition, 6000);
            }
        });

        // 换一批
        $(".change_batch").off().on("click", function () {
            var main = $(this);
            // main.find("i").css("display", "inline-block");
            clearTimeout(rotateTimer);
            productRotateAnition();
            // main.find("i").removeAttr("style");
        });
    };
    productRotateFuc();
});