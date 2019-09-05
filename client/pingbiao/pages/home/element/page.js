require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

$(() => {
    /**
     * 选择评标专家
     */
    $(".zhuanjiaChoose").unbind().bind("click", function () {
        $.dialog({
            title: '选择评标专家',
            content: '<div class="zjChoose-content"><div class="zjChoose-search"><input type="text"><a href="javascript:;" class="zjChoose-search-btn"><i class="iconfont icon-sousuo"></i></a><a href="javascript:;" class="zjChoose-clear">清空</a></div><div class="material_list clearfix"><table><colgroup><col width="100"><col width="100"><col width="100"><col width="200"><col width="100"></colgroup><thead><tr><th>序号</th><th>专家姓名</th><th>联系方式</th><th>备注信息</th><th>操作</th></tr></thead><tbody><tr><td>1</td><td>张三</td><td>13512254444</td><td>项目负责人</td><td><a href="javascript:;" class="tdRed">取消选择</a></td></tr><tr><td>1</td><td>张三</td><td>13512254444</td><td>项目负责人</td><td><a href="javascript:;" class="tdPurple">选择</a></td></tr></tbody></table></div></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
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
            }
        });
        return false;
    });

    /**
     * 选择评标专家
     */
    $(".zhuanjiaSelect").unbind().bind("click", function () {
        $.dialog({
            title: '选择评标专家',
            content: '<div class="zjSelect-content"><div class="zjSelect-search"><div class="zjSelect-block clearfix"><label>专业分类：</label><div class="zjSelect-item"><select><option value="">设置你要选取的专家专业分类</option></select></div><label>专业来源：</label><div class="zjSelect-item"><select><option value="">全部</option><option value="1">公司内部</option><option value="2">外聘</option></select></div></div>'+
            '<div class="zjSelect-block clearfix"><label>专家选取方式：</label><div class="zjSelect-item"><select value="1"><option value="1">随机抽取</option><option value="2">手动抽取</option></select></div><label><span class="textRed">*</span>专家数量：</label><div class="zjSelect-item"><input type="text" class="cjy-input-"></div></div>'+

            '<div class="zjSelect-block clearfix"><label>所在地区：</label><div class="zjSelect-item"><div cjy-areaMulti citys=\'[{id:2,name:"北京市"},{id:20,name:"天津"}]\' style="width:700px;height:40px;" citys="" placeholder="设置你要选取的专家所在地区"></div></div></div>'+//<div class="cjy-select" style="width: 740px;"><div class="cjy-select-title js_chooseCity"><div class="cjy-select-con"><span class="cjy-select-none">设置你要选取的专家所在地区</span></div><i class="iconfont icon-xiajiantou"></i></div><dl class="cjy-select-dl"><dd data-value="" class="sel-this " title="设置你要选取的专家来源" style="width: 220px;">设置你要选取的专家来源</dd><dd data-value="1" class=" " title="公司内部" style="width: 220px;">公司内部</dd><dd data-value="2" class=" " title="外聘" style="width: 220px;">外聘</dd></dl><dl class="cjy-select-dl" style="left:240px;"><dd data-value="" class="sel-this " title="设置你要选取的专家来源" style="width: 220px;">设置你要选取的专家来源</dd><dd data-value="1" class=" " title="公司内部" style="width: 220px;">公司内部</dd><dd data-value="2" class=" " title="外聘" style="width: 220px;">外聘</dd></dl></div>

            '</div><div class="material_list clearfix"><table><colgroup><col width="100"><col width="100"><col width="100"><col width="200"><col width="100"></colgroup><thead><tr><th>序号</th><th>专家姓名</th><th>联系方式</th><th>备注信息</th><th>操作</th></tr></thead><tbody><tr><td>1</td><td>张三</td><td>13512254444</td><td>项目负责人</td><td><a href="javascript:;" class="tdRed">取消选择</a></td></tr><tr><td>1</td><td>张三</td><td>13512254444</td><td>项目负责人</td><td><a href="javascript:;" class="tdPurple">选择</a></td></tr></tbody></table></div></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
                name: "取消"
            },
            callback: function () {
                $("select").initSelect();
                $("[cjy-areaMulti]").initAreaMulti();
                $(".js_chooseCity").unbind().bind("click",function(){
                    $(this).parent().find()
                    return false;
                });
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        return false;
    });

    /**
     * 选择评分方法
     */
    $(".rateTypeChoose").unbind().bind("click", function () {
        $.dialog({
            title: '选择评标专家',
            content: '<div class="rateTypeDlg-content"><a href="javascript:;" class="rateType_cell selected"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>综合评分法<span class="msgCon"><span class="helpBg"><i class="iconfont icon-wenhao"></i></span><div class="tagBox"><span class="tagArrow"></span><div class="tagCon"><p>综合评分由报价文件评审、投入资金及垫付能力评审、生产规模及业绩信誉评审、报价评审等构成。</p></div></div></span></a><a href="javascript:;" class="rateType_cell"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>合理低价法<span class="msgCon"><span class="helpBg"><i class="iconfont icon-wenhao"></i></span><div class="tagBox"><span class="tagArrow"></span><div class="tagCon"><p>合理低价法需要通过市场调查，确定合理的价格区间。在评审过程中，在合理价格区间内按照报价进行选择。</p></div></div></span></a><a href="javascript:;" class="rateType_cell"><span class="rateType_checked"></span><i class="iconfont icon-gou"></i>最低报价法<span class="msgCon"><span class="helpBg"><i class="iconfont icon-wenhao"></i></span><div class="tagBox"><span class="tagArrow"></span><div class="tagCon"><p>直接评审价格，以报价高低进行评审</p></div></div></span></a></div>',
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
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        return false;
    });

    /**
     * 选择评分模板
     */
    $(".modelTypeChoose").unbind().bind("click", function () {
        $.dialog({
            title: '选择评标专家',
            content: '<div class="modelTypeDlg-content"><div class="modelTypeDlg-tips"><i class="iconfont icon-i"></i>选择模板后，可在原有模板基础之上重新定义模板内容，并保存为私有模板哦~</div><div class="material_list clearfix"><table><colgroup><col width="50"><col width="150"><col width="100"><col width="100"></colgroup><thead><tr><th>序号</th><th>模板姓名</th><th>模板来源</th><th>操作</th></tr></thead><tbody><tr class="checked"><td>1</td><td>默认模板<i class="iconfont icon-gou"></i></td><td>系统模板</td><td><a href="javascript:;" class="tdGreen marginR24">预览</a><a href="javascript:;" class="tdRed">修改</a></td></tr><tr><td>2</td><td>模板1<i class="iconfont icon-gou"></i></td><td>系统模板</td><td><a href="javascript:;" class="tdGreen marginR24">预览</a><a href="javascript:;" class="tdPurple">选择</a></td></tr><tr><td>3</td><td>模板2<i class="iconfont icon-gou"></i></td><td>系统模板</td><td><a href="javascript:;" class="tdGreen marginR24">预览</a><a href="javascript:;" class="tdPurple">选择</a></td></tr></tbody></table></div></div>',
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
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        return false;
    });

    /**
     * 确认评分模板
     */
    $(".modelConfirm").unbind().bind("click", function () {
        var dlgHTML = '<div class="modelConfirm-content"><div class="modelConfirm-title"><input type="text" class="cjy-input-" value="这里是模板的名称"></div><div class="material_list clearfix"><table><colgroup><col width="100"><col width="100"><col width="100"><col width="200"></colgroup><thead><tr><th>评分因素</th><th>评分指标</th><th>权重参考（%,100分）</th><th>评审要点及计分标准</th></tr></thead><tbody class="page_list">';
        dlgHTML += '<tr><td class="multi_td"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="经济因素"></td><td ><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="投标报价"></div><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="企业注册资金"></div><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="近期业绩"></div></td><td><div class="multi_box"><input type="text" class="cjy-input-" value="30"></div><div class="multi_box"><input type="text" class="cjy-input-" value="30"></div><div class="multi_box"><input type="text" class="cjy-input-" value="30"></div></td><td><div class="multi_box"><input type="text" class="cjy-input-" value="项目负责人"></div><div class="multi_box"><input type="text" class="cjy-input-" value="项目负责人"></div><div class="multi_box"><input type="text" class="cjy-input-" value="项目负责人"></div></td></tr><tr><td class="multi_td"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="技术因素"></td><td><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><input type="text" class="cjy-input-" value="供应商评价得分"></div></td><td><input type="text" class="cjy-input-" value="30"></td><td><input type="text" class="cjy-input-" value="项目负责人"></td></tr><tr><td colspan="4"><input type="text" class="cjy-input-" placeholder="评分说明：这里是评分说明……"></td></tr>';
        dlgHTML += '</tbody></table></div></div>';
        $.dialog({
            title: '确认评分模板',
            content: dlgHTML,
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "完成设置"
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
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    return false;
                });
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        return false;
    });

    /**
     * 提示浮层
     */
    $(".loadingTips").unbind().bind("click", function () {
        $.loadingTips({
            type: "changbiao",
            icon: '',
            content: '即将进入 <span class="textRed">[唱标]</span> 环节···',
            time: 2000,
            callback: null
        });
        return false;
    });

    /**
     * 开始唱标
     */
    $(".changbiaoBegin").unbind().bind("click", function () {
        $.dialog({
            title: '开始唱标',
            content: '<div class="cbBeginDlg-content"><i class="iconfont icon-gantanhao"></i><span class="cbBeginDlg-txt">确认后，其他专家将同屏显示您的屏幕内容，所有在线专家“确认唱标完成”后，唱标过程方才结束。</span></div>',
            width: 540,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
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
            }
        });
        return false;
    });

    /**
     * 结束唱标
     */
    $(".changbiaoEnd").unbind().bind("click", function () {
        $.dialog({
            title: '结束唱标',
            content: '<div class="cbEndDlg-content"><div class="cbEndDlg-txt"><i class="iconfont icon-i"></i><span>结束唱标后，将进入评标环节！ <br>点击下方“确定”按钮后开始计时，倒计时结束前提交的评分信息方才 有效，否则无效！</span></div><div class="cbEndDlg-handler"><label>评标时长：</label><input type="text" class="cjy-input-" placeholder="请设置时间">分钟</div></div>',
            width: 540,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
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
            }
        });
        return false;
    });

    /**
     * 提交评分
     */
    $(".rateConfirm").unbind().bind("click", function () {
        $.dialog({
            title: '提交评分',
            content: '<div class="rateCfmDlg-content"><i class="iconfont icon-gantanhao"></i><span class="rateCfmDlg-txt">剩余评分时长：<span class="textRed">0</span> 小时 <span class="textRed">20</span> 分 <span class="textRed">30</span> 秒 <br>您已完成  <span class="textRed">8</span>  家供应商的打分，提交评分后将不得更改，继续提交吗？ <br><a href="javascript:;" class="textGreen">预览我的打分</a></span></div>',
            width: 540,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                allow: true,
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
            }
        });
        return false;
    });

    /**
     * 专家确认中
     */
    $(".zjConfirm").unbind().bind("click", function () {
        var dialogHTML = '';
        dialogHTML += '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>';
        dialogHTML += '<div class="cjy-poplayer" style="top: ' + ($(document).scrollTop() + 200) + 'px;left: 50%;margin-left: -270px;"><div class="cjy-layer-wrap" style="width: 540px;">';
        dialogHTML += '<div class="cjy-layer-inner">';
        dialogHTML += '<div class="cjy-layer-body">';
        dialogHTML += '<div class="zjWaiting-content"><div class="zjWaiting-title">··· 专家确认中 ···</div><div class="progress-con"><div class="progress-line" style="width:' + 6 / 20 * 100 + '%"><span class="progress-bar"><span class="progress-text"><i class="iconfont icon-xiajiantou"></i>6/20</span></span></div></div></div>';
        dialogHTML += '</div></div></div></div>';

        $("body").eq(0).append(dialogHTML);
        return false;
    });
});