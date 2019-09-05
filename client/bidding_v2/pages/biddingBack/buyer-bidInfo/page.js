require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#project',
        data() {
            return {
                loading: true,
                list: [],
                num:null,
                total_win_price:0,
                count: 0,
                limit: 10,
                current: 1
            }
        },
        mounted() {
            this.getProject(1);
        },
        methods: {
            getProject(currentPage) {
                var that = this;
                that.loading = true;
                that.current = currentPage || that.current;
                $.ajaxForJson(config.wwwPath + "buyer/Project/purchaseAjax", {
                    id: libs.getUrlParam("id"),
                    p: that.current
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        that.count = dataObj.data.count;
                        that.list = dataObj.data.data;
                        that.num = dataObj.data.num;
                        that.total_win_price = dataObj.data.total_win_price;
                    }
                    that.loading = false;
                });
            }
        }
    });
});