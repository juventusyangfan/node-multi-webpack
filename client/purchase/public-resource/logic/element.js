require('cssDir/element.css');
const config = require("configModule");

$(() => {
    $.fn.extend({
        //checkbox控件
        initCheckbox: function () {
            $(this).each(function () {
                var checkbox = $(this);
                var title = checkbox.attr("title"),
                    checked = checkbox.prop("checked"),
                    disClass = checkbox.prop("disabled") ? 'cjy-disabled' : '';

                var iconClass = 'icon-checkbox',
                    iconCon = '';
                if (checked) {
                    iconClass = 'icon-checkbox-';
                    iconCon = 'cjy-checked';
                }

                var cbHTML = '<div class="cjy-checkbox ' + iconCon + ' ' + disClass + '"><span>' + title + '</span><i class="iconfont ' + iconClass + '"></i></div>';
                checkbox.next(".cjy-checkbox").remove();
                checkbox.after(cbHTML).hide();

                checkbox.next(".cjy-checkbox").unbind().bind("click", function () {
                    if (!$(this).hasClass("cjy-disabled")) {
                        if ($(this).hasClass("cjy-checked")) {
                            $(this).removeClass("cjy-checked");
                            $(this).find("i.icon-checkbox-").removeClass("icon-checkbox-").addClass("icon-checkbox");
                            checkbox.prop("checked", false);
                        } else {
                            $(this).addClass("cjy-checked");
                            $(this).find("i.icon-checkbox").removeClass("icon-checkbox").addClass("icon-checkbox-");
                            checkbox.prop("checked", true);
                        }
                    }
                    checkbox.trigger("change");
                });
            });
        },
        //radio控件
        initRadio: function () {
            $(this).each(function () {
                var radio = $(this);
                var name = radio.attr("name"),
                    title = radio.attr("title"),
                    checked = radio.prop("checked"),
                    disClass = radio.prop("disabled") ? 'cjy-disabled' : '';

                var iconClass = 'icon-radio',
                    iconCon = '';
                if (checked) {
                    iconClass = 'icon-radio-';
                    iconCon = 'cjy-checked';
                }

                var rdHTML = '<div data-name="' + name + '" class="cjy-radio ' + iconCon + ' ' + disClass + '"><span>' + title + '</span><i class="iconfont ' + iconClass + '"></i></div>';
                radio.next(".cjy-radio").remove();
                radio.after(rdHTML).hide();
                radio.next(".cjy-radio[data-name='" + name + "']").unbind().bind("click", function () {
                    if (!$(this).hasClass("cjy-disabled")) {
                        if (!$(this).hasClass("cjy-checked")) {
                            $(".cjy-radio[data-name='" + name + "']").removeClass("cjy-checked");
                            $(this).addClass("cjy-checked");
                            $(".cjy-radio[data-name='" + name + "']").find("i.icon-radio-").removeClass("icon-radio-").addClass("icon-radio");
                            $(this).find("i.icon-radio").removeClass("icon-radio").addClass("icon-radio-");
                            $("input[name='" + name + "']").prop("checked", false);
                            radio.prop("checked", true);
                        }
                    }
                    radio.trigger("change");
                });

            });
        },
        /*select控件
         * cjy-search:此属性代表可输入搜索下拉列表
         * */
        initSelect: function () {
            $(this).each(function () {
                var select = $(this);
                if (typeof (select.attr("noRender")) != "undefined") {
                    return false;
                }
                var val = select.attr("value") || "",
                    text = select.find("option[value='" + val + "']").html() || "请选择";
                select.val(val);
                var selW = select.outerWidth();
                var readOnly = typeof (select.attr("cjy-search")) == "undefined" ? "readOnly" : "",
                    bgStyle = (select.attr("cjy-search")) == "undefined" ? "" : "background-color: #fff;";
                text = readOnly == "" ? text == "请选择" ? "" : text : text;
                var selHTML = '<div class="cjy-select" style="width: ' + selW + 'px;"><div class="cjy-select-title"><input type="text" placeholder="' + select.find("option").eq(0).html() + '" value="' + text + '" ' + readOnly + ' class="cjy-select-input" style="width: ' + (selW - 40) + 'px;' + bgStyle + '"><i class="iconfont icon-xiajiantou"></i></div><dl style="width: ' + selW + 'px;">';
                for (var i = 0; i < select.find("option").length; i++) {
                    let className = val == select.find("option").eq(i).attr("value") ? "sel-this" : "";
                    let disClass = select.find("option").eq(i).prop("disabled") ? 'cjy-disabled' : '';
                    selHTML += '<dd data-value="' + select.find("option").eq(i).attr("value") + '" class="' + className + ' ' + disClass + '" title="' + select.find("option").eq(i).html() + '" style="width: ' + (selW - 20) + 'px;">' + select.find("option").eq(i).html() + '</dd>';
                }
                selHTML += '</dl></div>';
                select.next(".cjy-select").remove();
                select.after(selHTML).hide();
                select.next(".cjy-select").find(".cjy-select-title").unbind().bind("click", function () {
                    var main = $(this);
                    if (main.parents(".cjy-select").hasClass("cjy-selected")) {
                        main.parents(".cjy-select").removeClass("cjy-selected");
                    } else {
                        $(".cjy-select").removeClass("cjy-selected");
                        main.parents(".cjy-select").addClass("cjy-selected");
                    }
                });
                select.next(".cjy-select").find("dd").unbind().bind("click", function () {
                    var main = $(this);
                    if (main.hasClass("cjy-disabled")) {
                        return;
                    }
                    var opVal = main.attr("data-value"),
                        opTxt = main.html();
                    main.parent().find("dd").removeClass("sel-this");
                    main.addClass("sel-this");
                    main.parents(".cjy-select").find(".cjy-select-input").val(opTxt);
                    select.val(opVal);
                    main.parents(".cjy-select").removeClass("cjy-selected");
                    select.trigger("change");
                });
                if (readOnly == "") {
                    select.next(".cjy-select").find(".cjy-select-input").unbind().bind("input", function () {
                        var main = $(this);
                        var searchVal = main.val();
                        if (select.next(".cjy-select").next("input").length <= 0) {
                            select.next(".cjy-select").after('<input type="hidden" name="' + select.attr("name") + '" value="' + searchVal + '">');
                        } else {
                            select.next(".cjy-select").next("input").val(searchVal);
                        }
                        $(".cjy-select").removeClass("cjy-selected");
                        main.parents(".cjy-select").addClass("cjy-selected");
                        let newSel = '';
                        for (var i = 0; i < select.find("option").length; i++) {
                            let disClass = select.find("option").eq(i).prop("disabled") ? 'cjy-disabled' : '';
                            if (select.find("option").eq(i).html().indexOf(searchVal) > -1) {
                                newSel += '<dd data-value="' + select.find("option").eq(i).attr("value") + '" class="' + disClass + '" title="' + select.find("option").eq(i).html() + '" style="width: ' + (selW - 20) + 'px;">' + select.find("option").eq(i).html() + '</dd>';
                            }
                        }
                        main.parents(".cjy-select").find("dl").html(newSel);
                        select.val("0");

                        select.next(".cjy-select").find("dd").unbind().bind("click", function () {
                            var main = $(this);
                            if (main.hasClass("cjy-disabled")) {
                                return;
                            }
                            var opVal = main.attr("data-value"),
                                opTxt = main.html();
                            main.parent().find("dd").removeClass("sel-this");
                            main.addClass("sel-this");
                            main.parents(".cjy-select").find(".cjy-select-input").val(opTxt);
                            select.val(opVal);
                            main.parents(".cjy-select").removeClass("cjy-selected");
                            select.trigger("change");
                            select.next(".cjy-select").next("input").remove();
                        });
                    });
                }
            });
        },
        //多级下拉控件
        initMultiSelect: function (callback) {
            $(this).each(function () {
                var multi = $(this);

                var _id = multi.attr("data-id") || "", //初始化时的省市区
                    _name = multi.attr("data-name") || "";

                var multiHTML = '<div class="cjy-multi"><div class="cjy-multi-title"><input type="hidden" name="product_id[]" value="' + _id + '"><input type="text" name="product_name[]" placeholder="请选择" readonly="" class="cjy-multi-input" value="' + _name + '"><i class="iconfont icon-xiajiantou"></i></div><div class="cjy-multi-content"></div></div>';
                multi.html(multiHTML);

                var liData = getCata();
                multi.find(".cjy-multi-content").html('<ul>' + liData + '</ul>');
                setWidth();

                //展开收起联动区域
                multi.find(".cjy-multi-title").unbind().bind("click", function () {
                    if ($(this).parents(".cjy-multi").hasClass("cjy-selected")) {
                        $(this).parents(".cjy-multi").removeClass("cjy-selected");
                    } else {
                        $(this).parents(".cjy-multi").addClass("cjy-selected");
                    }
                });

                //选择分类菜单
                multi.find(".cjy-multi-content").off().on("click", "li a", function () {
                    var main = $(this);
                    var id = main.attr("data-id");
                    var data = getCata(id);

                    main.parents("ul").find("li").removeClass("act");
                    main.parent().addClass("act");

                    if (data) {
                        main.parents("ul").nextAll().remove();
                        multi.find(".cjy-multi-content").append('<ul>' + data + '</ul>');
                        setWidth();
                    } else {
                        multi.find(".cjy-multi-input").val(main.html());
                        multi.find("input[type='hidden']").val(id);
                        multi.find(".cjy-multi").removeClass("cjy-selected");
                        if (callback) {
                            callback(multi);
                        }
                    }
                    return false;
                });

                function getCata(id) {
                    var cataId = id || "";
                    var liHTML = '';
                    $.ajax({
                        type: "POST",
                        async: false,
                        url: config.wwwPath + "/catalog",
                        data: {
                            id: cataId
                        },
                        dataType: "json",
                        success: function (dataObj) {
                            for (var i = 0; i < dataObj.data.length; i++) {
                                liHTML += '<li><a href="javascript:;" data-id="' + dataObj.data[i].id + '" title="' + dataObj.data[i].name + '">' + dataObj.data[i].name + '</a></li>'
                            }
                        }
                    });
                    return liHTML;
                }

                function setWidth() {
                    var ulLen = multi.find(".cjy-multi-content").find("ul").length,
                        ulWidth = multi.find(".cjy-multi-content").find("ul").width();
                    multi.find(".cjy-multi-content").css("width", ulWidth * ulLen + "px");
                }
            });
        },
        //省市区三级联动控件
        initAreaSelect: function (callback) {
            $(this).each(function () {
                var area = $(this);

                var areaHTML = '<div class="cjy-area"><input type="hidden" name="province"><input type="hidden" name="province_code"><input type="hidden" name="city"><input type="hidden" name="city_code"><input type="hidden" name="area"><input type="hidden" name="area_code"><div class="cjy-area-title"><span class="cjy-area-input">所有地区</span><i class="iconfont icon-xiajiantou"></i></div><div class="cjy-area-con"><div class="cjy-area-box clearfix"><div class="cjy-area-taps"><a href="javascript:;" class="area-taps-item area-taps-item-current">请选择</a></div><a class="all-region" href="javascript:;">所有地区</a></div><div class="cjy-area-content"></div></div></div>';
                area.html(areaHTML);

                //展开收起联动区域
                area.find(".cjy-area-title").unbind().bind("click", function () {
                    if ($(this).parents(".cjy-area").hasClass("cjy-selected")) {
                        $(this).parents(".cjy-area").removeClass("cjy-selected");
                    } else {
                        $(this).parents(".cjy-area").addClass("cjy-selected");
                    }
                });

                var _provinceId = area.attr("province") || "", //初始化时的省市区
                    _cityId = area.attr("city") || "",
                    _areaId = area.attr("area") || "";

                //选择省市区
                area.find(".cjy-area-content").off().on("click", "li a", function () {
                    var main = $(this);
                    if (main.hasClass("area-current")) {
                        return false;
                    }
                    area.find(".all-region").removeClass("area-current");
                    var areaId = main.attr("data-id"),
                        areaName = main.html(),
                        index = main.parents("ul").index();
                    main.parents("ul").find("li a").removeClass("area-current");
                    main.addClass("area-current");
                    area.find(".area-taps-item-current").html(areaName);
                    //删除此tab选项后的所有tab
                    main.parents("ul").nextAll().remove();
                    area.find(".cjy-area-taps a.area-taps-item").eq(index).nextAll().remove();

                    var reqUrl = "",
                        reqData = {
                            pid: areaId
                        };
                    switch (main.parents("ul").index()) {
                        case 0:
                            reqUrl = config.papiPath + "/api/common/getCity";
                            break;
                        case 1:
                            reqUrl = config.papiPath + "/api/common/getArea";
                            break;
                    }
                    if (main.parents("ul").index() <= 1) {
                        if (main.parents("ul").index() == 0) {
                            $("input[name='province']").val(areaName);
                            $("input[name='province_code']").val(areaId);
                            $("input[name='city']").val("");
                            $("input[name='city_code']").val("");
                            $("input[name='area']").val("");
                            $("input[name='area_code']").val("");
                        } else {
                            $("input[name='city']").val(areaName);
                            $("input[name='city_code']").val(areaId);
                            $("input[name='area']").val("");
                            $("input[name='area_code']").val("");
                        }
                        $.ajaxJSONP(reqUrl, reqData, function (dataObj) {
                            if (dataObj.code == "2000") {
                                var areaArr = dataObj.data;
                                if (areaArr && areaArr.length > 0) {
                                    area.find(".cjy-area-content").append(getTemplate(areaArr));
                                    area.find(".cjy-area-taps a.area-taps-item").removeClass("area-taps-item-current");
                                    area.find(".cjy-area-taps").append('<a href="javascript:;" class="area-taps-item area-taps-item-current">请选择</a>');
                                    main.parents("ul").hide();
                                    setAreaName(); //名字填入input
                                    if (_cityId != "") {
                                        area.find(".cjy-area-content").find("a[data-id='" + _cityId + "']").trigger("click");
                                        _provinceId = "";
                                    }
                                    if (_areaId != "") {
                                        area.find(".cjy-area-content").find("a[data-id='" + _areaId + "']").trigger("click");
                                        area.attr("city", "");
                                        _cityId = "";
                                    }
                                }
                            }
                        }, "json");
                    } else {
                        $("input[name='area']").val(areaName);
                        $("input[name='area_code']").val(areaId);
                        main.parents(".cjy-area").removeClass("cjy-selected");
                        setAreaName(); //名字填入input
                        _areaId = "";
                    }
                    if (callback) {
                        callback();
                    }
                    return false;
                });
                //选择tab
                area.find(".cjy-area-taps").off().on("click", "a", function () {
                    var index = $(this).index();
                    area.find(".area-taps-item").removeClass("area-taps-item-current");
                    $(this).addClass("area-taps-item-current");
                    area.find(".cjy-area-content ul").hide();
                    area.find(".cjy-area-content ul").eq(index).show();
                    return false;
                });
                // 所有地区
                area.find(".cjy-area-box").off().on("click", ".all-region", function () {
                    var main = $(this);
                    if (main.hasClass("area-current")) {
                        return false;
                    }
                    main.addClass("area-current");
                    area.find("span.cjy-area-input").html(main.html());
                    main.parents(".cjy-area").removeClass("cjy-selected");
                    area.find(".cjy-area-content ul").eq(0).css("display", "block").nextAll().remove();
                    area.find(".cjy-area-content").find(".area-current").removeClass("area-current");
                    area.find(".area-taps-item").eq(0).addClass("area-taps-item-current").html("请选择").nextAll().remove();
                    $("input[name='province']").val("");
                    $("input[name='province_code']").val("");
                    $("input[name='city']").val("");
                    $("input[name='city_code']").val("");
                    $("input[name='area']").val("");
                    $("input[name='area_code']").val("");
                    if (callback) {
                        callback();
                    }
                });

                $.ajaxJSONP(config.papiPath + "/api/common/getProvince", null, function (dataObj) {
                    if (dataObj.code == "2000") {
                        area.find(".cjy-area-content").html(getTemplate(dataObj.data));
                        if (_provinceId != "") {
                            area.find(".cjy-area-content").find("a[data-id='" + _provinceId + "']").trigger("click");
                        }
                    }
                }, "json");

                function getTemplate(data) { //此处需ajax请求
                    var areaItems = '';
                    if (data.length > 0) {
                        areaItems = '<ul class="clearfix">';
                        for (var i = 0; i < data.length; i++) {
                            areaItems += '<li><a href="javascript:;" data-id="' + data[i].id + '">' + data[i].name + '</a>';
                        }
                        areaItems += '</ul>';
                    }
                    return areaItems;
                }

                function setAreaName() { //名字加入到input
                    var inputName = "";
                    for (var i = 0; i < area.find(".cjy-area-content ul").length; i++) {
                        if (area.find(".cjy-area-content ul").eq(i).find("a.area-current").length > 0) {
                            if (i == 0) {
                                inputName += area.find(".cjy-area-content ul").eq(i).find("a.area-current").html();
                            } else {
                                inputName += " > " + area.find(".cjy-area-content ul").eq(i).find("a.area-current").html();
                            }
                        }
                    }
                    area.find("span.cjy-area-input").html(inputName);
                }
            });
        },
        //input状态控件
        initInput: function (type, msg) {
            var input = $(this);
            var type = type || "",
                msg = msg || "";
            var msgHTML = '';
            if (input.next(".msgCon").length <= 0) {
                input.parent().find(".msgCon").remove();
            } else {
                input.next(".msgCon").remove();
            }

            switch (type) {
                case "success":
                    msgHTML = '<span class="msgCon"><span class="successBg"><i class="iconfont icon-gou"></i></span>' + msg + '</span>';
                    break;
                case "warning":
                    if (msg != '') {
                        msgHTML = '<span class="msgCon"><span class="warningBg"><i class="iconfont icon-gantanhao"></i></span>' + msg + '</span>';
                    }
                    input.focus();
                    break;
                case "error":
                    if (msg != '') {
                        msgHTML = '<span class="msgCon"><span class="errorBg"><i class="iconfont icon-cha1"></i></span>' + msg + '</span>';
                    }
                    input.focus();
                    break;
                default:
                    msgHTML = '';
                    break;
            }
            input.attr("class", "cjy-input- cjy-input-" + type);
            input.parent().find(".msgCon").remove();
            input.parent().append(msgHTML);
        },
        //textarea计数控件
        initTextarea: function () {
            $(this).each(function () {
                var textarea = $(this);
                var txtW = textarea.outerWidth(),
                    txtH = textarea.outerHeight();
                var value = textarea.val().replace(/\n|\r/gi, ""); // 将换行符不计算为单词数
                var len = value.length,
                    maxLen = textarea.attr("maxlen");
                var txtHTML = '<div class="textCon" style="width: ' + txtW + 'px;height: ' + txtH + 'px;">' + textarea.outer() + '<div class="textNumCon"><span class="textNum">' + len + '</span>&nbsp;/&nbsp;' + maxLen + '</div></div>';
                if (textarea.parents(".textCon").length > 0) {
                    textarea.parents(".textCon").replaceWith(txtHTML);
                } else {
                    textarea.replaceWith(txtHTML);
                }
                $(".textCon").find("textarea").css("height", (txtH - 40) + "px").unbind().bind({
                    "input": function () {
                        var main = $(this);
                        len = main.val().length;
                        if (len > maxLen) {
                            main.parent().addClass("textError");
                            main.addClass("cjy-textarea-error");
                        } else {
                            main.parent().removeClass("textError");
                            main.removeClass("cjy-textarea-error");
                        }
                        main.parent().find(".textNum").html(len);
                    },
                    "focus": function () {
                        var main = $(this);
                        if (main.attr("placeholder") == main.val()) {
                            main.val("");
                        }
                    },
                    "blur": function () {
                        var main = $(this);
                        if (main.val() == "") {
                            main.val(main.attr("placeholder"));
                        }
                    }
                });
                $(".textCon").find("textarea").trigger("input");
            });
        },
        //input自动完成控件
        initAutoInput: function () {
            $(this).each(function () {
                var auto = $(this);
                var autoName = $(this).attr("name") ? $(this).attr("name") + '[]' : '';
                var autoW = auto.outerWidth();
                var autoVal = $(this).attr("autoVal") ? $(this).attr("autoVal").split(",") : [];
                var autoCount = $(this).attr("maxCount") ? parseInt($(this).attr("maxCount")) : '';
                var autoHTML = '<div class="cjy-auto" style="width:' + autoW + 'px;">';
                for (var i = 0; i < autoVal.length; i++) {
                    autoHTML += '<b class="cjy-auto-item">' + autoVal[i] + '<i class="iconfont icon-cha1"></i><input type="hidden" name="' + autoName + '" value="' + autoVal[i] + '"></b>';
                }
                autoHTML += '<input type="text" class="cjy-auto-input"></div>';
                auto.replaceWith(autoHTML);
                $(".cjy-auto").unbind().bind("click", function () {
                    $(this).find(".cjy-auto-input").focus();
                    return false;
                });
                $(".cjy-auto-item").find("i").unbind().bind("click", function () {
                    $(this).parent().remove();
                });
                $(".cjy-auto-input").unbind().bind("keydown", function (event) {
                    if (event.keyCode == 13 || event.keyCode == 32) {
                        if (autoCount != '' && $("b.cjy-auto-item").length < autoCount) {
                            var inputVal = $(this).val();
                            if ($.trim(inputVal) != "") {
                                $(this).before('<b class="cjy-auto-item">' + $.trim(inputVal) + '<i class="iconfont icon-cha1"></i><input type="hidden" name="' + autoName + '" value="' + $.trim(inputVal) + '"></b>');
                                $(this).val("");

                                $(".cjy-auto-item").find("i").unbind().bind("click", function () {
                                    $(this).parent().remove();
                                });
                            }
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: "数量已到达" + autoCount + "个"
                            });
                        }
                        return false;
                    }
                });
            });
        },
        //日历控件
        initCalendar: function () {
            $(this).each(function () {
                var cInput = $(this);
                var calendarHTML = '<div class="cjy-calendar">' + cInput.outer() + '<i class="iconfont icon-rili"></i></div>';
                cInput.after(calendarHTML).hide();
                cInput.next(".cjy-calendar").find(".cjy-calendar-input").calendar();
                cInput.remove();
            });
        }
    });
    //点击空白区隐藏下拉框
    $(document).mouseup(function (e) {
        var _con = $('.cjy-select,.cjy-area,.cjy-multi'); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1
            $('.cjy-select,.cjy-area,.cjy-multi').removeClass("cjy-selected");
        }
    });


    $("input[type='checkbox']").initCheckbox();
    $("input[type='radio']").initRadio();
    $("select").initSelect();

    $("input[name='successDemo']").initInput("success", "");
    $("input[name='warningDemo']").initInput("warning", "用户名已存在");
    $("input[name='errorDemo']").initInput("error", "密码错误");

    $("textarea.cjy-textarea").initTextarea();

    // $("[cjy-multi]").initMultiSelect();
    $("[cjy-area]").initAreaSelect();
    $("[cjy-autoInput]").initAutoInput();
    $("[calendar]").initCalendar();
});