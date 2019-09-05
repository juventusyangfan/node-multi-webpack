require('cp');
require('cbp');
require('elem');
require('../../../public-resource/css/list.css');
require('./page.css');
const config = require('configModule');

$(() => {
    //图片上传
    $(".uploadImg").uppyUpload(".uploadImg", function (name, url) {
        if ($(".applyentry_cell").length >= 11) {
            $.msgTips({
                type: "warning",
                content: "最多上传10份材料"
            });
            return false;
        }
        var shtml = '<div class="applyentry_cell"><img src="' + config.filePath + url + '"><a href="javascript:;" class="iconfont icon-cha1"></a><input type="hidden" name="filePath" value="' + url + '"></div>'
        $(".applyentry_con").prepend(shtml);
    }, {
        allowedFileTypes: ['image/*'],
        extArr: ['jpg', 'png', 'jpeg', 'bmp']
    });
    
    // // 上传文件
    // $(document).on("click", ".uploadImg", function () {
    //     if ($(".applyentry_cell").length >= 11) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传11份材料"
    //         });
    //         return false;
    //     }
    //     $("#logo").unbind().bind("change", function () {
    //         var id = $(this).attr("id");
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.shopPath + 'uploadImg',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var shtml = '<div class="applyentry_cell"><img src="' + config.filePath + dataObj.data + '"><a href="javascript:;" class="iconfont icon-cha1"></a><input type="hidden" name="filePath" value="' + dataObj.data + '"></div>'
    //                     $(".applyentry_con").prepend(shtml);
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.message
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //             }
    //         });
    //     });
    // });

    //删除附件
    $(".applyentry_con").on("click", ".icon-cha1", function () {
        $(this).parents(".applyentry_cell").remove();
    });

    // 查看大图
    $(".applyentry_con").on("click", "img", function () {
        $.showPhoto($(this).attr("src"));
    });

    // 上一步
    // $(".applyentry_btn_up").off().on("click", function () {
    //     history.go(-1);
    // });

    //查看资质文件类型
    $(".applyentry_tips a").unbind().bind("click",function(){
        var dialogHTML = '<div class="material_list clearfix"><table><colgroup><col width="100"><col width="400"></colgroup><thead><tr><th>序号</th><th>入驻资质文件名称</th></tr></thead><tbody><tr><td>1</td><td>经销代理资格证明</td></tr><tr><td>2</td><td>经营许可证</td></tr><tr><td>3</td><td>生产许可证</td></tr><tr><td>4</td><td>安全生产许可证</td></tr><tr><td>5</td><td>质量认证证书</td></tr><tr><td>6</td><td>品牌所有权证书或授权书</td></tr><tr><td>7</td><td>职业健康安全认证证书</td></tr><tr><td>8</td><td>环境管理体系认证证书</td></tr><tr><td>9</td><td>特殊行业资质证书</td></tr><tr><td>10</td><td>原产地证明公司</td></tr><tr><td>11</td><td>其他资质及荣誉文件</td></tr></tbody></table></div>';
        $.dialog({
            title: '资质文件名称',
            content: dialogHTML,
            width: 600,
            confirm: {
                show: false,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                
            }
        });
        return false;
    });

    // 去签署协议
    $(".applyentry_btn_go").off().on("click", function () {
        var main = $(this);
        var fileArr = [];
        var len = $(".applyentry_cell").length;
        // if (len <= 1) {
        //     $.msgTips({
        //         type: "warning",
        //         content: "请上传资质文件！",
        //     });
        //     return false;
        // }
        for (let i = 0; i < len - 1; i++) {
            fileArr.push($(".applyentry_cell").eq(i).find("input").val());
        }
        $.ajaxForJson(config.shopPath + 'admissionPost', {
            admission_id: main.attr("data-id"),
            qualifications_src: fileArr,
            step: main.attr("step_val")
        }, function (json) {
            if (json.code === 2000) {
                location.href = '/' + json.data.url;
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg,
                });
                return false;
            }
        });
    });
});