require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    //添加指标事件
    var _lvlLen = $(".attr_table").find("td[level='1']").length;
    $(document).on("click", ".add_multi", function () {
        var main = $(this);
        var _td = main.parents("td"),
            _level = _td.attr("level"), //记录指标级数
            _parentId = _td.attr("parent-id"); //记录上一级指标序号
        var trHTML = '';
        switch (_level) {
            case "1":
                trHTML = '<tr class="multi_tr">';
                trHTML += '<td colspan="3" class="multi_td" level="1" data-id="' + _lvlLen + '"><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_center"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_right"><textarea rows="3" style="width: 60%;"></textarea></div></div></div></td>';
                trHTML += '<td colspan="3" class="multi_td" level="2" data-id="' + _lvlLen + "-0" + '" parent-id="' + _lvlLen + '"><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_center"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_right"><textarea rows="3" style="width: 60%;"></textarea></div></div></div></td>';
                trHTML += '<td colspan="3" class="multi_td" level="3" parent-id="' + _lvlLen + "-0" + '"><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_center"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_right"><textarea rows="3" style="width: 60%;"></textarea></div></div></div></td>';
                trHTML += '</tr>';
                _lvlLen++;
                main.parents("tbody").append(trHTML);
                break;
            case "2":
                let lvl2Td = $(".attr_table").find("td[parent-id='" + _parentId + "']");
                for (let i = 0; i < lvl2Td.length; i++) {
                    let lvl3Id = lvl2Td.eq(i).attr("data-id"); //找出当前lv2下面所有的lv3
                    $(".attr_table").find("td[parent-id='" + lvl3Id + "']").attr("parent-id", _parentId + "-" + i); //重新序列化lv3的parent-id
                    lvl2Td.eq(i).attr("data-id", _parentId + "-" + i); //序列化lv2的data-id
                }
                trHTML = '<tr class="multi_tr">';
                trHTML += '<td colspan="3" class="multi_td" level="2" data-id="' + _parentId + "-" + lvl2Td.length + '" parent-id="' + _parentId + '"><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_center"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_right"><textarea rows="3" style="width: 60%;"></textarea></div></div></div></td>';
                trHTML += '<td colspan="3" class="multi_td" level="3" parent-id="' + _parentId + "-" + lvl2Td.length + '"><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_center"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_right"><textarea rows="3" style="width: 60%;"></textarea></div></div></div></td>';
                trHTML += '</tr>';
                $(".attr_table").find("td[data-id='" + _parentId + "']").each(function () {
                    var lvlTd = $(this);
                    if (lvlTd.attr("level") == "1") {
                        var rowNum = lvlTd.attr("rowspan") ? parseInt(lvlTd.attr("rowspan")) : 1;
                        rowNum++;
                        lvlTd.attr("rowspan", rowNum);
                    }
                });
                main.parents("tr").after(trHTML);
                break;
            case "3":
                trHTML = '<tr class="multi_tr">';
                trHTML += '<td colspan="3" class="multi_td" level="3" parent-id="' + _parentId + '"><div class="multi_box"><div class="multi_oprate"><i class="iconfont icon-jiahao1 add_multi"></i><i class="iconfont icon-huishouxiang del_multi"></i></div><div class="multi_inner clearfix"><div class="multi_left"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_center"><textarea rows="3" style="width: 60%;"></textarea></div><div class="multi_right"><textarea rows="3" style="width: 60%;"></textarea></div></div></div></td>';
                trHTML += '</tr>';
                $(".attr_table").find("td[data-id='" + _parentId + "']").each(function () {
                    let lv2Td = $(this);
                    let row2Num = lv2Td.attr("rowspan") ? parseInt(lv2Td.attr("rowspan")) + 1 : 2;
                    lv2Td.attr("rowspan", row2Num);
                    let lv1Td = $(".attr_table").find("td[data-id='" + lv2Td.attr("parent-id") + "']");
                    let row1Num = lv1Td.attr("rowspan") ? parseInt(lv1Td.attr("rowspan")) + 1 : 2;
                    lv1Td.attr("rowspan", row1Num);
                });
                main.parents("tr").after(trHTML);
                break;
        }
        return false;
    });
});