require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    var ruleType = $("input[name='ruleType']").val(),
        modelSelectId = 0,
        modelList = [];

    //选择评分方法弹框
    function chooseTypeDlg() {
        $.dialog({
            title: '选择评标方法',
            content: '<div class="rateTypeDlg-content"><a href="javascript:;" class="rateType_cell" data-id="1"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>综合评分法<span class="msgCon"><span class="helpBg"><i class="iconfont icon-wenhao"></i></span><div class="tagBox"><span class="tagArrow"></span><div class="tagCon"><p>综合评分由报价文件评审、投入资金及垫付能力评审、生产规模及业绩信誉评审、报价评审等构成。</p></div></div></span></a><a href="javascript:;" class="rateType_cell" data-id="2"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>合理低价法<span class="msgCon"><span class="helpBg"><i class="iconfont icon-wenhao"></i></span><div class="tagBox"><span class="tagArrow"></span><div class="tagCon"><p>合理低价法需要通过市场调查，确定合理的价格区间。在评审过程中，在合理价格区间内按照报价进行选择。</p></div></div></span></a><a href="javascript:;" class="rateType_cell" data-id="3"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>最低报价法<span class="msgCon"><span class="helpBg"><i class="iconfont icon-wenhao"></i></span><div class="tagBox"><span class="tagArrow"></span><div class="tagCon"><p>直接评审价格，以报价高低进行评审</p></div></div></span></a></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "下一步"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                $(".rateTypeDlg-content").find("a.rateType_cell[data-id='" + ruleType + "']").addClass("selected");
                //选择评标方法
                $(".rateTypeDlg-content").find("a.rateType_cell").unbind().bind("click", function () {
                    $(".rateTypeDlg-content").find("a.rateType_cell").removeClass("selected");
                    $(this).addClass("selected");
                    return false;
                });
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    if ($(".rateTypeDlg-content").find("a.selected").length <= 0) {
                        $.msgTips({
                            type: "warning",
                            content: "请选择评标方法！"
                        });
                    } else {
                        $.ajaxForJson(config.pingbiaoPath + "Evaluation/setScoreMethod", {
                            tenderId: $("input[name='tenderId']").val(),
                            packageId: $("input[name='packageId']").val(),
                            ruleId: $("input[name='ruleId']").val(),
                            ruleType: $(".rateTypeDlg-content").find("a.selected").attr("data-id")
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                ruleType = $(".rateTypeDlg-content").find("a.selected").attr("data-id");
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();

                                modelList = dataObj.data.template;
                                chooseModelDlg();
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

    //选择模板弹框
    function chooseModelDlg() {
        var _dlgHTML = '<div class="modelTypeDlg-content"><div class="modelTypeDlg-tips"><i class="iconfont icon-i"></i>选择模板后，可在原有模板基础之上重新定义模板内容，并保存为私有模板哦~</div><div class="material_list clearfix"><table><colgroup><col width="50"><col width="150"><col width="100"><col width="100"></colgroup><thead><tr><th>序号</th><th>模板姓名</th><th>模板来源</th><th>操作</th></tr></thead><tbody>';
        for (var i = 0; i < modelList.length; i++) {
            let _checkClass = "",
                _btnHTML = '<a href="javascript:;" class="tdPurple js_choose">选择</a>';
            if (modelSelectId == 0) {
                _checkClass = modelList[i].selected == 1 ? "checked" : "";
                _btnHTML = modelList[i].selected == 1 ? '<a href="javascript:;" class="tdRed js_edit">修改</a>' : '<a href="javascript:;" class="tdPurple js_choose">选择</a>';
            } else {
                if (modelSelectId == modelList[i].id) {
                    _checkClass = "checked";
                    _btnHTML = '<a href="javascript:;" class="tdRed js_edit">修改</a>';
                }
            }
            _dlgHTML += '<tr class="' + _checkClass + '" data-id="' + modelList[i].id + '"><td>' + (i + 1) + '</td><td>' + modelList[i].name + '<i class="iconfont icon-gou"></i></td><td>' + modelList[i].type_title + '</td><td><a href="' + config.pingbiaoPath + 'evaluation/template/' + modelList[i].id + '.html" target="_blank" class="tdGreen marginR24">预览</a>' + _btnHTML;
            _dlgHTML += '</td></tr>';
        }
        _dlgHTML += '</tbody></table></div></div>'
        $.dialog({
            title: '选择评分模板',
            content: _dlgHTML,
            width: 1110,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "上一步"
            },
            callback: function () {
                //选择、修改操作
                $(".js_edit,.js_choose").unbind().bind("click", function () {
                    var _id = $(this).parents("tr").attr("data-id");
                    $.ajaxForJson(config.pingbiaoPath + "Evaluation/templateDetails", {
                        templateId: _id
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $(".cjy-poplayer").remove();
                            $(".cjy-bg").remove();
                            modelSelectId = _id;
                            confirmModelDlg(dataObj.data);
                        }
                    });
                    return false;
                });
                //上一步操作
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();

                    chooseTypeDlg();
                    return false;
                });
            }
        });
    }

    //确认模板弹框
    function confirmModelDlg(tableObj) {
        var dlgHTML = '<div class="modelConfirm-content"><div class="modelConfirm-title"><input type="text" class="cjy-input-" name="modelName" value="' + tableObj.base[0].name + '"></div><div class="material_list clearfix"><table><colgroup><col width="100"><col width="100"><col width="100"><col width="200"></colgroup><thead><tr><th>评分因素</th><th>评分指标</th><th>权重参考（%,100分）</th><th>评审要点及计分标准</th></tr></thead><tbody class="page_list">';
        for (var i = 0; i < tableObj.content.length; i++) {
            let zhibiaoHTML = '',
                quanzhongHTML = '',
                yaodianHTML = '';
            for (var j = 0; j < tableObj.content[i].content.length; j++) {
                zhibiaoHTML += '<div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="' + tableObj.content[i].content[j][0] + '"></div>';
                quanzhongHTML += '<div class="multi_box"><input type="text" class="cjy-input- input_qz" value="' + tableObj.content[i].content[j][1] + '"></div>';
                yaodianHTML += '<div class="multi_box"><input type="text" class="cjy-input-" value="' + tableObj.content[i].content[j][2] + '"></div>'
            }
            dlgHTML += '<tr><td class="multi_td"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="' + tableObj.content[i].name + '"></td>';
            dlgHTML += '<td>';
            dlgHTML += zhibiaoHTML;
            dlgHTML += '</td><td>';
            dlgHTML += quanzhongHTML;
            dlgHTML += '</td><td>';
            dlgHTML += yaodianHTML;
            dlgHTML += '</td></tr>';
        }
        dlgHTML += '<tr><td colspan="4"><input type="text" name="modelDes" class="cjy-input-" placeholder="评分说明：这里是评分说明……" value="' + tableObj.base[0].description + '"></td></tr></tbody></table></div></div>';
        $.dialog({
            title: '确认评分模板',
            content: dlgHTML,
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "上一步"
            },
            button: {
                show: true,
                html: '<a href="javascript:;" class="modelConfirm-save"><i class="iconfont icon-baocun"></i>保存为我的模板</a>'
            },
            callback: function () {
                //权重输入限制
                $(".modelConfirm-content").on("input", "input.input_qz", function () {
                    libs.lenNumber(this, 2);
                });
                //上一步事件
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();

                    chooseModelDlg();
                    return false;
                });
                //确认保存模板
                $(".cjy-confirm-btn,.modelConfirm-save").off().on("click", function () {
                    var main = $(this),
                        ajaxKey = true;
                    $(".modelConfirm-content").find("tbody.page_list tr").each(function () {
                        if ($(this).find("td").eq(0).find("input.cjy-input-").val() == "" || $(this).find("td").eq(1).find("input.cjy-input-").val() == "" || $(this).find("td").eq(2).find("input.cjy-input-").val() == "") {
                            ajaxKey = false;
                            return false;
                        }
                    });
                    if (ajaxKey) {
                        var _type = $(this).hasClass("modelConfirm-save") ? 2 : 3;
                        $.ajaxForJson(config.pingbiaoPath + "Evaluation/setTemplate", {
                            content: getContent(),
                            name: $("input[name='modelName']").val(),
                            description: $("input[name='modelDes']").val(),
                            tenderId: $("input[name='tenderId']").val(),
                            packageId: $("input[name='packageId']").val(),
                            type: _type,
                            templateId: modelSelectId,
                            ScoreMethodId: ruleType
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                $.msgTips({
                                    type: "success",
                                    content: dataObj.msg,
                                    callback: function () {
                                        if (main.hasClass("modelConfirm-save")) {
                                            modelList = dataObj.data.template;
                                        } else {
                                            $(".cjy-poplayer").remove();
                                            $(".cjy-bg").remove();
                                            window.location.reload();
                                        }
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    } else {
                        $.msgTips({
                            type: "warning",
                            content: "评分因素、评分指标、权重参考不能为空！"
                        });
                    }
                });
                //添加一行信息
                $(".modelConfirm-content").on("click", ".add_multi", function () {
                    var main = $(this),
                        _td = main.parents("td"),
                        _tr = main.parents("tr");
                    if (_td.hasClass("multi_td")) {
                        var _html = '<tr><td class="multi_td"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="" placeholder="请填写评分因素"></td><td><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="" placeholder="请填写评分指标"></div></td><td><div class="multi_box"><input type="text" class="cjy-input-" value="" placeholder="请填写权重参考"></div></td><td><div class="multi_box"><input type="text" class="cjy-input-" value="" placeholder="请填写评审要点及计分标准"></div></td></tr>';
                        _tr.after(_html);
                    } else {
                        var _pfzbHTML = '<div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="" placeholder="请填写评分指标"></div>',
                            _qzckHTML = '<div class="multi_box"><input type="text" class="cjy-input-" value="" placeholder="请填写权重参考"></div>',
                            _psydHTML = '<div class="multi_box"><input type="text" class="cjy-input-" value="" placeholder="请填写评审要点及计分标准"></div>';
                        _tr.find("td").eq(1).append(_pfzbHTML);
                        _tr.find("td").eq(2).append(_qzckHTML);
                        _tr.find("td").eq(3).append(_psydHTML);
                    }
                });
                //删除一行信息
                $(".modelConfirm-content").on("click", ".del_multi", function () {
                    var main = $(this),
                        _td = main.parents("td"),
                        _tr = main.parents("tr");
                    if (_td.hasClass("multi_td")) {
                        _tr.remove();
                    } else {
                        var _index = main.parents(".multi_box").index();
                        _tr.find("td").eq(1).find(".multi_box").eq(_index).remove();
                        _tr.find("td").eq(2).find(".multi_box").eq(_index).remove();
                        _tr.find("td").eq(3).find(".multi_box").eq(_index).remove();
                    }
                });

                function getContent() {
                    var _tr = $(".modelConfirm-content tbody.page_list").find("tr"),
                        _content = [];
                    for (var i = 0; i < _tr.length; i++) {
                        var _conArr = [];
                        var _box = _tr.eq(i).find("td").eq(1).find(".multi_box");
                        for (var j = 0; j < _box.length; j++) {
                            var _arr = [];
                            for (var k = 1; k <= 3; k++) {
                                var inputVal = _tr.eq(i).find("td").eq(k).find(".multi_box").eq(j).find("input.cjy-input-").val()
                                _arr.push(inputVal);
                            }
                            _conArr.push(_arr);
                        }
                        _conObj = {
                            name: _tr.eq(i).find("td.multi_td").find("input.cjy-input-").val(),
                            content: _conArr
                        }
                        _content.push(_conObj);
                    }
                    return _content;
                }
            }
        });
    }

    //设置评标细节
    $("a.setting_add").unbind().bind("click", function () {
        chooseTypeDlg();
        return false;
    });

    //评标方案设置完成
    $(".setting_btn_confirm").unbind().bind("click",function(){
        $.cueDialog({
            title: "提示",
            topWords: ["icon-i", '评标方案设置完成后将不可再修改，确认完成设置？'],
            content: "",
            allow: true,
            callback: function () {
                $.ajaxForJson(config.pingbiaoPath + "evaluation/scoreMethoAffirm", {
                    ruleId: $("input[name='ruleId']").val()
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        $.msgTips({
                            type: "success",
                            content: dataObj.msg,
                            callback: function () {
                                window.location.href = dataObj.data.data;
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
        return false;
    });
});