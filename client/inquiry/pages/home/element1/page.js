require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
$(() => {
    //设置商品属性
    $(".set_proAttr").unbind().bind("click", function () {
        var dialogHTML = '<div class="set_attr_con"><div class="attr_con_left"><ul><li class="active"><a href="javascript:;" class="attr_name">尺寸<i class="attr_num">13</i><i class="iconfont icon-youjiantou"></i></a></li><li><a href="javascript:;" class="attr_name">颜色<i class="attr_num">3</i><i class="iconfont icon-youjiantou"></i></a></li><li><a href="javascript:;" class="attr_name">材质<i class="iconfont icon-youjiantou"></i></a></li></ul></div><div class="attr_con_right"><div class="attr_selAll"><a href="javascript:;" class="checkAll checkIcon"><i class="iconfont icon-gou"></i>全选</a><a href="javascript:;" class="attr_val_add">增加自定义项</a></div><div class="attr_selCon clearfix"><ul><li class="attr_sel_cell"><a href="javascript:;" class="checkIcon"><i class="iconfont icon-gou"></i>属性值1</a></li></ul></div><div class="attr_addCon clearfix"><ul></ul></div></div></div>';
        //<li class="attr_add_cell"><a href="javascript:;" class="checkIcon"><i class="iconfont icon-gou"></i></a><input type="text" class="cjy-input-"><a href="javascript:;" class="iconfont icon-huishouxiang"></a></li>
        $.dialog({
            title: '设置商品属性',
            content: dialogHTML,
            width: 800,
            confirm: {
                show: true,
                allow: true,
                name: "生成货品"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                //选择分类
                $(".attr_con_left").find("a.attr_name").unbind().bind("click", function () {
                    $(".attr_con_left").find("li").removeClass("active");
                    $(this).parent().addClass("active");
                });
                //选择属性
                $(".set_attr_con").on("click", ".checkIcon,.checkedIcon", function () {
                    if ($(this).hasClass("checkIcon")) {
                        $(this).removeClass("checkIcon").addClass("checkedIcon");
                    }
                    else {
                        $(this).removeClass("checkedIcon").addClass("checkIcon");
                        $(".attr_selAll").find("a.checkAll").removeClass("checkedIcon").addClass("checkIcon");
                    }
                });
                //全选
                $(".attr_selAll").find("a.checkAll").unbind().bind("click", function () {
                    if ($(this).hasClass("checkIcon")) {
                        $(".attr_con_right").find(".checkIcon").removeClass("checkIcon").addClass("checkedIcon");
                    }
                    else {
                        $(".attr_con_right").find(".checkedIcon").removeClass("checkedIcon").addClass("checkIcon");
                    }
                    return false;
                });
                //添加自定义项
                $(".attr_selAll").find("a.attr_val_add").unbind().bind("click", function () {
                    var addHTML = '<li class="attr_add_cell"><a href="javascript:;" class="checkIcon"><i class="iconfont icon-gou"></i></a><input type="text" class="cjy-input-"><a href="javascript:;" class="iconfont icon-huishouxiang attr_del"></a></li>';
                    $(".attr_addCon").find("ul").append(addHTML);
                    $(".attr_addCon").find(".attr_del").unbind().bind("click", function () {
                        $(this).parent().remove();
                        return false;
                    });
                    return false;
                });
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    return false;
                });
            }
        });
        return false;
    });

    $("[cjy-multi]").initMultiSelect();
});