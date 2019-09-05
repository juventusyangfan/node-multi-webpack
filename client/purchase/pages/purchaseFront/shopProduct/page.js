/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
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
            loading: true,//loading图
            list: [],//商品列表
            count: 0,//商品总数
            current: 1,//当前分页
            companyId: libs.getUrlParam('company_id') || 0,//公司id
            fid: libs.getUrlParam('fid') || 0,//一级分类id
            fname: '',//一级分类名称
            fArr: [],//一级分类数组
            pid: libs.getUrlParam('pid') || 0,//二级分类id
            pname: '',//二级分类名称
            pArr: [],//二级分类数组
            cid: libs.getUrlParam('cid') || 0,//三级分类id
            cname: '',//三级分类名称
            cArr: [],//三级分类数组
            brandid: libs.getUrlParam('brand_id') || 0,//品牌id
            brandname: '',//品牌名称
            brandArr: [],//品牌数组
            specattrArr: [],//规格属性数组
            specattrSelArr: [],//选中了的规格属性数组
            city_id: libs.getUrlParam('city_id') || 0,//城市id
            cityArr: [],//城市列表
            area_id: libs.getUrlParam('area_id') || 0,//地区id
            areaArr: [],//地区列表
            sort: 0,//排序规则
            product_name: libs.getUrlParam('product_name') || ""//搜索的商品名称
        },
        mounted() {
            this.getProInfo(1);
            this.$nextTick(() => {
                $("select").attr("value", this.city_id).removeAttr("noRender").initSelect();
                $("select").unbind().bind("change", function () {
                    vueObj.city_id = $(this).val();
                    vueObj.getProInfo(1)
                });
                showMore();//判断显示更多
            });
        },
        methods: {
            getProInfo(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                var specattrUrl = "";
                for (var i = 0; i < vueObj.specattrSelArr.length; i++) {
                    specattrUrl += "&" + vueObj.specattrSelArr[i].typeId + "=" + vueObj.specattrSelArr[i].id;
                }
                let hashVal = '';
                if (vueObj.product_name != "") {
                    hashVal = 'company_id=' + vueObj.companyId + '&p=' + vueObj.current + '&product_name=' + vueObj.product_name + '&city_id=' + vueObj.city_id + '&area_id=' + vueObj.area_id + '&sort=' + vueObj.sort
                }
                else {
                    hashVal = 'company_id=' + vueObj.companyId + '&p=' + vueObj.current + '&fid=' + vueObj.fid + '&pid=' + vueObj.pid + '&cid=' + vueObj.cid + '&brand_id=' + vueObj.brandid + specattrUrl + '&city_id=' + vueObj.city_id + '&area_id=' + vueObj.area_id + '&sort=' + vueObj.sort
                }
                window.history.replaceState({}, "商品列表", window.location.origin + window.location.pathname + '?' + hashVal);
                if (vueObj.product_name != "") {
                    $.get(config.shopPath + 'goods/indexProductNameAjax?' + hashVal, function (dataObj) {
                        dataObj = JSON.parse(dataObj);
                        if (dataObj.code === 2000) {
                            vueObj.count = dataObj.data.product_list.count;
                            if (vueObj.count == 0) {
                                vueObj.current = 0
                            }
                            vueObj.list = dataObj.data.product_list.list;
                            vueObj.$nextTick(() => {
                                showMore();//判断显示更多
                            });

                            $("#productList").find(".pList_header").show();
                            $("#productList").find(".pList_body").show();
                        }
                        vueObj.loading = false;
                    });
                }
                else {
                    $.get(config.shopPath + 'company/indexAjax?' + hashVal, function (dataObj) {
                        dataObj = JSON.parse(dataObj);
                        if (dataObj.code === 2000) {
                            vueObj.count = dataObj.data.product_list.count;
                            if (vueObj.count == 0) {
                                vueObj.current = 0
                            }
                            vueObj.list = dataObj.data.product_list.list;
                            if (dataObj.data.selected.fid && dataObj.data.selected.fid != 0) {
                                vueObj.fid = dataObj.data.selected.fid.id;
                                vueObj.fname = dataObj.data.selected.fid.name;
                            }
                            vueObj.fArr = dataObj.data.category_search.first_category;
                            if (dataObj.data.selected.pid && dataObj.data.selected.pid != 0) {
                                vueObj.pid = dataObj.data.selected.pid.id;
                                vueObj.pname = dataObj.data.selected.pid.name;
                            }
                            vueObj.pArr = dataObj.data.category_search.parent_category;
                            if (dataObj.data.selected.cid && dataObj.data.selected.cid != 0) {
                                vueObj.cid = dataObj.data.selected.cid.id;
                                vueObj.cname = dataObj.data.selected.cid.name;
                            }
                            vueObj.cArr = dataObj.data.category_search.category;
                            if (dataObj.data.selected.brand_id && dataObj.data.selected.brand_id != 0) {
                                vueObj.brandid = dataObj.data.selected.brand_id.id;
                                vueObj.brandname = dataObj.data.selected.brand_id.name;
                            }
                            vueObj.brandArr = [];
                            for (var key in dataObj.data.brand_search) {
                                let obj = {
                                    id: key,
                                    name: dataObj.data.brand_search[key]
                                }
                                vueObj.brandArr.push(obj);
                            }
                            vueObj.specattrSelArr = [];
                            if (dataObj.data.selected.attr) {
                                let attr = dataObj.data.selected.attr;
                                for (var i = 0; i < attr.length; i++) {
                                    let obj = {
                                        typeId: attr[i].id,
                                        typeName: attr[i].name,
                                        id: attr[i].values.id,
                                        name: attr[i].values.name
                                    }
                                    vueObj.specattrSelArr.push(obj);
                                }
                            }
                            if (dataObj.data.selected.spec) {
                                let spec = dataObj.data.selected.spec;
                                for (var i = 0; i < spec.length; i++) {
                                    let obj = {
                                        typeId: spec[i].id,
                                        typeName: spec[i].name,
                                        id: spec[i].values.id,
                                        name: spec[i].values.name
                                    }
                                    vueObj.specattrSelArr.push(obj);
                                }
                            }
                            vueObj.specattrArr = [];
                            vueObj.specattrArr = vueObj.specattrArr.concat(dataObj.data.spec_attr_search.attr);
                            vueObj.specattrArr = vueObj.specattrArr.concat(dataObj.data.spec_attr_search.spec);

                            vueObj.$nextTick(() => {
                                showMore();//判断显示更多
                            });

                            $("#productList").find(".pList_header").show();
                            $("#productList").find(".pList_body").show();
                        }
                        vueObj.loading = false;
                    });
                }
            },
            changeFid(id, name) {
                this.fid = id;
                this.fname = name;
                this.pid = 0;
                this.pname = '';
                this.cid = 0;
                this.cname = '';
                this.getProInfo(1);
            },
            changePid(id, name) {
                this.pid = id;
                this.pname = name;
                this.cid = 0;
                this.cname = '';
                this.getProInfo(1);
            },
            changeCid(id, name) {
                this.cid = id;
                this.cname = name;
                this.getProInfo(1);
            },
            changeBrand(id, name) {
                this.brandid = id;
                this.brandname = name;
                this.getProInfo(1);
            },
            changeAttr(typeId, typeName, id, name) {
                let obj = {
                    typeId: typeId,
                    typeName: typeName,
                    id: id,
                    name: name
                }
                this.specattrSelArr.push(obj);
                this.getProInfo(1);
            },
            changeSort(sort) {
                if (this.sort == 1 && sort == 1) {
                    this.sort = 2;
                }
                else if (this.sort == 2 && sort == 1) {
                    this.sort = 1;
                }
                else {
                    this.sort = sort;
                }
                this.getProInfo(1);
            },
            changePage(type) {
                if (type == "down") {
                    if (this.current === 1) {
                        return
                    }
                    this.current--;
                }
                else {
                    if (this.current === Math.ceil(this.count / 25)) {
                        return
                    }
                    this.current++;
                }
            },
            delBrand() {
                this.brandid = 0;
                this.brandname = '';
                this.getProInfo(1);
            },
            delAttr(typeId, id) {
                let arr = this.specattrSelArr;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].typeId == typeId && arr[i].id == id) {
                        this.specattrSelArr.splice(i, 1);
                    }
                }
                this.getProInfo(1);
            },
            clearAll() {
                this.fid = 0;
                this.fname = '';
                this.pid = 0;
                this.pname = '';
                this.cid = 0;
                this.cname = '';
                this.brandid = 0;
                this.brandname = '';
                this.brandArr = [];
                this.specattrArr = [];
                this.specattrSelArr = [];
                this.getProInfo(1)
            }
        }
    });

    //展开收起
    $("#productList").on("click", ".pList_sel_btn", function () {
        if ($(this).find("i.icon-xiajiantou").length > 0) {
            $(this).parent().find(".pList_sel_list").css("height", "auto");
            $(this).html('收起<i class="iconfont icon-shangjiantou"></i>');
        }
        else {
            $(this).parent().find(".pList_sel_list").css("height", "50px");
            $(this).html('更多<i class="iconfont icon-xiajiantou"></i>');
        }
        return false;
    });

    //判断更多按钮显示隐藏
    function showMore(){
        $(".pList_sel_inner").each(function () {
            if ($(this).height() > 50) {
                $(this).parents(".pList_sel_line").find(".pList_sel_btn").show();
            }
            else {
                $(this).parents(".pList_sel_line").find(".pList_sel_btn").hide();
            }
        });
    }
});