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
        //select控件
        initSelect: function () {
            $(this).each(function () {
                var select = $(this);
                var val = select.attr("value") || "",
                    text = val == "" ? "" : select.find("option[value='" + val + "']").html(),
                    placeholder = select.find("option").eq(0).val() == "" ? select.find("option").eq(0).html() : "请选择";
                select.val(val);
                var selW = select.outerWidth();
                var selHTML = '<div class="cjy-select" style="width: ' + selW + 'px;"><div class="cjy-select-title"><input type="text" placeholder="' + placeholder + '" value="' + text + '" readonly class="cjy-select-input" style="width: ' + (selW - 40) + 'px;"><i class="iconfont icon-xiajiantou"></i></div><dl style="width: ' + selW + 'px;">';
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
            });
        },
        //省市区三级联动控件
        initAreaSelect: function () {
            $(this).each(function () {
                var area = $(this);

                var areaHTML = '<div class="cjy-area"><input type="hidden" name="province"><input type="hidden" name="province_code"><input type="hidden" name="city"><input type="hidden" name="city_code"><input type="hidden" name="area"><input type="hidden" name="area_code"><div class="cjy-area-title"><input type="text" placeholder="请选择地区" value="" readonly class="cjy-area-input"><i class="iconfont icon-xiajiantou"></i></div><div class="cjy-area-con"><div class="cjy-area-taps"><a href="javascript:;" class="area-taps-item area-taps-item-current">请选择</a></div><div class="clearfix"></div><div class="cjy-area-content"></div></div></div>';
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

                $.ajaxJSONP(config.papiPath + "/api/common/getProvince", null, function (dataObj) {
                    if (dataObj.code == "2000") {
                        area.find(".cjy-area-content").append(getTemplate(dataObj.data));
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
                    area.find("input.cjy-area-input").val(inputName);
                }
            });
        },
        //多级城市下拉控件
        initAreaMulti: function (callback) {
            $(this).each(function () {
                var multi = $(this);

                var _width = multi.width(),
                    _placeholder = multi.attr("placeholder"),
                    cityArr = multi.attr("citys") == "" ? [] : eval('(' + multi.attr("citys") + ')');
                _cellHTML = '';

                if (cityArr.length > 0) {
                    for (var i = 0; i < cityArr.length; i++) {
                        _cellHTML += '<span class="cjy-multiCity-cell" target_id="' + cityArr[i].id + '">' + cityArr[i].name + '<input type="hidden" name="city_id[]" value="' + cityArr[i].id + '"><input type="hidden" name="city_name[]" value="' + cityArr[i].name + '"><i class="iconfont icon-cha1"></i></span>';
                    }
                } else {
                    _cellHTML = '<span class="cjy-multiCity-none">' + _placeholder + '</span>';
                }

                var multiHTML = '<div class="cjy-multi" style="width:' + (_width + 10) + 'px;"><div class="cjy-multi-title" style="width:' + _width + 'px;"><div class="cjy-multi-wrap" style="width:' + _width + 'px;">' + _cellHTML + '</div><i class="iconfont icon-xiajiantou"></i></div><div class="cjy-multi-content" style="width:400px;min-width:400px;"><ul class="cjy-multi-province"></ul><ul class="cjy-multi-city"></ul></div></div>';
                multi.html(multiHTML);
                $.ajaxJSONP(config.papiPath + "/api/common/getProvince", null, function (dataObj) {
                    if (dataObj.code == "2000") {
                        var liHTML = "";
                        for (var i = 0; i < dataObj.data.length; i++) {
                            liHTML += '<li><a href="javascript:;" data-id="' + dataObj.data[i].id + '" title="' + dataObj.data[i].name + '">' + dataObj.data[i].name + '</a></li>'
                        }
                        multi.find(".cjy-multi-province").html(liHTML);
                    }
                }, "json");

                //展开收起联动区域
                multi.find(".cjy-multi-title").unbind().bind("click", function () {
                    if ($(this).parents(".cjy-multi").hasClass("cjy-selected")) {
                        $(this).parents(".cjy-multi").removeClass("cjy-selected");
                    } else {
                        $(this).parents(".cjy-multi").addClass("cjy-selected");
                    }
                });

                //删除已选城市
                multi.find(".cjy-multi-wrap").off().on("click", "span.cjy-multiCity-cell", function () {
                    var main = $(this),
                        id = main.attr("target_id");
                    $(".cjy-multi-city li.act a[data-id='" + id + "']").parent().removeClass("act");
                    main.remove();
                    if (multi.find(".cjy-multi-wrap .cjy-multiCity-cell").length <= 0) {
                        multi.find(".cjy-multi-wrap").html('<span class="cjy-multiCity-none">' + _placeholder + '</span>');
                    }
                    return false;
                });
                //选择省份
                multi.find(".cjy-multi-province").off().on("click", "li a", function () {
                    var main = $(this);
                    var id = main.attr("data-id");
                    multi.find(".cjy-multi-province").find("li").removeClass("act");
                    main.parent().addClass("act");
                    $.ajaxJSONP(config.papiPath + "/api/common/getCity", {
                        pid: id
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            var areaArr = dataObj.data;
                            if (areaArr && areaArr.length > 0) {
                                var liHTML = "";
                                for (var i = 0; i < dataObj.data.length; i++) {
                                    var actStr = "";
                                    if (multi.find(".cjy-multi-wrap").find(".cjy-multiCity-cell[target_id='" + dataObj.data[i].id + "']").length > 0) {
                                        actStr = "act";
                                    }
                                    liHTML += '<li class="' + actStr + '"><a href="javascript:;" data-id="' + dataObj.data[i].id + '" title="' + dataObj.data[i].name + '"><i class="iconfont icon-gou"></i>' + dataObj.data[i].name + '</a></li>'
                                }
                                multi.find(".cjy-multi-city").html(liHTML);
                            }
                        }
                    }, "json");
                    return false;
                });
                //选择城市
                multi.find(".cjy-multi-city").off().on("click", "li a", function () {
                    var main = $(this);
                    var id = main.attr("data-id"),
                        name = main.attr("title");
                    if (main.parent().hasClass("act")) {
                        main.parent().removeClass("act");
                        multi.find(".cjy-multi-wrap").find(".cjy-multiCity-cell[target_id='" + id + "']").remove();
                    } else {
                        main.parent().addClass("act");
                        var _html = '<span class="cjy-multiCity-cell" target_id="' + id + '">' + name + '<input type="hidden" name="city_id[]" value="' + id + '"><input type="hidden" name="city_name[]" value="' + name + '"><i class="iconfont icon-cha1"></i></span>';
                        if (multi.find(".cjy-multi-wrap .cjy-multiCity-cell").length > 0) {
                            multi.find(".cjy-multi-wrap").append(_html);
                        } else {
                            multi.find(".cjy-multi-wrap").html(_html);
                        }
                    }
                });
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
                    msgHTML = '<span class="msgCon"><span class="warningBg"><i class="iconfont icon-gantanhao"></i></span>' + msg + '</span>';
                    input.focus();
                    break;
                case "error":
                    msgHTML = '<span class="msgCon"><span class="errorBg"><i class="iconfont icon-cha1"></i></span>' + msg + '</span>';
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
                textarea.replaceWith(txtHTML);
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

    $("[cjy-area]").initAreaSelect();
    $("[cjy-areaMulti]").initAreaMulti();
    $("[calendar]").initCalendar();
});