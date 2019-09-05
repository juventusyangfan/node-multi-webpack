/**
 * Created by yangfan on 2017/7/4.
 */
var path = require('path');
var moduleExports = {};

var dirName = 'bidding';//client文件夹下项目根目录名称，打包不同项目时需更改此处

/**源文件目录**/
moduleExports.staticRootDir = path.resolve(__dirname, '../../client');// 项目根目录
moduleExports.srcRootDir = path.resolve(moduleExports.staticRootDir, './' + dirName);//根目录下的业务代码
moduleExports.vendorDir = path.resolve(moduleExports.staticRootDir, './vendor'); //存放所有不能用npm管理的第三方库
moduleExports.pagesDir = path.resolve(moduleExports.srcRootDir, './pages');//存放各个页面独有的部分，如入口文件、只有该页面使用到的css、js和模板文件等
moduleExports.publicDir = path.resolve(moduleExports.srcRootDir, './public-resource');//存放各个页面使用到的公共资源
moduleExports.logicDir = path.resolve(moduleExports.publicDir, './logic');//存放公用的业务逻辑
moduleExports.libsDir = path.resolve(moduleExports.publicDir, './libs');//与业务逻辑无关的库和方法都可以放到这里
moduleExports.configDir = path.resolve(moduleExports.publicDir, './config');//存放各种配置文件
moduleExports.componentsDir = path.resolve(moduleExports.publicDir, './components');//存放组件，可以是纯HTML，也可以包含js/css/image等
moduleExports.layoutDir = path.resolve(moduleExports.publicDir, './layout');//存放UI布局，组织各个组件拼起来，因应需要可以有不同的布局套路

/**生成文件目录**/
moduleExports.buildDir = path.resolve(__dirname, '../../app/' + dirName);//存放编译后生成的所有代码、资源（图片、字体等，虽然只是简单的从源目录迁移过来）

module.exports = moduleExports;
