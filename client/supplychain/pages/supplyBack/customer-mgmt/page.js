require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    // 筛选查询
    $(".result_btn").off().on("click", function () {
        var sBegin = new Date($("#time_begin").val()).getTime();
        var sEnd = new Date($("#time_end").val()).getTime();
        if (sBegin > sEnd) {
            $.msgTips({
                type: "warning",
                content: '意向申请起始时间不能大于结束时间'
            });
            return false;
        }
        vm.getProductList(1);
    });

    // 获取产品列表
    var vm = new Vue({
        el: '#productList',
        data: {
            loading: true,
            list: [],
            count: 0,
            limit: 10,
            current: 1,
            inputIdArr: []
        },
        mounted() {
            this.getProductList(1);
        },
        methods: {
            getProductList(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.jcPath + 'user/productOrder/ajaxProductOrderList', {
                    key_words: $.trim($("input[name='key_words']").val()),
                    product_name: $.trim($("input[name='product_name']").val()),
                    apply_time_begin: $.trim($("input[name='apply_time_begin']").val()),
                    apply_time_end: $.trim($("input[name='apply_time_end']").val()),
                    apply_status: $("select[name='apply_status']").val(),
                    p: vueObj.current,
                    limit: vueObj.limit
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.data;
                        vueObj.count = json.data.count;
                    }
                    vueObj.loading = false;
                });
            },
            actHandle(id, status) {
                var vueObj=this;
                var _title = '',
                    _html = '<div style="padding:20px;"><span><input type="radio" name="typeRadio" value="" title=""></span><span style="margin-left:60px;"><input type="radio" name="typeRadio" value="" title=""></span></div>';
                if (status == 2) {
                    _title = '受理操作';
                    _html = '<div style="padding:20px;"><span><input type="radio" name="typeRadio" value="3" title="开始受理"></span><span style="margin-left:60px;"><input type="radio" name="typeRadio" value="2" title="暂不受理"></span></div>';
                } else if (status == 3) {
                    _title = '录入受理结果';
                    _html = '<div style="padding:20px;"><span><input type="radio" name="typeRadio" value="5" title="审批通过"></span><span style="margin-left:60px;"><input type="radio" name="typeRadio" value="4" title="审批拒绝"></span></div>';
                } else if (status == 7) {
                    _title = '录入借款协议签订状态';
                    _html = '<div style="padding:20px;"><span><input type="radio" name="typeRadio" value="8" title="借款协议已签订完毕"></span><span style="margin-left:60px;"><input type="radio" name="typeRadio" value="7" title="待签订借款协议"></span></div>';
                } else if (status == 8) {
                    _title = '确认已放款';
                    _html = '<div style="padding:20px;"><span><input type="radio" name="typeRadio" value="9" title="已放款完成"></span><span style="margin-left:60px;"><input type="radio" name="typeRadio" value="8" title="放款中"></span></div><div style="padding:20px;display:none;" class="js_amount"><label>放款金额：</label><input name="loan_amount" class="cjy-input-" style="width:150px;">万元</div>';
                }
                $.dialog({
                    title: _title,
                    content: _html,
                    width: 400,
                    confirm: {
                        show: true,
                        allow: true,
                        name: "提交"
                    },
                    cancel: {
                        show: true,
                        name: "取消"
                    },
                    callback: function () {
                        $("input[type='radio']").initRadio();
                        $("input[type='radio']").unbind().bind("change", function () {
                            if ($(this).val() == "9") {
                                $(".js_amount").show();
                            } else {
                                $(".js_amount").hide();
                            }
                        });

                        //确定按钮
                        $(".cjy-confirm-btn").unbind().bind("click", function () {
                            var _status = $("input[name='typeRadio']:checked").val();
                            if (_status == status) {
                                $(".cjy-cancel-btn").trigger("click");
                            } else {
                                $.ajaxForJson(config.jcPath + 'user/productOrder/changeStatus', {
                                    product_apply_id: id,
                                    do_apply_status: _status,
                                    loan_amount: $("input[name='loan_amount']").val()
                                }, function (dataObj) {
                                    if (dataObj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: dataObj.msg,
                                            callback:function(){
                                                vueObj.getProductList(vueObj.current);
                                                $(".cjy-cancel-btn").trigger("click");
                                            }
                                        });
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
                });
            }
        }
    });

});