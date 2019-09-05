require('cp');
require('elem');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    //获取包件供应商
    var vmList = new Vue({
        el: '#supplierList',
        data() {
            return {
                loading: true,
                list: []
            }
        },
        mounted() {
            this.getSupplier();
        },
        methods: {
            getSupplier() {
                var that = this;
                var inputObj = $("input[name='pName']:checked").length > 0 ? $("input[name='pName']:checked") : $("input[name='packageId']");
                if (inputObj.attr("listObj")) {
                    that.list = JSON.parse(inputObj.attr("listObj"));
                } else {
                    that.loading = true;
                    $.ajaxForJson(config.wwwPath + "/buyer/tender/applyList", {
                        package_id: $(".keyUl li.act").attr("package_id")
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.list = dataObj.data;
                            if (that.list.length > 0) {
                                for (var i = 0; i < that.list.length; i++) {
                                    var _typeStr = that.list[i].supplier_type == 1 ? "我的供应商" : "生材网供应商";
                                    that.$set(that.list[i], "typeStr", _typeStr);
                                }
                                inputObj.attr("listObj", JSON.stringify(that.list));
                            }
                        }
                        that.loading = false;
                    });
                }
            }
        }
    });

    //报价切换
    $(".keyUl").find("a").unbind().bind("click", function () {
        $(".keyUl").find("li.act").removeClass("act");
        $(this).parent().addClass("act");
        vmList.getSupplier();
        return false;
    });

    //直接发布
    $(".btn_publish").unbind().bind("click", function () {
        $.ajaxForJson(config.wwwPath + "buyer/tender/publishAjax", {
            tenderId: $("input[name='tenderId']").val()
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: "成功",
                    callback: function () {
                        window.location.href = dataObj.data.url;
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});