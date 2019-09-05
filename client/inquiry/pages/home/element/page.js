require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

const testImg = require('./imgs/testbg.png');
const testImg2 = require('./imgs/testbg2.png');
$(() => {
    // 报价服务
    $(".quote_service").off().on("click", function () {
        $.dialog({
            title: '',
            content: '<div class="quote-service-box"><div class="quote-service-title">报价服务</div><div class="quote-service-inner"><div class="quote-cell cellChecked"><i class="iconGou"></i><div class="quote-cell-num"><i class="iconfont icon-jian8 quote_minus forbid_btn"></i><span class="quote-cell-txt"><span class="fontSize14 textBlack2 marginL10">报价</span><input type="text" class="quote-cell-input" value="10"><span class="fontSize14 textBlack2 marginR10 floatR">次</span></span><i class="iconfont icon-jiahao1 quote_add"></i></div><div class="quote-maney">￥<span class="fontSize32 textBlack1">100</span></div><div class="quote-price">10元/次</div></div><div class="quote-title">支付方式</div><div class="pay-con"><a href="javascript:;" class="pay-cell"><i class="iconGou"></i>公对公转账</a><a href="javascript:;" class="pay-cell cellChecked"><i class="iconGou"></i>融易付</a></div><div class="quote-title">发票说明</div><div class="quote-des"><p>1、平台收取的报价服务费，开票方为湖北省楚建易网络科技有限公司。</p><p>2、您的累计报价消费金额不小于300元，可在平台申请开票。</p><p>3、申请开票方式：在供应商中心【报价管理】-【发票与报销】栏目申请开票。</p></div><a href="javascript:;" class="quote-more"><i class="iconfont icon-xiajiantou"></i>展开更多</a><div class="quote-service-btn"><div class="quote-agreement"><input type="checkbox" title="已阅读并同意"><a href="">《报价收费协议》</a></div><a href="javascript:;" class="go-quote disabled">去付款</a></div></div></div> ',
            width: 866,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            },
            callback: function () {
                $("input[type='checkbox']").initCheckbox();

                //展开说明
                $(".quote-more").unbind().bind("click", function () {
                    if ($(this).hasClass("goUp")) {
                        $(this).removeClass("goUp");
                        $(".quote-des").css("height", "26px");
                    } else {
                        $(this).addClass("goUp");
                        $(".quote-des").css("height", "84px");
                    }
                    return false;
                });

                //勾选已阅读
                $(".quote-service-box input[type='checkbox']").unbind().bind("change", function () {
                    if ($(this).prop("checked")) {
                        $(".go-quote").removeClass("disabled");
                    } else {
                        $(".go-quote").addClass("disabled");
                    }
                });

                //去付款
                $(".go-quote").unbind().bind("click", function () {
                    if (!$(this).hasClass("disabled")) {

                    }
                    return false;
                });

                //选择支付方式
                $(".pay-cell").unbind().bind("click", function () {
                    $(".pay-con").find(".pay-cell").removeClass("cellChecked");
                    $(this).addClass("cellChecked");
                    return false;
                });

                //报价次数
                $("input.quote-cell-input").unbind().bind("input", function () {
                    libs.lenNumber(this, 0);
                    if (parseInt($(this).val()) >= 10) {
                        $(".quote_minus").removeClass("forbid_btn");
                    } else {
                        $(this).val(10);
                        $(".quote_minus").addClass("forbid_btn");
                    }
                    $(".quote-maney").find("span").html(parseInt($(this).val()) * 10);
                });
                $(".quote_minus").unbind().bind("click", function () {
                    var num = parseInt($("input.quote-cell-input").val()) - 1 < 0 ? 0 : parseInt($("input.quote-cell-input").val()) - 1;
                    if (num >= 10) {
                        $(this).removeClass("forbid_btn");
                        $("input.quote-cell-input").val(num);
                        $(".quote-maney").find("span").html(num * 10);
                    } else {
                        $(this).addClass("forbid_btn");
                    }
                    return false;
                });
                $(".quote_add").unbind().bind("click", function () {
                    var num = parseInt($("input.quote-cell-input").val()) + 1;
                    if (num >= 10) {
                        $(".quote_minus").removeClass("forbid_btn");
                    } else {
                        $(".quote_minus").addClass("forbid_btn");
                    }
                    $("input.quote-cell-input").val(num);
                    $(".quote-maney").find("span").html(num * 10);
                    return false;
                });
            }
        });
        $(".cjy-layer-inner").css("margin-top", "-20px");
    });

    // 商家入驻
    $(".apply_entry").off().on("click", function () {
        $.dialog({
            title: '',
            content: '<div class="apply-entry-box"><div class="apply-entry-bg"></div><div class="apply-entry-inner"><p>您好，您现在还未入驻生材网直采商城商家中心，入驻后即可使用。<br />如有任何疑问请致电&nbsp;<strong>027-82815329</strong>&nbsp;咨询</p><div class="apply-entry-btn"><button class="now-apply">马上申请商家入驻</button></div></div></div> ',
            width: 540,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            }
        });
        $(".cjy-layer-inner").css("margin-top", "-20px");
    });

    // 修改分类
    $(".edit_type").off().on("click", function () {
        $.dialog({
            title: "修改分类",
            content: '<div class="type-box"><div class="type-list clearfix"><div class="type-item"><label>一级分类：</label><select><option value="">请选择</option></select></div><div class="type-item"><label>二级分类：</label><select><option value="">请选择</option></select></div><div class="type-item"><label>三级分类：</label><select><option value="">请选择</option></select></div></div><p>您当前选择的商品类目是：<span>一级分类&nbsp;&gt;&nbsp;二级分类&nbsp;&gt;&nbsp;三级分类</span></p></div>',
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
        $(".type-box select").initSelect();
    });

    // 新增仓库
    $(".add_warehouse").off().on("click", function () {
        $.dialog({
            title: '新增仓库',
            content: `<div class="new-warehouse-box"><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库名称：</label><div class="warehouse-input"><input type="text" class="cjy-input-"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库地址：</label><div class="warehouse-input warehouse-search"><input type="text" class="cjy-input-" id="ware_addr"><i class="iconfont icon-sousuo search-ware"></i></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"></label><div class="warehouse-input"><div id="baiduMap"></div><p class="default_address"><input type="checkbox" title="" name="">设置为默认仓库地址<i class="iconfont icon-wenhao"></i></p></div></div></div>`,
            width: 800,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });

                function initialize() {
                    // 百度地图API功能
                    var map = new BMap.Map("baiduMap");
                    var point = new BMap.Point(114.30752, 30.60629);
                    map.centerAndZoom(point, 15);
                    var marker = new BMap.Marker(point); // 创建标注
                    map.addOverlay(marker); // 将标注添加到地图中
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); // 跳动的动画
                    map.enableScrollWheelZoom(true); // 启用滚轮放大缩小
                    // 建立一个自动完成的对象
                    var ac = new BMap.Autocomplete({
                        "input": "ware_addr",
                        "location": map
                    });

                    function setPlace() {
                        map.clearOverlays(); // 清除地图上所有覆盖物
                        function myFun() {
                            var pp = local.getResults().getPoi(0).point; // 获取第一个智能搜索的结果
                            map.centerAndZoom(pp, 15);
                            var _marker = new BMap.Marker(pp);
                            map.addOverlay(_marker); // 添加标注
                            _marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        }
                        var local = new BMap.LocalSearch(map, {
                            //智能搜索
                            onSearchComplete: myFun
                        });
                        local.search(myValue);
                    }
                    var myValue;
                    ac.addEventListener("onconfirm", function (e) {
                        // 鼠标点击下拉列表后的事件
                        var _value = e.item.value;
                        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                        setPlace();
                    });
                    $(".search-ware").off().on("click", function () {
                        myValue = $("#ware_addr").val();
                        setPlace();
                    });
                }
                initialize();
            }
        });
        $(".new-warehouse-box input[type='checkbox']").initCheckbox();
    });

    // 提示
    $(".tips_btn").off().on("click", function () {
        $.cueDialog({
            title: "提示",
            content: "确定要下架吗？",
            hint: "商品下架后，将不会在前台展示哦",
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
    });

    // 修改运费
    $(".edit_fare").off().on("click", function () {
        $.dialog({
            title: "修改运费",
            content: '<div class="fare-box clearfix"><label class="fare-label">运费：</label><div class="fare-input"><input type="text" class="cjy-input-"><span>&nbsp;元</span></div></div>',
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
    });

    // 上传付款凭证
    $(".upload_payment").off().on("click", function () {
        $.dialog({
            title: "上传付款凭证",
            content: '<div class="payment-box clearfix"><label class="payment-title">上传付款凭证：</label><div class="payment-content"><div class="payment-region clearfix"><div class="payment-area"><label class="upload-payment"for="uploadFile">上传文件</label><input type="file"name="uploadFile"id="uploadFile"></div><p><i class="iconfont icon-i"></i>格式为jpg，jpeg，png</p></div><ul class="payment-list"><li class="payment-item"><i class="iconfont icon-fujian"></i><a class="payment-link ellipsis"href="javascript:;"title="这里放名称，点击可预览">这里放名称，点击可预览</a></li></ul></div></div>',
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
    });

    // 新增收货地址
    $(".new_addr").off().on("click", function () {
        $.dialog({
            title: "新增收货地址",
            content: '<div class="shipping-box"><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>收货人：</label><div class="shipping-input"><input type="text" class="cjy-input-"></div></div><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>所在地区：</label><div class="shipping-input"><select><option value="">请选择</option></select><select><option value="">请选择</option></select><select><option value="">请选择</option></select></div></div><div class="shipping-item clearfix"><label class="shipping-label"><span>*</span>详细地址：</label><div class="shipping-input"><input type="text" class="cjy-input-"></div></div><div class="shipping-item clearfix"><label class="shipping-label">手机：</label><div class="shipping-input"><input type="text" class="cjy-input-"></div></div><div class="shipping-item clearfix"><label class="shipping-label">固定电话：</label><div class="shipping-input"><input type="text" class="cjy-input-"></div></div><p class="default_address"><input type="checkbox" title="设置为默认收货地址" name=""></p></div>',
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
        $(".shipping-box input[type='checkbox']").initCheckbox();
        $(".shipping-box select").initSelect();
    });

    // 新增增值税普通发票
    $(".new_invoice").off().on("click", function () {
        $.dialog({
            title: "新增增值税普通发票",
            content: '<div class="invoice-box"><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>发票抬头：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>纳税人识别号：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>注册地址：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>注册电话：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>开户银行：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>开户银行账号：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>邮寄地址：</label><div class="invoice-input"><select><option value="">请选择</option></select><select><option value="">请选择</option></select><select><option value="">请选择</option></select></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>详细收票地址：</label><div class="invoice-input"><input type="text"class="cjy-input-"></div></div><div class="invoice-item clearfix"><label class="invoice-label"><span>*</span>收票人：</label><div class="invoice-input"><input type="text"class="cjy-input-"id="receipts-name"placeholder="收票人姓名"><input type="text"class="cjy-input-"placeholder="联系手机号"id="receipts-phone"></div></div></div>',
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
        $(".invoice-box select").initSelect();
    });

    // 图片轮播、公司实力
    /* 
    图片轮播：您可以上传最多六张图片，建议您上传的图片尺寸大小为1920*420
    公司实力：展示内容：公司优势/工程项目/其他，您可以上传最多6张图片，建议您上传的图片尺寸大小为380*211
    */
    $(".upload_banner").off().on("click", function () {
        $.dialog({
            title: "图片轮播",
            content: '<div class="power-box"><div class="power-tips"><p><i class="iconfont icon-i"></i>您可以上传<b>最多六张图片</b>，建议您上传的图片尺寸大小为<b>1920*420</b></p></div><div class="power-list clearfix"><div class="power-item"><i class="iconfont icon-cha1"></i><div class="power-img"><img src="' + testImg + '" alt=""></div><input type="text" class="cjy-input-" placeholder="请输入banner图跳转链接"><i class="iconfont icon-lianjie"></i></div><div class="power-item"><i class="iconfont icon-cha1"></i><div class="power-img"><img src="' + testImg2 + '" alt=""></div><input type="text" class="cjy-input-" placeholder="请输入banner图跳转链接"></div><div class="upload-power"><label class="iconfont icon-shangchuanzhaopian" for="uploadpower"></label><input type="file" name="uploadFile" id="uploadpower"></div></div></div>',
            width: 800,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
            }
        });
    });

    // 主营产品
    $(".main_product").off().on("click", function () {
        $.dialog({
            title: "主营产品",
            content: '<div class="main-product"><div class="product-tips"><p><i class="iconfont icon-i"></i>最多选择<b>20</b>种主营产品</p></div><div class="product-area"><table class="product-table"><colgroup><col width="60"><col width="250"><col width="110"><col width="280"><col width="110"><col width="170"><col width="118"></colgroup><thead><tr><th></th><th class="text-center">标题</th><th>品名/品牌</th><th>属性</th><th>仓库</th><th>价格区间<span class="color999">（不含运费）</span></th><th>库存总量</th></tr></thead><tbody><tr><td class="text-center"><input type="checkbox" title=""></td><td><div class="product-intro clearfix"><figure class="product-photo"><img src=""></figure><p class="product-name">易切削钢12L14贵钢易切削钢12L14</p></div></td><td><div class="brand-area"><span>安全帽</span><span>普达（PUDA）</span></div></td><td><div class="attr-box"><p>属性值1/属性值2/属性值3</p><strong class="colorRed expand-btn">共6个属性组合<i class="iconfont icon-xiajiantou"></i></strong><div class="inner-table"><div class="expand-div"><table><colgroup><col width="17%"><col width="17%"><col width="17%"><col width="17%"><col width="16%"><col width="16%"></colgroup><thead><tr><th>尺寸</th><th>颜色</th><th>购买数量</th><th>单价<i class="iconfont icon-wenhao"></i></th><th>库存总量</th><th>库存预警数<i class="iconfont icon-wenhao"></i></th></tr></thead><tbody><tr><td rowspan="2">S</td><td rowspan="2">红</td><td class="multi-left color999">起订量300个及以上</td><td class="multi-right">12.00元/个</td><td rowspan="2">1000个</td><td rowspan="2">900个</td></tr><tr><td class="multi-left color999">起订量300个及以上</td><td class="multi-right">12.00元/个</td></tr><tr><td>S</td><td>红</td><td class="color999">起订量300个及以上</td><td>12.00元/个</td><td>1000个</td><td>900个</td></tr></tbody></table></div></div></div></td><td>三阳路仓库</td><td><strong class="colorRed">11.00</strong>元/个</td><td>1000个</td></tr></tbody></table></div><p class="had-select">已选择3个商品</p></div>',
            width: 1160,
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });

                $(".expand-btn").off().on("click", function () {
                    var that = $(this);
                    var innerTable = that.parents(".attr-box").find(".inner-table");
                    if (that.find("i").hasClass("icon-xiajiantou")) {
                        that.find("i").removeClass("icon-xiajiantou").addClass("icon-shangjiantou");
                        innerTable.find(".expand-div").css("display", "block");
                    } else {
                        that.find("i").removeClass("icon-shangjiantou").addClass("icon-xiajiantou");
                        innerTable.find(".expand-div").css("display", "none");
                    }
                });
            }
        });
        $(".main-product input[type='checkbox']").initCheckbox();
    });
});