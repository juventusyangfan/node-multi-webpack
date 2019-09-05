/**
 * Created by yangfan on 2017/7/6.
 */
require('elem');
require('cp');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    var vm = new Vue({
        el: '#productList',
        data: {
            imgPath: config.filePath,
            loading: true, //loading图
            list: [], //商品列表
            count: 0, //商品总数
            current: 1, //当前分页
            fid: libs.getUrlParam('fid') || 0, //一级分类id
            fArr: [], //一级分类元素集合
            fName: "", //一级分类名称
            pid: libs.getUrlParam('pid') || 0, //二级分类id
            pArr: [], //二级分类元素集合
            pName: "", //二级分类名称
            cid: libs.getUrlParam('cid') || 0, //三级分类id
            cArr: [], //三级分类元素集合
            cName: "", //三级分类名称
            province_id: libs.getUrlParam('province_id') || 0, //城市id
            provinceArr: [], //城市列表
            city_id: libs.getUrlParam('city_id') || 0, //地区id
            cityArr: [], //地区列表
            title: libs.getUrlParam('title') || "", //询价单名称
            company_name: libs.getUrlParam('company_name') || "", //公司名称
            product_name: libs.getUrlParam('product_name') || "", //品名
            sort: 1 //排序规则
        },
        mounted() {
            this.getProInfo(1);
            this.$nextTick(() => {
                $("select").attr("value", this.province_id).removeAttr("noRender").initSelect();
                $("select").unbind().bind("change", function () {
                    vueObj.province_id = $(this).val();
                    vueObj.getProInfo(1)
                });
                showMore(); //判断显示更多
            });
        },
        methods: {
            getProInfo(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                let hashVal = 'p=' + vueObj.current + '&fid=' + vueObj.fid + '&pid=' + vueObj.pid + '&cid=' + vueObj.cid + '&province_id=' + vueObj.province_id + '&city_id=' + vueObj.city_id + '&sort=' + vueObj.sort + "&title=" + vueObj.title + "&company_name=" + vueObj.company_name + "&product_name=" + vueObj.product_name;
                if(window.history.replaceState){
                    window.history.replaceState({}, "快捷询价", window.location.origin + window.location.pathname + '?' + hashVal);
                }
                $.get(config.inquiryPath + '/inquiryListAjax?' + hashVal, function (dataObj) {
                    dataObj = JSON.parse(dataObj);
                    if (dataObj.code === 2000) {
                        vueObj.count = dataObj.data.inquiry_list.count;
                        if (vueObj.count == 0) {
                            vueObj.current = 0
                        }
                        vueObj.list = dataObj.data.inquiry_list.data;
                        for (var i = 0; i < vueObj.list.length; i++) {
                            if (vueObj.list[i].remain_days != "") {
                                var timeArr = vueObj.list[i].remain_days.split(":");
                                vueObj.$set(vueObj.list[i], 'days', timeArr[0]);
                                vueObj.$set(vueObj.list[i], 'hours', timeArr[1]);
                                vueObj.$set(vueObj.list[i], 'min', timeArr[2]);
                            }
                        }
                        if (dataObj.data.selected.fid) {
                            vueObj.fid = dataObj.data.selected.fid.id;
                            vueObj.fName = dataObj.data.selected.fid.name;
                        }
                        vueObj.fArr = dataObj.data.category_search.first_category;
                        if (dataObj.data.selected.pid) {
                            vueObj.pid = dataObj.data.selected.pid.id;
                            vueObj.pName = dataObj.data.selected.pid.name;
                        }
                        vueObj.pArr = dataObj.data.category_search.parent_category;
                        if (dataObj.data.selected.cid) {
                            vueObj.cid = dataObj.data.selected.cid.id;
                            vueObj.cName = dataObj.data.selected.cid.name;
                        }
                        vueObj.cArr = dataObj.data.category_search.category;

                        if (dataObj.data.accept_area.province_info) {
                            vueObj.provinceArr = dataObj.data.accept_area.province_info;
                            vueObj.$nextTick(() => {
                                $("select[name='province_code']").attr("value", vueObj.province_id).removeAttr("noRender").initSelect();
                                $("select[name='province_code']").unbind().bind("change", function () {
                                    vueObj.province_id = $(this).val();
                                    vueObj.city_id = 0;
                                    vueObj.cityArr = [];
                                    $("select[name='city_code']").attr("value", 0).removeAttr("noRender").html('<option value="0">不限市</option>').initSelect();
                                    vueObj.getProInfo(1)
                                });
                            });
                        }
                        if (dataObj.data.accept_area.city_info && vueObj.province_id != 0) {
                            vueObj.cityArr = dataObj.data.accept_area.city_info;
                            vueObj.$nextTick(() => {
                                $("select[name='city_code']").attr("value", vueObj.city_id).removeAttr("noRender").initSelect();
                                $("select[name='city_code']").unbind().bind("change", function () {
                                    vueObj.city_id = $(this).val();
                                    vueObj.getProInfo(1)
                                });
                            });
                        }

                        vueObj.$nextTick(() => {
                            showMore(); //判断显示更多
                        });

                        $("#productList").find(".pList_header").show();
                        $("#productList").find(".pList_body").show();
                    }
                    vueObj.loading = false;
                });
            },
            changeSort(sort) {
                this.sort = sort;
                this.getProInfo(1);
            },
            changePage(type) {
                if (type == "down") {
                    if (this.current === 1) {
                        return
                    }
                    this.current--;
                } else {
                    if (this.current === Math.ceil(this.count / 10)) {
                        return
                    }
                    this.current++;
                }
                this.getProInfo(this.current);
            },
            goQuote(id) {
                $.ajaxForJson(config.inquiryPath + "/index/ajaxLoginStatus", null, function (dataObj) {
                    if (dataObj.code == "2000") {
                        window.location.href = "/inquiry/detail?inquiry_id=" + id;
                    }
                });
            }
        }
    })

    // 通知滚动效果
    $(".js_supplier").initSupplier();//纵向


    //展开收起
    $("#productList").on("click", ".pList_sel_btn", function () {
        var _height = parseInt($(this).parent().find(".pList_sel_inner").height() / 50) * 50;
        if ($(this).find("i.icon-xiajiantou").length > 0) {
            $(this).parent().find(".pList_sel_list").css("height", _height + "px");
            $(this).html('收起<i class="iconfont icon-shangjiantou"></i>');
        } else {
            $(this).parent().find(".pList_sel_list").css("height", "50px");
            $(this).html('更多<i class="iconfont icon-xiajiantou"></i>');
        }
        return false;
    });

    //判断更多按钮显示隐藏
    function showMore() {
        $(".pList_sel_inner").each(function () {
            if ($(this).height() > 53) {
                $(this).parents(".pList_sel_line").find(".pList_sel_btn").show();
            } else {
                $(this).parents(".pList_sel_line").find(".pList_sel_btn").hide();
            }
        });
    }
    showMore();
});