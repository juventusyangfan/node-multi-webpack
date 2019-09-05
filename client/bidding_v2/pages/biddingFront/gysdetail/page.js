require('cp');
require('elem');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
require('./page.css');
import Vue from 'vue';

const config = require('configModule');
$(() => {
    //切换供应商信息
    $(".gys_menu").find(".gys_menu_cell").unbind().bind("click", function () {
        var _index = $(this).index();
        $(".gys_menu").find(".gys_menu_cell").removeClass("active");
        $(this).addClass("active");
        $(".gys_container").hide();
        $(".gys_container").eq(_index).show();
        return false;
    });

    //渲染列表
    var vm = new Vue({
        el: '#findgys',
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
            this.getGys(1);
        },
        methods: {
            getGys(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + 'supplier/index/applyList', {
                    code: $("input[name='code']").val()
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                    }
                    that.loading = false;
                });
            }
        }
    });
});