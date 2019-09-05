require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');

$(() => {
    var vm = new Vue({
        el: '#warehouse',
        data: {
            loading: true,
            list: [],
            count: 0,
            limit: 10,
            current: 1
        },
        mounted() {
            this.getWarehouse(1);
        },
        methods: {
            getWarehouse(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.shopPath + "/Seller/warehouse/indexAjax", {
                    p: vueObj.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        vueObj.count = dataObj.data.count;
                        vueObj.list = dataObj.data.list;
                    }
                    vueObj.loading = false;
                }, function () {
                    vueObj.loading = false;
                    vueObj.list = [];
                    vueObj.count = 0;
                });
            },
            editWarehouse(id) {
                $.ajaxForJson(config.shopPath + "Seller/warehouse/getWarehouseAjax", {
                    warehouse_id: id
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        var checkVal = dataObj.data.is_default == "1" ? "checked" : "";
                        $.dialog({
                            title: '编辑仓库',
                            content: '<div class="new-warehouse-box"><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库名称：</label><div class="warehouse-input"><input type="text" class="cjy-input-" name="warehouseName" value="' + dataObj.data.name + '"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库地址：</label><div class="warehouse-input warehouse-search"><input type="text" class="cjy-input-" id="ware_addr" value="' + dataObj.data.address + '"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"></label><div class="warehouse-input"><div id="baiduMap"></div><p class="default_address"><input type="checkbox" title="" name="isDefault" ' + checkVal + '>设置为默认仓库地址<i class="iconfont icon-wenhao"></i></p></div></div></div>',//<i class="iconfont icon-sousuo search-ware"></i>
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
                                var city = dataObj.data.city, area = dataObj.data.area, address = dataObj.data.address, pointStr = dataObj.data.point;
                                $(".cjy-cancel-btn").unbind().bind("click", function () {
                                    $(".cjy-poplayer").remove();
                                    $(".cjy-bg").remove();
                                    return false;
                                });
                                $(".cjy-confirm-btn").off().on("click", function () {
                                    if ($("input[name='warehouseName']").val() == "") {
                                        $.msgTips({
                                            type: "warning",
                                            content: "请填写仓库名称"
                                        });
                                        return false;
                                    }
                                    else if (pointStr == "") {
                                        $.msgTips({
                                            type: "warning",
                                            content: "请从搜索列表中选中正确的仓库地址"
                                        });
                                        return false;
                                    }
                                    //添加仓库提交
                                    var isDefault = $("input[name='isDefault']").prop("checked") ? 1 : 0;
                                    $.ajaxForJson(config.shopPath + "/Seller/warehouse/saveWarehouseAjax", {
                                        name: $("input[name='warehouseName']").val(),
                                        city: city,
                                        area: area,
                                        address: address,
                                        point: pointStr,
                                        is_default: isDefault,
                                        warehouse_id: id
                                    }, function (dataObj) {
                                        if (dataObj.code == 2000) {
                                            $.msgTips({
                                                type: "success",
                                                content: dataObj.msg
                                            });
                                            $(".cjy-poplayer").remove();
                                            $(".cjy-bg").remove();
                                            setTimeout(function () {
                                                window.location.reload();
                                            }, 1000);
                                        }
                                        else {
                                            $.msgTips({
                                                type: "warning",
                                                content: dataObj.msg
                                            });
                                        }
                                    });
                                    return false;
                                });
                                //输入仓库地址时删除地图信息
                                $("#ware_addr").bind("input", function () {
                                    city = "";
                                    area = "";
                                    address = "";
                                    pointStr = "";
                                });

                                function initialize() {
                                    // 百度地图API功能
                                    var map = new BMap.Map("baiduMap");
                                    var point = new BMap.Point(pointStr.split(",")[0], pointStr.split(",")[1]);
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
                                    ac.setInputValue(address);
                                    function setPlace() {
                                        map.clearOverlays();// 清除地图上所有覆盖物
                                        function myFun() {
                                            var pp = local.getResults().getPoi(0).point;// 获取第一个智能搜索的结果
                                            map.centerAndZoom(pp, 15);
                                            var _marker = new BMap.Marker(pp);
                                            map.addOverlay(_marker);// 添加标注
                                            _marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                                            pointStr = pp.lng + ',' + pp.lat;
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
                                        city = _value.city;
                                        area = _value.district;
                                        address = _value.business;
                                        setPlace();
                                    });
                                }
                                initialize();
                            }
                        });
                        $(".new-warehouse-box input[type='checkbox']").initCheckbox();
                    }
                });
            },
            delWarehouse(id) {
                $.cueDialog({
                    title: "提示",
                    content: "您确认删除此条仓库信息？",
                    callback: function () {
                        $.ajaxForJson(config.shopPath + "Seller/warehouse/deleteWarehouseAjax", {
                            warehouse_id: id
                        }, function (dataObj) {
                            if (dataObj.code === 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: dataObj.msg
                                });
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    }
                });
            },
            defaultWarehouse(id) {
                $.cueDialog({
                    title: "提示",
                    content: "您确认将此仓库设为默认吗？",
                    callback: function () {
                        $.ajaxForJson(config.shopPath + "Seller/warehouse/defaultWarehouseAjax", {
                            warehouse_id: id
                        }, function (dataObj) {
                            if (dataObj.code === 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: dataObj.msg
                                });
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    }
                });
            }
        }

    });

    //新增仓库
    $("#warehouse_add").unbind().bind("click", function () {
        $.dialog({
            title: '新增仓库',
            content: '<div class="new-warehouse-box"><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库名称：</label><div class="warehouse-input"><input type="text" placeholder="请输入2-6个字符" class="cjy-input-" name="warehouseName"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"><span>*</span>仓库地址：</label><div class="warehouse-input warehouse-search"><input type="text" class="cjy-input-" id="ware_addr"></div></div><div class="warehouse-item clearfix"><label class="warehouse-label"></label><div class="warehouse-input"><div id="baiduMap"></div><p class="default_address"><input type="checkbox" title="" name="isDefault">设置为默认仓库地址<i class="iconfont icon-wenhao"></i></p></div></div></div>',//<i class="iconfont icon-sousuo search-ware"></i>
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
                var city = "", area = "", address = "", pointStr = "";
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    if ($("input[name='warehouseName']").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请填写仓库名称"
                        });
                        return false;
                    }
                    else if (pointStr == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请从搜索列表中选中正确的仓库地址"
                        });
                        return false;
                    }
                    //添加仓库提交
                    var isDefault = $("input[name='isDefault']").prop("checked") ? 1 : 0;
                    $.ajaxForJson(config.shopPath + "/Seller/warehouse/saveWarehouseAjax", {
                        name: $("input[name='warehouseName']").val(),
                        city: city,
                        area: area,
                        address: address,
                        point: pointStr,
                        is_default: isDefault
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg
                            });
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        }
                        else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    });
                    return false;
                });
                //输入仓库地址时删除地图信息
                $("#ware_addr").bind("input", function () {
                    city = "";
                    area = "";
                    address = "";
                    pointStr = "";
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
                        map.clearOverlays();// 清除地图上所有覆盖物
                        function myFun() {
                            var pp = local.getResults().getPoi(0).point;// 获取第一个智能搜索的结果
                            map.centerAndZoom(pp, 15);
                            var _marker = new BMap.Marker(pp);
                            map.addOverlay(_marker);// 添加标注
                            _marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                            pointStr = pp.lng + ',' + pp.lat;
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
                        city = _value.city;
                        area = _value.district;
                        address = _value.business;
                        setPlace();
                    });
                }
                initialize();
            }
        });
        $(".new-warehouse-box input[type='checkbox']").initCheckbox();
        return false;
    });
});