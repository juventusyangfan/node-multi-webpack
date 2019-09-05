require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#tenderList',
        data() {
            return {
                loading: true,
                list: [],
                count: 0,
                limit: 10,
                current: 1
            }
        },
        mounted() {
            this.getTenderList(1);
        },
        methods: {
            getTenderList(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + 'ajaxTenderListForItem', {
                    itemId: $("[item-id]").attr("item-id"),
                    sort: $(".back_list_nav").find("span.active").attr("sorttype"),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        $(".back_list_nav").find("span.floatR").html("共计：" + that.count + "个");
                    }
                    that.loading = false;
                });
            }
        }
    });

    //点击排序类型
    $("span[sorttype]").unbind().bind("click", function () {
        $("span[sorttype]").removeClass("active");
        $(this).addClass("active");
        vm.getTenderList(1);
        return false;
    });
});