require('cp');
require('elem');
require('../../../public-resource/css/componentOther.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
const config = require('configModule');
import Vue from 'vue';

$(() => {
    //选择公司内容
    $("tbody.page_list").find("input[type='radio']").unbind().bind("change", function () {
        if ($(this).val() == "1") {
            $(this).parents("td").next("td").html('<a href="javascript:;" class="bid_table_choose">选择候选人</a>');
        } else {
            $(this).parents("td").next("td").html('<textarea></textarea>');
        }
    });

    //选择候选人
    $(".page_list").on("click", ".js_choose_dialog", function () {
        var main = $(this),
            _proType = $("input[name='proType']").val(),
            _price = $("input[name='synthetic_price']").val();
        _isdirect = main.parents("tbody.page_list").attr("isDirect");
        var html = '<div style="padding:10px 20px;"><div class="material_list clearfix" id="personList">';
        html += '<table><colgroup><col width="5%"><col width="8%"><col width="20%"><col width="8%">';
        if (_proType == "3") {
            if (_price != "1") {
                html += '<col width="10%"><col width="10%">';
            } else {
                html += '<col width="10%">';
            }
            if (_isdirect == "1") {
                html += '<col width="12%"><col width="12%">';
            }
        } else {
            html += '<col width="10%">';
            if (_isdirect == "1") {
                html += '<col width="12%">';
            }
        }
        html += '<col width="6%"><col width="12%"></colgroup>';
        html += '<thead><tr><th>排序</th><th>候选人排名</th><th>候选人</th><th>评标得分</th>';
        if (_proType == "3") {
            if (_price != "1") {
                html += '<th>报价(钢筋)</th><th>报价(非钢筋)</th>';
            } else {
                html += '<th>报价</th>';
            }
            if (_isdirect == "1") {
                html += '<th>确认报价(钢筋)</th><th>确认报价(非钢筋)</th>';
            }
        } else {
            html += '<th>报价</th>';
            if (_isdirect == "1") {
                html += '<th>确认报价</th>';
            }
        }
        html += '<th>选择</th><th>排序</th></tr></thead><tbody>';
        html += '<tr v-for="(item,index) in result"><td>{{index + 1}}</td><td>【{{item.idx}}】</td><td>{{item.seller_company_name}}</td><td>{{item.evaluate_score}}</td>';
        if (_proType == "3") {
            if (_price != "1") {
                html += '<td>{{item.synthetic_gj_price}}元</td><td>{{item.synthetic_fgj_price}}元</td>';
            } else {
                html += '<td>{{item.synthetic_price}}元</td>';
            }
            if (_isdirect == "1") {
                html += '<td><input type="text" class="cjy-input-" v-model="item.gj_price" v-on:input="updateValue($event.target.value,index,1)" style="width:70%;">元</td><td><input type="text" class="cjy-input-" v-model="item.fgj_price" v-on:input="updateValue($event.target.value,index,2)" style="width:70%;">元</td>';
            }
        } else {
            if (_price != "1") {
                html += '<td>{{item.synthetic_price}}元</td>';
            }
            if (_isdirect == "1") {
                html += '<td><input type="text" class="cjy-input-" v-model="item.confirm_price" v-on:input="updateValue($event.target.value,index,0)" style="width:70%;">元</td>';
            }
        }
        html += '<td><a href="javascript:;" class="textBlue" v-if="!item.checked" @click="choosePerson(index)">选择</a><a href="javascript:;" class="textRed" v-if="item.checked" @click="choosePerson(index)">取消选择</a></td><td><a href="javascript:;" class="textRed" v-if="item.checked&&item.moveUp" @click="movePerson(\'up\',index)">上移</a><a href="javascript:;" class="textRed marginR10 floatR" v-if="item.checked&&item.moveDown" @click="movePerson(\'down\',index)">下移</a></td></tr>'
        html += '</tbody></table></div></div>';

        $.dialog({
            title: "选择中标候选人",
            content: html,
            width: 1200,
            confirm: {
                show: true,
                allow: true,
                name: "完成"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                var vm = new Vue({
                    el: '#personList',
                    data() {
                        return {
                            list: [],
                            result: [],
                            chooseNum: 0
                        }
                    },
                    mounted() {
                        this.getBidList();
                    },
                    methods: {
                        getBidList() {
                            var that = this;
                            if (!main.attr("result")) {
                                $.ajaxForJson(config.wwwPath + "buyer/Tender/getWinSellerAjax", {
                                    tId: main.parents("tbody").attr("tId"),
                                    pId: main.attr("pId")
                                }, function (dataObj) {
                                    if (dataObj.code == 2000) {
                                        that.list = dataObj.data;
                                        for (var i = 0; i < that.list.length; i++) {
                                            that.$set(that.list[i], "idx", i + 1);
                                            that.$set(that.list[i], "checked", false);
                                            that.$set(that.list[i], "confirm_price", "");
                                            that.$set(that.list[i], "gj_price", "");
                                            that.$set(that.list[i], "fgj_price", "");
                                            that.$set(that.list[i], "moveUp", false);
                                            that.$set(that.list[i], "moveDown", false);
                                        }
                                        that.result = that.list;
                                    }
                                });
                            } else {
                                that.result = JSON.parse(main.attr("result"));
                                for (var i = 0; i < that.result.length; i++) {
                                    if (that.result[i].checked) {
                                        that.chooseNum++;
                                    }
                                }
                            }
                        },
                        choosePerson(index) {
                            if (this.result[index].checked) {
                                this.result[index].checked = false;
                                this.chooseNum--;
                            } else {
                                this.result[index].checked = true;
                                this.chooseNum++;
                            }
                            var _countChecked = 0,
                                _countNot = 0;
                            for (var i = 0; i < this.result.length; i++) {
                                if (this.result[i].checked) {
                                    this.result[i].idx = 1 + _countChecked;
                                    _countChecked++;
                                    if (this.chooseNum > 1) {
                                        if (_countChecked == 1) {
                                            this.result[i].moveDown = true;
                                        } else if (_countChecked > 1 && _countChecked < this.chooseNum) {
                                            this.result[i].moveDown = true;
                                            this.result[i].moveUp = true;
                                        } else {
                                            this.result[i].moveUp = true;
                                        }
                                    } else if (this.chooseNum == 1) {
                                        this.result[i].moveDown = false;
                                        this.result[i].moveUp = false;
                                    }
                                } else {
                                    this.result[i].idx = this.chooseNum + 1 + _countNot;
                                    _countNot++;
                                    this.result[i].moveDown = false;
                                    this.result[i].moveUp = false;
                                }
                            }
                            this.sortByKey(this.result, "idx");
                        },
                        updateValue(val, index, type) {
                            var that = this,
                                _inputVal = null;
                            if (val.split(".").length > 2) {
                                var valArr = obj.value.split(".");
                                if (valArr[0] != "") {
                                    _inputVal = valArr[0] + "." + valArr[1] + valArr[2]
                                } else {
                                    _inputVal = valArr[1] + "." + valArr[2]
                                }
                            } else {
                                _inputVal = val.replace(/[^0-9.]/g, '');
                                if (_inputVal != "") {
                                    _inputVal = /^\d+\.?\d{0,1}$/.test(_inputVal) ?
                                        _inputVal : _inputVal.split('.')[1].length == 1 ?
                                        _inputVal : _inputVal = _inputVal.split('.')[0] == "" ? "" : _inputVal = _inputVal.split('.')[0] + '.' + _inputVal.split('.')[1].substr(0, 2);
                                }
                            }
                            if (type == "1") {
                                that.result[index].gj_price = _inputVal;
                            } else if (type == "2") {
                                that.result[index].fgj_price = _inputVal;
                            } else {
                                that.result[index].confirm_price = _inputVal;
                            }
                        },
                        movePerson(type, index) {
                            for (var i = 0; i < this.result.length; i++) {
                                if (i == index) {
                                    if (type == "up") {
                                        this.result[i].idx = i;
                                        this.result[i - 1].idx = i + 1;
                                        if (i == 1) {
                                            this.result[i].moveUp = false;
                                            this.result[i - 1].moveUp = true;
                                        }
                                        if (i == this.chooseNum - 1) {
                                            this.result[i].moveDown = true;
                                            this.result[i - 1].moveDown = false;
                                        }
                                    } else {
                                        this.result[i].idx = i + 2;
                                        this.result[i + 1].idx = i + 1;
                                        if (i == 0) {
                                            this.result[i].moveUp = true;
                                            this.result[i + 1].moveUp = false;
                                        }
                                        if (i == this.chooseNum - 2) {
                                            this.result[i].moveDown = false;
                                            this.result[i + 1].moveDown = true;
                                        }
                                    }
                                    this.sortByKey(this.result, "idx");
                                    return;
                                }
                            }
                        },
                        sortByKey(array, key) {
                            return array.sort(function (a, b) {
                                var x = a[key];
                                var y = b[key];
                                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                            })
                        }
                    }
                });
                //选择完成
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    var _html = '<div class="chooseListCon">',
                        _num = 0;
                    var _proType = $("input[name='proType']").val();
                    for (var i = 0; i < vm.result.length; i++) {
                        if (vm.result[i].checked) {
                            if (_isdirect == "1") {
                                _html += '<p apply_id="' + vm.result[i].apply_id + '" win_bid_candidate_id="' + vm.result[i].id + '" seller_company_id="' + vm.result[i].seller_company_id + '" evaluate_score="' + vm.result[i].evaluate_score + '" quote_price="' + vm.result[i].synthetic_price + '" confirm_quote_price="' + vm.result[i].confirm_price + '" confirm_quote_gj_price="' + vm.result[i].gj_price + '" confirm_quote_fgj_price="' + vm.result[i].fgj_price + '"><i class="bid_table_num">' + (i + 1) + '</i><span class="bid_table_name">' + vm.result[i].seller_company_name + '</span>';
                                if (_proType == "3") {
                                    _html += '<span class="bid_table_pay">' + vm.result[i].gj_price + '元(钢筋)</span><span class="bid_table_pay marginL10">' + vm.result[i].fgj_price + '元(非钢筋)</span>';
                                } else {
                                    _html += '<span class="bid_table_pay">' + vm.result[i].confirm_price + '元</span>';
                                }
                            } else {
                                _html += '<p apply_id="' + vm.result[i].apply_id + '" win_bid_candidate_id="' + vm.result[i].id + '" seller_company_id="' + vm.result[i].seller_company_id + '" evaluate_score="' + vm.result[i].evaluate_score + '" quote_price="' + vm.result[i].synthetic_price + '" confirm_quote_price="' + vm.result[i].confirm_quote_price + '" confirm_quote_gj_price="' + vm.result[i].confirm_quote_gj_price + '" confirm_quote_fgj_price="' + vm.result[i].confirm_quote_fgj_price + '"><i class="bid_table_num">' + (i + 1) + '</i><span class="bid_table_name">' + vm.result[i].seller_company_name + '</span>';
                                if (_proType == "3") {
                                    _html += '<span class="bid_table_pay">' + vm.result[i].confirm_quote_gj_price + '元(钢筋)</span><span class="bid_table_pay marginL10">' + vm.result[i].confirm_quote_fgj_price + '元(非钢筋)</span>';
                                } else {
                                    _html += '<span class="bid_table_pay">' + vm.result[i].confirm_quote_price + '元</span>';
                                }
                            }
                            _html += '</p>';
                            _num++;
                        }
                    }
                    _html += '<a href="javascript:;" class="bid_table_edit js_choose_dialog" result=\'' + JSON.stringify(vm.result) + '\'>修改</a></div>';
                    if (_num > 0) {
                        main.parents("td").html(_html);
                        $(".cjy-cancel-btn").trigger("click");
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: "请选择候选人"
                        });
                    }
                    return false;
                });
            }
        });
    });

    //发布结果公示
    $(".bid_detail_publish").unbind().bind("click", function () {
        var _notice = null,
            _packageInfo = [],
            _candidateInfo = [],
            _proType = $("input[name='proType']").val(),
            _isdirect = $("tbody.page_list").attr("isDirect");
        if (_isdirect == "1") {
            _notice = {
                tender_id: $("tbody.page_list").attr("tId"),
                sign_date: $("select[name='sign_date']").val(),
                show_quote: $("input[name='show_quote']:checked").val(),
                notice_content: $("textarea[name='notice_content']").val()
            }
        } else {
            _notice = {
                tender_id: $("tbody.page_list").attr("tId"),
                notice_content: $("textarea[name='notice_content']").val()
            }
        }
        for (var i = 0; i < $("tbody.page_list").find("tr").length; i++) {
            var _obj = {
                tender_id: $("tbody.page_list").attr("tId"),
                package_id: $("tbody.page_list").find("tr").eq(i).attr("pId"),
                package_code: $("tbody.page_list").find("tr").eq(i).find("td").eq(0).html(),
                notice_type: $("tbody.page_list").find("tr").eq(i).find("input[type='radio']:checked").val(),
                content: $("tbody.page_list").find("tr").eq(i).find("td").eq(1).html(),
                remark: $("tbody.page_list").find("tr").eq(i).find("textarea").val()
            }
            _packageInfo.push(_obj);
            if ($("tbody.page_list").find("tr").eq(i).find(".chooseListCon").length > 0) {
                var _person = [];
                for (var j = 0; j < $("tbody.page_list").find("tr").eq(i).find(".chooseListCon").find("p").length; j++) {
                    var _pCell = $("tbody.page_list").find("tr").eq(i).find(".chooseListCon").find("p").eq(j);
                    var _list = null;
                    if (_isdirect == "1") {
                        _list = {
                            win_bid_candidate_id: _pCell.attr("win_bid_candidate_id"),
                            apply_id: _pCell.attr("apply_id"),
                            seller_company_id: _pCell.attr("seller_company_id"),
                            evaluate_score: _pCell.attr("evaluate_score"),
                            quote_price: _pCell.attr("quote_price"),
                            confirm_quote_price: _pCell.attr("confirm_quote_price"),
                            confirm_quote_gj_price: _pCell.attr("confirm_quote_gj_price"),
                            confirm_quote_fgj_price: _pCell.attr("confirm_quote_fgj_price"),
                            proType: _proType
                        }
                    } else {
                        _list = {
                            win_bid_candidate_id: _pCell.attr("win_bid_candidate_id"),
                            apply_id: _pCell.attr("apply_id"),
                            seller_company_id: _pCell.attr("seller_company_id"),
                            evaluate_score: _pCell.attr("evaluate_score"),
                            confirm_quote_price: _pCell.attr("confirm_quote_price"),
                            confirm_quote_gj_price: _pCell.attr("confirm_quote_gj_price"),
                            confirm_quote_fgj_price: _pCell.attr("confirm_quote_fgj_price"),
                            proType: _proType
                        }
                    }
                    _person.push(_list);
                }
                var _info = {
                    tender_id: $("tbody.page_list").attr("tId"),
                    package_id: $("tbody.page_list").find("tr").eq(i).attr("pId"),
                    seller_info: _person
                }
                _candidateInfo.push(_info);
            }
        }
        $.ajaxForJson(config.wwwPath + "buyer/Tender/publishBidResultAjax", {
            notice: _notice,
            packageInfo: _packageInfo,
            candidateInfo: _candidateInfo
        }, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg,
                    callback: function () {
                        window.location.href = dataObj.data.redirect_url;
                    }
                })
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