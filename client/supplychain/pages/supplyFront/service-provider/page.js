require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');
import Vue from 'vue';

$(() => {
    var vm = new Vue({
        el: '#serviceList',
        data: {
            loading: true,
            list: [],
            count: 0,
            current: 1
        },
        mounted() {
            this.getServiceList(1);
        },
        methods: {
            getServiceList(currentPage) {
                var vueObj = this;
                vueObj.loading = true;
                vueObj.current = currentPage || vueObj.current;
                $.ajaxForJson(config.jcPath + 'Service/ajaxServiceList', {
                    p: vueObj.current,
                    limit: 9
                }, function (json) {
                    if (json.code === 2000) {
                        vueObj.list = json.data.data;
                        vueObj.count = json.data.count;
                    }
                    vueObj.loading = false;
                });
            }
        }
    });
});