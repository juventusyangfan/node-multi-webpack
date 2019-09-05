require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    var step1Top, step2Top, step3Top;
    initScroll();

    function initScroll() {
        step1Top = $('#step1').offset().top;
        step2Top = $('#step2').offset().top;
        step3Top = $('#step3').offset().top;
        window.onscroll = scrollEvent
    };
    //滚动监听
    function scrollEvent() {
        var targetTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            targetTop = document.documentElement.scrollTop + 1;
        } else if (document.body) {
            targetTop = document.body.scrollTop + 1;
        }

        if (targetTop >= $(".publish_container").offset().top) {
            $(".publish_step_con").css({
                "position": "fixed",
                "left": "50%",
                "top": "100px",
                "margin-left": "-824px"
            });
            if (targetTop >= $(".publish_container").height() - 100) {
                $(".publish_step_con").css({
                    "position": "absolute",
                    "left": "-142px",
                    "top": ($(".publish_container").height() - 180) + "px",
                    "margin-left": "0"
                });
            }
        } else {
            $(".publish_step_con").css({
                "position": "absolute",
                "left": "-142px",
                "top": "100px",
                "margin-left": "0"
            });
        }

        if (targetTop + 100 >= step1Top && targetTop + 100 < step2Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(0).find("a").addClass("active");
        } else if (targetTop + 100 >= step2Top && targetTop + 100 < step3Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(1).find("a").addClass("active");
        } else if (targetTop + 100 >= step3Top) {
            $(".publish_step_con").find("a.active").removeClass("active");
            $(".publish_step_con ul").find("li").eq(2).find("a").addClass("active");
        }
    };
    // 点击导航条后滑动到相应的位置
    $(".publish_step_con").on("click", "a", function () {
        var barclass = $(this).attr('data-href');
        var top = $("#" + barclass).offset().top;
        $("html,body").animate({
            scrollTop: top
        }, 500);
    });



    //输入税前单价
    $("input[name='free_unit_price[]']").unbind().bind("input", function () {
        // libs.lenNumber(this, 2);
        var $this = $(this);
        $this.val($this.val().replace(/[^\-?\d.]/g, "")); //输入负数或正数
        $this.val($this.val().replace(/^\-\./g, "")); //开头不能为-.
        $this.val($this.val().replace(/^\-\-/g, "")); //开头不能为--
        $this.val($this.val().replace(/^\./g, "")); //开头不能为.
        $this.val($this.val().replace(/\.{2,}/g, ".")); //不能多个.
        $this.val($this.val().replace(/\-{2,}/g, ".")); //不能多个-
        $this.val($this.val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
        $this.val($this.val().replace("-", "$#$").replace(/\-/g, "").replace("$#$", "-"));
        var rate = $(this).parents("tr").find("input[name='tax[]']").val();
        if ($(this).val() != "" && $(this).val() != "-" && rate != "") {
            $(this).parents("tr").find("input[name='unit_price[]']").val(($(this).val() * (parseFloat(rate / 100) + 1)).toFixed(2));
        } else {
            $(this).parents("tr").find("input[name='unit_price[]']").val(0);
        }
        setTotal();
    });
    //输入增值税率
    $("input[name='tax[]']").unbind().bind("input", function () {
        libs.lenNumber(this, 2);
        var pretax = $(this).parents("tr").find("input[name='free_unit_price[]']").val(),
            tax = $(this).parents("tr").find("input[name='unit_price[]']").val(),
            rate = $(this).val();
        if (pretax != "" && pretax != "0") {
            $(this).parents("tr").find("input[name='unit_price[]']").val(((parseFloat(rate / 100) + 1) * pretax).toFixed(2));
        } else if (tax != "" && tax != "0") {
            $(this).parents("tr").find("input[name='free_unit_price[]']").val((tax / (parseFloat(rate / 100) + 1)).toFixed(2));
        }
        setTotal();
    });
    //输入含税单价
    $("input[name='unit_price[]']").unbind().bind("input", function () {
        // libs.lenNumber(this, 2);
        var $this = $(this);
        $this.val($this.val().replace(/[^\-?\d.]/g, "")); //输入负数或正数
        $this.val($this.val().replace(/^\-\./g, "")); //开头不能为-.
        $this.val($this.val().replace(/^\-\-/g, "")); //开头不能为--
        $this.val($this.val().replace(/^\./g, "")); //开头不能为.
        $this.val($this.val().replace(/\.{2,}/g, ".")); //不能多个.
        $this.val($this.val().replace(/\-{2,}/g, ".")); //不能多个-
        $this.val($this.val().replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
        $this.val($this.val().replace("-", "$#$").replace(/\-/g, "").replace("$#$", "-"));
        var rate = $(this).parents("tr").find("input[name='tax[]']").val();
        if ($(this).val() != "" && $(this).val() != "-" && rate != "") {
            $(this).parents("tr").find("input[name='free_unit_price[]']").val(($(this).val() / (parseFloat(rate / 100) + 1)).toFixed(2));
        } else {
            $(this).parents("tr").find("input[name='free_unit_price[]']").val(0);
        }
        setTotal();
    });

    function setTotal() {
        var freeTotalPrice = 0,
            totalPrice = 0;
        $(".publish_table tbody").find("tr").each(function () {
            var trObj = $(this);
            var pretax = trObj.find("input[name='free_unit_price[]']").val() == "" || trObj.find("input[name='free_unit_price[]']").val() == "-" ? 0 : parseFloat(trObj.find("input[name='free_unit_price[]']").val()),
                tax = trObj.find("input[name='unit_price[]']").val() == "" || trObj.find("input[name='unit_price[]']").val() == "-" ? 0 : parseFloat(trObj.find("input[name='unit_price[]']").val()),
                num = trObj.find("input[name='purchased_amount[]']").val() == "" ? 0 : parseFloat(trObj.find("input[name='purchased_amount[]']").val());

            trObj.find("td").eq(6).html(parseFloat(tax * num).toFixed(2));

            freeTotalPrice += pretax * num;
            totalPrice += tax * num;
        });
        $(".free_total_amount").find("span.textRed").html(freeTotalPrice.toFixed(2));
        $(".total_amount").find("span.textRed").html(totalPrice.toFixed(2));
    }



    //附件上传
    $(".js_upload").uppyUpload(".js_upload", function (name, url) {
        var html = '<li><input type="hidden" name="qualifications_src[name][]" value="' + name + '"><input type="hidden" name="qualifications_src[url][]" value="' + url + '"><i class="iconfont icon-fujian"></i><a href="' + config.filePath + url + '" target="_blank">' + name + '</a><a class="file_del">删除</a></li>';
        $(".file_con").show().append(html);

        //删除附件
        $(".file_del").unbind().bind("click", function () {
            $(this).parents("li").remove();
            return false;
        });
    }, {
        extArr: ['jpg', 'png', 'jpeg', 'bmp', 'pdf', 'xls', 'xlsx', 'docx', 'doc', 'txt', 'zip', 'rar', 'cjy']
    });
    //删除附件
    $(".file_del").unbind().bind("click", function () {
        $(this).parents("li").remove();
        return false;
    });
    // //上传附件
    // $(document).on("click", "#uploadFile", function () {
    //     if ($(".file_con").find("li").length >= 8) {
    //         $.msgTips({
    //             type: "warning",
    //             content: "最多上传8个附件"
    //         });
    //         return false;
    //     }
    //     $("#uploadFile").unbind().bind("change", function () {
    //         var id = "uploadFile";
    //         document.domain = config.domainStr;
    //         $.ajaxFileUpload({
    //             url: config.inquiryPath + '/uploadFile',
    //             secureuri: config.domainStr,
    //             fileElementId: id,
    //             data: {
    //                 name: "uploadFile"
    //             },
    //             success: function success(data) {
    //                 var dataObj = eval('(' + data + ')');
    //                 if (dataObj.code == 2000) {
    //                     var html = '<li><input type="hidden" name="qualifications_src[name][]" value="' + dataObj.name + '"><input type="hidden" name="qualifications_src[url][]" value="' + dataObj.data + '"><i class="iconfont icon-fujian"></i><a href="' + config.filePath + dataObj.data + '" target="_blank">' + dataObj.name + '</a><a class="file_del">删除</a></li>';
    //                     $(".file_con").show().append(html);

    //                     //删除附件
    //                     $(".file_del").unbind().bind("click", function () {
    //                         $(this).parents("li").remove();
    //                         return false;
    //                     });
    //                 } else {
    //                     $.msgTips({
    //                         type: "warning",
    //                         content: dataObj.message
    //                     });
    //                 }
    //             },
    //             error: function error(data, status) {
    //                 $.msgTips({
    //                     type: "warning",
    //                     content: "文件不正确"
    //                 });
    //             }
    //         });
    //     });
    // });

    //发布报价
    var ajaxConfirmKey = true;
    $(".publish_done").unbind().bind("click", function () {
        if (ajaxConfirmKey) {
            var reqUrl = $("form").attr("action"),
                reqData = $("form").serialize();
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == "2000") {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg,
                        callback: function () {
                            window.location.href = dataObj.data.url;
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
                ajaxConfirmKey = true;
            });
            ajaxConfirmKey = true;
        }
        return false;
    });
});