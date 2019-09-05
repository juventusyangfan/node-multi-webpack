require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

const testImg = require('./imgs/test.jpg');
$(() => {
    // 提示浮层
    $(".view_float").off().on("click",function () {
        $.msgTips({
            type: "success",
            content: "报名成功"
        });
    });

    // 预览大图浮层
    $(".view_bigphoto").off().on("click",function () {
        $.showPhoto(testImg);
    });

    // 独家招标-供应商
    $(".gys_box1").off().on("click",function () {
        $.cueDialog({
            allow: false,
            title: "报名",
            topWords: ["icon-i",'您所在的企业还不是会员，请先<a href="javascript:;">申请成为会员。</a>'],
            content: '<div class="zhaobiao-pop"><p>招标名称：<span>xxx招标</span></p><p>招标单位：<span>xx公司名称</span></p></div>'
        });
    });

    $(".gys_box2").off().on("click",function () {
        $.cueDialog({
            allow: false,
            title: "报名",
            topWords: ["icon-i",'抱歉，贵单位不在本次邀请招标的单位之中，无法报名。'],
            content: '<div class="zhaobiao-pop"><p>招标名称：<span>xxx招标</span></p><p>招标单位：<span>xx公司名称</span></p></div>'
        });
    });

    $(".gys_box3").off().on("click",function () {
        $.cueDialog({
            title: "报名",
            content: '<div class="zhaobiao-pop"><p>招标名称：<span>xxx招标</span></p><p>招标单位：<span>xx公司名称</span></p></div>'
        });
    });

    // 申请成为会员
    $(".sqhy_box").off().on("click", function () {
        var strHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="sqhy-box"><div class="sqhy-bg"></div><div class="sqhy-inner"><p class="sqhy-head">Hello，湖北楚建易网络科技有限公司，杨小慧：</p><p class="sqhy-right"><strong>申请成为会员</strong>将享有生材网<strong>独家集采信息</strong>的在线<strong>查看</strong>和<strong>参与报价</strong>权利哦~</p><div class="sqhy-description"><p><span class="sqhy-span"><i class="iconfont icon-qiandai"></i>会员费用：</span><b>1.2万/年</b></p><p><span class="sqhy-span"><i class="iconfont icon-quanyi"></i>会员权益：</span><b>申请成为生材网会员后，将享有平台上海量独家招标的报名与投标权限，详细内容请参照《生材网会员协议》</b></p></div><p class="sqhy-xy"><input type="checkbox" name="" title="" />我已仔细阅读《<a href="javascript:;" target="_blank">生材网会员协议</a>》，并同意相关条款</p><p class="sqhy-foot">点击下方“申请成为会员”按钮，递交申请，工作人员将在<strong>1-3个工作日</strong>内与你联系，并告知具体支付细节（<strong>027-12345678</strong>）</p><button class="sqhy-btn">申请成为会员</button></div></div>';
        $("body").eq(0).append(strHtml);
        var ele = $(".sqhy-box");
        ele.css({
            "left": ($(window).outerWidth() - ele.outerWidth()) / 2 + "px",
            "top": $(document).scrollTop() + ($(window).outerHeight() - ele.outerHeight()) / 2 + "px",
            "z-index": 100
        });
        ele.fadeIn(400);
        $(".sqhy-xy input").initCheckbox();
        // $.memberDialog()
    });

    // 物料分类库升级
    $(".cataUp_box").off().on("click", function () {
        var strHtml = '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div><div class="cataUp-box"><a href="#" class="cjy-close"><i class="iconfont icon-cha1"></i></a><div class="cataUp-bg"></div><div class="cataUp-inner"><p>提供<span class="textOrange">更精细、更全面</span>的物料分类库<br>完善企业供应物资分类，让采购单位<span class="textOrange">一键找到你</span>!</p><a href="#" class="cataUp-go">去完善我的物资分类</a><a href="javascript:;">下次再说吧！</a></div></div>';
        $("body").eq(0).append(strHtml);
        var ele = $(".cataUp-box");
        ele.css({
            "left": ($(window).outerWidth() - ele.outerWidth()) / 2 + "px",
            "top": $(document).scrollTop() + ($(window).outerHeight() - ele.outerHeight()) / 2 + "px",
            "z-index": 100
        });
        ele.fadeIn(400);
    });

    // 独家招标 - 采购商
    $(".cgs_box1").off().on("click",function () {
        $.dialog({
            title: '报名信息',
            content: `<div class="cgs-content"><div class="cgs-p"><p><span>已报名单位：</span><span class="marginR25">36家</span><span>已邀请单位：</span><span class="marginR25">公开招标</span></p></div><div class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th>报名时间</th></tr></thead><tbody><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应</td><td>-</td><td>4</td><td>1</td><td>2018-06-29&nbsp;&nbsp;12:00:00</td></tr></tbody></table></div></div>`,
            width: 1110,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            }
        });
    });

    $(".cgs_box2").off().on("click",function () {
        $.dialog({
            title: '回标详情',
            content: `<div class="cgs-content"><div class="cgs-p"><p><span>回标进度：</span><span class="marginR25">5/10家</span></p></div><div class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th>报名时间</th><th>状态</th></tr></thead><tbody><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应</td><td>-</td><td>4</td><td>1</td><td>2018-06-29&nbsp;&nbsp;12:00:00</td><td><span class="color_green">已投</span></td></tr><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应</td><td>-</td><td>4</td><td>1</td><td>2018-06-29&nbsp;&nbsp;12:00:00</td><td><span class="color_red">待投</span></td></tr></tbody></table></div></div>`,
            width: 1110,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            }
        });
    });

    $(".cgs_box3").off().on("click",function () {
        $.dialog({
            title: '录入招标结果',
            content: `<div class="cgs-content"><div class="cgs-p"><p><span>回标进度：</span><span class="marginR25">5家</span></p><p><span>招标有效性：</span><select name=""><option value="">请选择</option></select></p></div><div class="cgs-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th>最终综合报价（元）</th><th>状态</th></tr></thead><tbody><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应</td><td>-</td><td>4</td><td>1</td><td><input type="text" name="" class="cjy-input-" placeholder="输入报价金额"></td><td><input type="checkbox" name="" title="" /></td></tr><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应</td><td>-</td><td>4</td><td>1</td><td><input type="text" name="" class="cjy-input-" placeholder="输入报价金额"></td><td><input type="checkbox" name="" title="" /></td></tr></tbody></table></div></div>`,
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
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        $(".cgs-p select").initSelect();
        $(".cgs-table input[type='checkbox']").initCheckbox();
    });

    // 在线开标
    $(".openbid_box1").off().on("click", function () {
        $.dialog({
            title: '在线开标',
            content: '<div class="openbid-box"><p class="openbid-fisrt"><i class="iconfont icon-gantanhao"></i><span>在线开标</span>仅能操作<span>1次</span>，且操作<span>不可逆</span>！</p><p class="openbid-snd">在线开标后，将对招标单位开放各家投标单位上传的投标文件，可在线预览、下载！</p><p class="openbid-third">请务必保证当前环境适合进行开标操作。</p><form class="openBid_form"><div class="openBid_item clearfix"><label>秘钥文件：</label><div class="openBid_block"><label for="uploadFile" class="upfile_btn">上传秘钥文件</label><input type="file" id="uploadFile" name="uploadFile"></div></div><div class="openBid_item clearfix"><label></label><div class="openBid_block"><div class="showFileCon"><ul></ul></div></div></div><div class="openBid_item clearfix"><label>开标口令：</label><div class="openBid_block"><input type="password" name="" class="cjy-input-"></div></div><button>校验秘钥及口令信息，进行在线开标</button></form></div>',
            width: 1110,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            }
        });
    });

    $(".openbid_box2").off().on("click", function () {
        $.dialog({
            title: '在线开标',
            content: '<div class="openbid-box"><p class="openbid-fisrt"><i class="iconfont icon-gantanhao"></i><span>在线开标</span>仅能操作<span>1次</span>，且操作<span>不可逆</span>！</p><p class="openbid-snd">在线开标后，将对招标单位开放各家投标单位上传的投标文件，可在线预览、下载！</p><p class="openbid-third">请务必保证当前环境适合进行开标操作。</p><p class="openbid-forth">投标单位：<span>5家</span></p><table class="openbid-table"><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>投标文件</th></tr></thead><tbody><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应商</td><td>A</td><td><a class="download-link" href="javascript:;">下载</a><span>-</span><a class="view-link" href="javascript:;">在线预览</a></td></tr></tbody></table><div id="pages"></div></div>',
            width: 1110,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            }
        });
    });

    // 邀请招标 - 挑选供应商
    $(".txgys_box").off().on("click", function () {
        $.dialog({
            title: '选择供应商',
            content: '<div class="txgys-box"><div class="txgys-form"><select name=""><option value="">请选择</option></select><input type="text" name="" class="cjy-input-" placeholder="请输入供应商的名称/公司关键字" /><button>确定</button><p>已选择<span>8家</span>供应商单位</p></div><div class="txgys-table"><table><thead><tr><th>序号</th><th class="w300">供应商</th><th>供应商来源</th><th>企业评级</th><th>参与投标次数</th><th>中标次数</th><th>选择中标单位</th></tr></thead><tbody><tr><td>1</td><td><p class="ellipsis">武汉市市政集团有限公司</p></td><td>平台供应商</td><td>-</td><td>4</td><td>1</td><td><input type="checkbox" name="" title="" /></td></tr></tbody></table></div><div id="pages"></div></div>',
            width: 1110,
            confirm: {
                show: true,
                allow: true,
                name: "完成选择"
            },
            callback: function () {
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        $(".txgys-form select").initSelect();
        $(".txgys-table input").initCheckbox();
    });

    // 企业供应商 - 审核/修改供应商
    $(".qygys_box").off().on("click",function () {
        $.dialog({
            title: '修改供应商',
            content: '<div class="qygys-box"><div class="gys-basic"><div class="gys-basic-title"><h2>供应商基本信息</h2><span class="gys-line"></span></div><ul class="gysbasic-list clearfix"><li class="gys-item"><span class="gys-item-title">公司名称：</span><span class="gys-item-name ellipsis color_red" title="湖北国际经济技术合作有限公司">湖北国际经济技术合作有限公司</span></li><li class="gys-item"><span class="gys-item-title">企业类型：</span><span class="gys-item-name">国有企业</span></li><li class="gys-item"><span class="gys-item-title">员工人数：</span><span class="gys-item-name">0~50</span></li><li class="gys-item"><span class="gys-item-title">是否一般纳税人：</span><span class="gys-item-name">是</span></li><li class="gys-item"><span class="gys-item-title">注册资金：</span><span class="gys-item-name">1000万元</span></li><li class="gys-item"><span class="gys-item-title">法人姓名：</span><span class="gys-item-name">张某</span></li><li class="gys-item"><span class="gys-item-title">营业执照注册号：</span><span class="gys-item-name">XXXXXXXXXX</span></li><li class="gys-item"><span class="gys-item-title">公司联系方式：</span><span class="gys-item-name">027-5675150</span></li><li class="gys-item"><span class="gys-item-title">公司地址：</span><span class="gys-item-name">湖北省武汉市江岸区</span></li><li class="gys-item"><span class="gys-item-title">详细地址：</span><span class="gys-item-name ellipsis">三阳路256号</span></li></ul></div><div class="gys-sel-area"><p><span>供应商加入方式：</span><b class="font_normal">申请加入</b></p><p><span>设置供应商状态：</span><select name=""><option value="">请选择</option></select></p><p><span>设置供应商等级：</span><select name=""><option value="">请选择</option></select></p></div></div>',
            width: 540,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            callback: function () {
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        $(".gys-sel-area select").initSelect();
    });

    // 收款管理 - 审核支付凭证
    $(".skgl_box").off().on("click",function () {
        $.dialog({
            title: '审核支付凭证',
            content: '<div class="qygys-box"><div class="gys-basic"><div class="gys-basic-title"><h2>供应商基本信息</h2><span class="gys-line"></span></div><ul class="gysbasic-list clearfix"><li class="gys-item"><span class="gys-item-title">公司名称：</span><span class="gys-item-name ellipsis color_red" title="湖北国际经济技术合作有限公司">湖北国际经济技术合作有限公司</span></li><li class="gys-item"><span class="gys-item-title">企业类型：</span><span class="gys-item-name">国有企业</span></li><li class="gys-item"><span class="gys-item-title">员工人数：</span><span class="gys-item-name">0~50</span></li><li class="gys-item"><span class="gys-item-title">是否一般纳税人：</span><span class="gys-item-name">是</span></li><li class="gys-item"><span class="gys-item-title">注册资金：</span><span class="gys-item-name">1000万元</span></li><li class="gys-item"><span class="gys-item-title">公司联系方式：</span><span class="gys-item-name">027-5675150</span></li><li class="gys-item"><span class="gys-item-title">公司地址：</span><span class="gys-item-name">湖北省武汉市江岸区</span></li><li class="gys-item"><span class="gys-item-title">详细地址：</span><span class="gys-item-name ellipsis">三阳路256号</span></li></ul></div><div class="gys-sel-area"><p><span class="block_title">凭证提交时间：</span><b class="font_normal">2018-08-08&nbsp;&nbsp;12:00:00</b></p><p><span class="block_title">支付凭证：</span><a class="color_blue" href="javascript:;">湖北国际经济技术合作有限公司001.jpg</a></p><p><span class="block_title">是否通过：</span><select name=""><option value="">请选择</option></select></p></div></div>',
            width: 540,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            callback: function () {
                $(".cjy-confirm-btn").off().on("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        $(".gys-sel-area select").initSelect();
    });

    //渲染多选
    $("[cjy-multi]").initMultiSelect();

    // 供应商评价
    $(".pingjia_box").off().on("click",function () {
        $.ajaxForJson(config.wwwPath + 'evaluate/getinfo',{
            supply_id: 1,
            tender_id: 9
        }, function (json) {
            if (json.code === 2000) {
                var txtArr = ['价格优势','产品质量','交货准时性','环保性','数量准确性','服务与支持','品种正确性','资金实力'];
                var typeArr = ['极差','较差','一般','良好','优秀'];
                var contentHtml = '<div class="gys_comment"><p class="company_project"><span>中标单位：</span><a href="javascript:;">显示单位名称可点</a><span>集采名称：</span><a href="javascript:;">显示集采名称可点</a></p><div class="gys_comment_item"><h2>平分项</h2><b>（评分提交后可修改）</b><span class="gys_comment_line"></span></div><div class="evaluate_box clearfix">';
                for (let  i= 0; i < txtArr.length; i++) {
                    contentHtml += '<div class="evaluate_item"><span class="evaluate_type">'+txtArr[i]+'：</span><div class="evaluate_star_box clearfix" data-star="0">';
                    for (let j = 0; j < typeArr.length; j++) {
                        contentHtml += '<dl class="evaluate_star"><dt class="evaluate_cell evaluate_gray"></dt><dd class="evaluate_txt">（'+typeArr[j]+'）</dd></dl>'
                    }
                    contentHtml += '</div></div>';
                }
                contentHtml += '</div><div class="gys_comment_item"><h2>文字评价</h2><span class="gys_comment_line"></span></div><textarea class="cjy-textarea comment_textarea" name="content " maxlen="400" rows="3" style="width: 1026px;"></textarea><div class="gys_comment_btn"><input type="checkbox" title="匿名" name="is_hidden" value="1" /><button>提交</button></div></div>';
                $.dialog({
                    title: '供应商评价',
                    content: contentHtml,
                    width: 1110,
                    confirm: {
                        show: false,
                        allow: true,
                        name: "确定"
                    }
                });
                $(".gys_comment input").initCheckbox();
                $(".gys_comment .cjy-textarea").initTextarea();

                $(".evaluate_box").on("mouseover", ".evaluate_star", function () {
                    var main = $(this);
                    var starList = main.parents(".evaluate_star_box").find(".evaluate_star");
                    var num = starList.index(main);
                    for (let i = 0; i < num + 1; i++) {
                        starList.eq(i).find(".evaluate_cell").removeClass("evaluate_gray").addClass("evaluate_red");
                    }
                    for (let j = num + 1; j < starList.length; j++) {
                        starList.eq(j).find(".evaluate_cell").removeClass("evaluate_red").addClass("evaluate_gray");
                    }
                });

                $(".evaluate_box").on("mouseout", ".evaluate_star", function () {
                    var main = $(this);
                    var starList = main.parents(".evaluate_star_box").find(".evaluate_star");
                    var num = parseInt(main.parents(".evaluate_star_box").attr("data-star"));
                    for (let i = 0; i < num; i++) {
                        starList.eq(i).find(".evaluate_cell").removeClass("evaluate_gray").addClass("evaluate_red");
                    }
                    for (let j = num; j < starList.length; j++) {
                        starList.eq(j).find(".evaluate_cell").removeClass("evaluate_red").addClass("evaluate_gray");
                    }
                });

                $(".evaluate_box").on("click", ".evaluate_star", function () {
                    var main = $(this);
                    var starList = main.parents(".evaluate_star_box").find(".evaluate_star");
                    var num = starList.index(main);
                    for (let i = 0; i < num + 1; i++) {
                        main.parents(".evaluate_star_box").attr("data-star", num + 1);
                        starList.eq(i).find(".evaluate_cell").removeClass("evaluate_gray").addClass("evaluate_red");
                    }
                    for (let j = num + 1; j < starList.length; j++) {
                        starList.eq(j).find(".evaluate_cell").removeClass("evaluate_red").addClass("evaluate_gray");
                    }
                });

                // 提交
                $(".gys_comment_btn button").off().on("click", function () {
                    var main = $(this);
                    var starEl = $(".evaluate_box").find(".evaluate_star_box");
                    for (let i = 0; i < starEl.length; i++) {
                        if (starEl.eq(i).attr("data-star") === "0") {
                            $.msgTips({
                                type: "warning",
                                content: '还有选项未评分'
                            });
                            return false;
                        }
                    }
                    if ($.trim($(".comment_textarea").val()) === "") {
                        $.msgTips({
                            type: "warning",
                            content: '评价不能为空'
                        });
                        return false;
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

    $(".upload_payment").off().on("click",function () {
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
});