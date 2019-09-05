/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';
const config = require('configModule');
const libs = require('libs');

$(() => {
    //发布公示
    $(".room_btn_publish").unbind().bind("click", function () {
        var dHTML = '<div class="cgs-content" id="tenderInfo"><div class="cgs-p"><p><span>回标进度：</span><span class="marginR25 online_count"></span></p><p><span>招标/报价有效性：</span><select name="status"><option value="">请选择</option><option value="4">有效</option><option value="5">无效</option></select></p><p class="discard_box" style="display: none;"><span style="vertical-align: top;">废标说明：</span><textarea class="cjy-textarea" maxlen="200" rows="3" name="discardExplain" style="width: 600px;"></textarea></p></div><div class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>分数</th><th>选择中标/成交候选人</th><th v-if="proType !== 1">中标金额</th><th v-if="proType == 1">中标金额-钢筋类</th><th v-if="proType == 1">中标金额-非钢筋类</th><th>备注</th></tr></thead>';
        dHTML += '<tbody class="page_list">';
        dHTML += '<tr v-if="loading"><td colspan="6"><div class="page_loading"></div></td></tr>';
        dHTML += '<tr v-if="list.length>0" v-for="(item,index) in list"><td>{{index+1}}</td><td><p class="ellipsis">{{item.companyName}}</p></td><td>{{item.score}}</td><td><input type="checkbox" name="winSupplier" :value="item.supplierId" v-model="item.checked" title="" /></td><td v-if="proType !== 1"><input type="text" name="fgprice" :supplier-id="item.supplierId" class="cjy-input-" :value="item.fgprice" :supplierId="item.supplierId" placeholder="中标金额" autocomplete="off"></td><td v-if="proType == 1"><input type="text" name="gprice" :supplier-id="item.supplierId" class="cjy-input-" :value="item.gprice" :supplierId="item.supplierId" placeholder="钢筋类" autocomplete="off"></td><td v-if="proType == 1"><input type="text" name="fgprice" :supplier-id="item.supplierId" class="cjy-input-" :value="item.fgprice" :supplierId="item.supplierId" placeholder="非钢筋类" autocomplete="off"></td><td><textarea type="text" name="note" :supplier-id="item.supplierId" class="cjy-input-" :value="item.note" placeholder="备注" :supplierId="item.supplierId" maxlen="50" rows="3" style="width: 200px;"></textarea></td></tr>';
        dHTML += '<tr v-else><td colspan="6"><div class="page_list_noneBg"></div><p class="page_list_noneCon" style="width: 100%;margin-bottom: 60px;font-size: 24px;color: #999;text-align: center;">没有找到相关内容</p></td></tr>';
        dHTML += '</tbody>';
        dHTML += '</table></div><div class="cgs-p"><p><input type="checkbox" name="pulicPrice" title="公开最终总价" checked/></p><p class="color333">公示期限：<select name="winDate"><option value="">请选择</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option></select>天。（自发布之日起）</p></div>';
        dHTML += '<div id="pages" class="page_container_wrap"><vue-page @get-list="getTender" :count="count" :limit="10" v-if="list.length>0"></vue-page></div>';
        dHTML += '</div>';
        $.dialog({
            title: '录入招标结果',
            content: dHTML,
            width: 1110,
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
                    var reqData = null;
                    if ($("select[name='status']").val() === "") {
                        $.msgTips({
                            type: "warning",
                            content: "请选择招标有效性"
                        });
                        return false;
                    }
                    if ($("select[name='status']").val() === "4") {
                        // 有效
                        var supplierArr = vm.selectIdArr;
                        var gpriceArr = vm.gprice;
                        var fgpriceArr = vm.fgprice;
                        var noteArr = vm.note;
                        var pulic_price = null;
                        var isBreak = false;
                        if (supplierArr.length === 0) {
                            $.msgTips({
                                type: "warning",
                                content: "请选择中标/成交候选人"
                            });
                            return false;
                        }
                        for (let i = 0; i < supplierArr.length; i++) {
                            if ($("input[name='gprice']").length > 0) {
                                if ($("input[supplierid='" + supplierArr[i] + "']").eq(0).val() === "") {
                                    isBreak = true;
                                    break;
                                }
                                if ($("input[supplierid='" + supplierArr[i] + "']").eq(1).val() === "") {
                                    isBreak = true;
                                    break;
                                }
                            } else {
                                if ($("input[supplierid='" + supplierArr[i] + "']").eq(0).val() === "") {
                                    isBreak = true;
                                    break;
                                }
                            }
                        }
                        if (isBreak) {
                            $.msgTips({
                                type: "warning",
                                content: "请输入中标金额"
                            });
                            return false;
                        }
                        if ($("select[name='winDate']").val() === "") {
                            $.msgTips({
                                type: "warning",
                                content: "请选择公示期限"
                            });
                            return false;
                        }
                        if ($("input[name='pulicPrice']").is(":checked")) {
                            pulic_price = 1;
                        } else {
                            pulic_price = -1;
                        }
                        reqData = 'tenderId=' + $("input[name='tender_id']").val() + '&status=' + $("select[name='status']").val() + '&pulicPrice=' + pulic_price + '&winDate=' + $("select[name='winDate']").val();
                        for (let i = 0; i < supplierArr.length; i++) {
                            reqData += ('&winArr[supplierId][' + i + ']=' + supplierArr[i]);
                            if ($("input[name='gprice']").length > 0) {
                                reqData += ('&winArr[gprice][' + i + ']=' + (gpriceArr[supplierArr[i]] ? gpriceArr[supplierArr[i]] : 0));
                                reqData += ('&winArr[fgprice][' + i + ']=' + (fgpriceArr[supplierArr[i]] ? fgpriceArr[supplierArr[i]] : 0));
                                reqData += ('&winArr[note][' + i + ']=' + (noteArr[supplierArr[i]] ? noteArr[supplierArr[i]] : ""));
                            } else {
                                reqData += ('&winArr[gprice][' + i + ']=0');
                                reqData += ('&winArr[fgprice][' + i + ']=' + (fgpriceArr[supplierArr[i]] ? fgpriceArr[supplierArr[i]] : 0));
                                reqData += ('&winArr[note][' + i + ']=' + (noteArr[supplierArr[i]] ? noteArr[supplierArr[i]] : ""));
                            }
                        }
                    } else {
                        // 无效
                        if ($.trim($("textarea[name='discardExplain']").val()) === "") {
                            $.msgTips({
                                type: "warning",
                                content: "请填写废标说明"
                            });
                            return false;
                        }
                        reqData = {
                            tenderId: $("input[name='tender_id']").val(),
                            status: $("select[name='status']").val(),
                            discardExplain: $("textarea[name='discardExplain']").val()
                        };
                    }
                    $.ajaxForJson(config.pingbiaoPath + 'CollectTender/inputTenderResult', reqData, function (json) {
                        if (json.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: json.msg,
                                callback: function () {
                                    window.location.href = config.bidPath + "announce/details/" + $("input[name='tender_id']").val() + ".html";
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: json.msg
                            });
                        }
                    });
                });
            }
        });

        var vm = new Vue({
            el: '#tenderInfo',
            data() {
                return {
                    loading: true,
                    list: [],
                    count: 0,
                    limit: 10,
                    current: 1,
                    selectIdArr: [],
                    gprice: [],
                    fgprice: [],
                    note: [],
                    proType: 0,
                    unitPrice: false
                }
            },
            mounted() {
                this.getTender(1);
            },
            methods: {
                getTender(currentPage) {
                    var that = this;
                    that.loading = true;
                    that.current = currentPage || that.current;
                    $.ajaxForJson(config.pingbiaoPath + 'CollectTender/publicityTenderAjax', {
                        tender_id: $("input[name='tender_id']").val(),
                        tender_package_id: "",
                        bidType: "1",
                        page: that.current
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            that.proType = dataObj.data.proType;
                            that.count = dataObj.data.count;
                            for (var i = 0; i < dataObj.data.data.length; i++) {
                                let id = dataObj.data.data[i].supplierId;
                                dataObj.data.data[i]['checked'] = that.selectIdArr.indexOf(id) > -1 ? true : false;
                                dataObj.data.data[i]['gprice'] = typeof (that.gprice[id]) != "undefined" ? that.gprice[id] : "";
                                dataObj.data.data[i]['fgprice'] = typeof (that.fgprice[id]) != "undefined" ? that.fgprice[id] : "";
                                dataObj.data.data[i]['note'] = typeof (that.note[id]) != "undefined" ? that.note[id] : "";
                            }
                            that.list = dataObj.data.data;
                            that.$nextTick(function () {
                                $(".online_count").html(that.count + '家');
                                $(".cgs-content input[type='checkbox']").initCheckbox();
                                // $(".cgs-content textarea").initTextarea();
                                $("select[name='status']").off().on("change", function () {
                                    var main = $(this);
                                    if (main.val() === "5") {
                                        $(".discard_box").css("display", "block");
                                        $(".cgs-table").css("display", "none");
                                        $(".cgs-p").eq(1).css("display", "none");
                                        $("#pages").css("display", "none");
                                    } else {
                                        $(".discard_box").css("display", "none");
                                        $(".cgs-table").css("display", "block");
                                        $(".cgs-p").eq(1).css("display", "block");
                                        $("#pages").css("display", "block");
                                    }
                                });
                                $(".cgs-table").on("input", "input[name='gprice'],input[name='fgprice']", function () {
                                    var main = $(this);
                                    libs.lenNumber(main[0], 2);
                                    let id = main.attr("supplierId");
                                    if (main.attr("name") == "gprice") {
                                        that.gprice[id] = main.val();
                                    } else if (main.attr("name") == "fgprice") {
                                        that.fgprice[id] = main.val();
                                    }
                                });
                                $(".cgs-table").on("input", "textarea[name='note']", function () {
                                    var main = $(this);
                                    let id = main.attr("supplierId");
                                    that.note[id] = main.val();
                                });
                                $("input[name='winSupplier']").unbind().bind("change", function () {
                                    let id = $(this).val();
                                    if ($(this).is(":checked")) {
                                        that.selectIdArr.push(id);
                                    } else {
                                        that.selectIdArr.remove(id);
                                    }
                                });
                            });
                        }
                        that.loading = false;
                    });
                }
            }

        });


        $(".cgs-content select").initSelect();
        $(".cgs-content textarea").initTextarea();
        return false;
    });
});