require('elem');
require('cp');
require('./page.css');

const config = require('configModule');
const libs = require('libs');

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入线图
require('echarts/lib/chart/line');
require('echarts/lib/chart/map');
require('echarts/map/js/china');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

$(() => {
    //banner轮播
    $(".js_slides").initPicPlayer();

    //菜单选择动画
    function setIndicator(el) {
        var _el = el || $(".banner_menu_con").find("li.act")
        var _left = _el[0].offsetLeft,
            _width = _el.width();
        $(".banner_menu_con").find(".indicator").css({
            left: (_left + (_width - 20) / 2) + "px"
        })
    }
    setIndicator();
    var timer = null;
    $(".banner_menu_con").find("li").unbind().bind({
        mouseover: function () {
            clearTimeout(timer);
            setIndicator($(this));
        },
        mouseout: function () {
            timer = setTimeout(function () {
                setIndicator();
            }, 500);
        }
    });

    //切换选择招标
    $(".box_head").on("click", ".box_head_item", function () {
        $(".box_head").find("ul").find("li").removeClass("act");
        $(this).parent().addClass("act");
        var _index = $(this).parent().index(),
            _len = $(".box_head").find("ul").find("li").length,
            _name = $(this).attr("data-name");
        if (_index == 0) {
            let _html = $(".box_head").find("ul").find("li")[_len - 1].outerHTML;
            $(".box_head").find("ul").find("li").eq(_len - 1).remove();
            $(".box_head").find("ul").css("margin-left", "-113px").prepend(_html);
            $(".box_head").find("ul").animate({
                marginLeft: "0"
            }, 200);
        }
        if (_index == 2) {
            let _html = $(".box_head").find("ul").find("li")[0].outerHTML;
            $(".box_head").find("ul").animate({
                marginLeft: "-113px"
            }, 200, function () {
                $(".box_head").find("ul").find("li").eq(0).remove();
                $(".box_head").find("ul").css("margin-left", "0").append(_html);
            });
        }
        $("ul.box_con_list").hide();
        $("ul.box_con_list[name='" + _name + "']").show();
    });

    var dataObj = JSON.parse(indexProductData);
    var chartTitleHTML = '<span class="fontSize16 bolder">区域价格指数</span>',
        chartArr = [],
        timeArr = [],
        colorArr = ['ff3600', '3dca55', 'cda819', '339ca8', '005eaa', 'c12e34', '0098d9', '32a487'];
    for (var i = 0; i < dataObj.cate_info.length; i++) {
        var _act = i == 0 ? 'act' : '';
        chartTitleHTML += '<a href="javascript:;" class="box_index_item ' + _act + '" data-index="' + i + '">' + dataObj.cate_info[i].cate_name + '<span class="index_item_line"></span></a>';
        var _chartObj = [],
            _timeObj = [];
        for (var j = 0; j < dataObj.cate_info[i].product_info.length; j++) {
            var _data = [],
                _time = [];
            for (var k = 0; k < dataObj.cate_info[i].product_info[j].value_info.length; k++) {
                _data.push(dataObj.cate_info[i].product_info[j].value_info[k].index_value);
                _time.push(dataObj.cate_info[i].product_info[j].value_info[k].index_time);
            }
            var _obj = {
                name: dataObj.cate_info[i].product_info[j].spec,
                symbol: 'none',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#' + colorArr[j],
                        lineStyle: {
                            color: '#' + colorArr[j]
                        }
                    }
                },
                data: _data
            }
            if (j == 0) {
                _timeObj = _time;
            }
            _chartObj.push(_obj)
        }
        chartArr.push(_chartObj);
        timeArr.push(_timeObj);
    }
    $("#chartWarp").parents(".banner_box_right").find(".box_head").html(chartTitleHTML);

    //指数切换
    $(".box_index_item").unbind().bind("click", function () {
        $(".box_index_item").removeClass("act");
        $(this).addClass("act");
        var _type = $(this).attr("data-index");
        var _chartArr = chartArr[_type],
            _timeArr = timeArr[_type];
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chartWarp'));
        // 绘制图表
        var option = {
            // 给echarts图设置背景色
            color: ['#fff'],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                x: 40,
                y: 15,
                x2: 0,
                y2: 20
            },
            calculable: true,

            xAxis: [{
                type: 'category',
                data: _timeArr
            }],
            yAxis: [{

                type: 'value',
                scale: true,
                axisLabel: {
                    color: "#666" //刻度线标签颜色
                }
            }],
            series: _chartArr
        };
        myChart.setOption(option, true);

        return false;
    });
    $(".box_index_item").eq(0).trigger("click");

    //中标公示滚动
    var rotateTimer = null;
    var proList = $(".bidding_announce_list");
    var proItem = proList.find("li");
    if (proItem.length > 4) {
        proList.css("top", "0px");
        // var copareVal = -(355 * Math.ceil(proItem.length / 4));
        var productRotateAnition = function () {
            proItem = proList.find("li");
            if (proList.is(":animated")) {
                return false;
            }
            var topVal = parseInt(proList.css("top")) - 355;
            // if (topVal <= copareVal) {
            //     topVal = 0;
            // }
            proList.stop(true, true).animate({
                top: topVal + 'px'
            }, 1000, function () {
                for (var i = 0; i < 4; i++) {
                    var _addHTML = proItem[i].outerHTML;
                    proList.append(_addHTML);
                    proItem.eq(i).remove();
                }
                proList.css("top", (topVal + 355) + "px");
            });
            rotateTimer = setTimeout(productRotateAnition, 6000);
        };
        rotateTimer = setTimeout(productRotateAnition, 6000);
        proList.off().on({
            mouseover: function () {
                clearTimeout(rotateTimer);
            },
            mouseout: function () {
                rotateTimer = setTimeout(productRotateAnition, 6000);
            }
        });
    }

    //中国地图
    var china_map = echarts.init(document.getElementById("china_map"));
    var mydata = [];
    var mapObj = JSON.parse(supplierMapInfo);
    for (var i = 0; i < mapObj.length; i++) {
        obj = {
            name: mapObj[i].province.replace("省", "").replace("内蒙古自治区", "内蒙古").replace("宁夏回族自治区", "宁夏").replace("新疆维吾尔自治区", "新疆").replace("广西壮族自治区", "广西").replace("西藏自治区", "西藏").replace("香港特别行政区", "香港").replace("澳门特别行政区", "澳门"),
            value: parseInt(mapObj[i].num)
        }
        mydata.push(obj);
    }

    var option = {
        //backgroundColor: '#FFFFFF',

        title: {
            text: '',
            textStyle: {
                color: '#fff'
            },
            x: 'center'
        },

        tooltip: {
            trigger: 'item',
            formatter: function (data) {
                return data.name;
            }
        },
        visualMap: {
            show: false,
            min: 1,
            max: 1000,
            calculable: true,
            inRange: {
                color: ['#F1F9FD', '#3788F6']
            }
        },
        series: [{
            name: '入驻供应商分布情况',
            left: '5',
            right: '5',
            zoom: 1,
            type: 'map',
            mapType: 'china',
            roam: true,
            itemStyle: {
                normal: { //未选中状态
                    borderWidth: 0.5,
                    borderColor: '#E4F2FE',
                    areaColor: '#fff'
                },
                emphasis: { // 也是选中样式
                    borderWidth: 0,
                    areaColor: '#3788F6'
                }
            },
            label: {
                normal: {
                    show: true,
                    align: 'center',
                    fontSize: 8,
                    color: "#5C99F7"
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            data: mydata
        }]
    };
    china_map.setOption(option);

    //供应链金场进场动画
    $(".jc_bank_cell").unbind().bind("mouseover", function () {
        if (!$(this).hasClass("active")) {
            $(".jc_bank_cell").removeClass("active");
            $(this).addClass("active");
        }
    });

    //未登录操作
    $("a[view-right='0']").unbind().bind("click", function () {
        var _msg = $(this).attr("view_right_title");
        $.msgTips({
            type: "warning",
            content: _msg
        });
        return false;
    });
});