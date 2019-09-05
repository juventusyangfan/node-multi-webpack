### 安装

执行命令：
```shell
$ git clone http://10.5.5.20:3000/yangfan/frontMVC.git
$ cd frontMVC && npm install
```

### 运行

然后，执行命令：
```shell
$ npm run static
$ npm run build
$ npm run dev
```

然后访问：[http://localhost:3000](http://localhost:3000/) 就可以看到示例了！

### MVC模型实现

但准确的说，前后端的分离的Nodejs框架都是VC架构，并没有Model层。因为**前后端分离框架不应该有任何数据库、SESSION存储的职能**。

如上图，具体流程如下：

* 第一步，Nodejs server监听到用户请求；
* 第二步，各个中间件（Middlewares）对请求上下文进行处理；
* 第三步，根据当前请求的path和method，进入对应的Controller；
* 第四步，通过http请求以proxy的模式向后端获取数据；
* 第五步，拼接数据，渲染模板。

### proxy机制

以实现一个电商应用下的“个人中心”页面为例。假设这个页面的首屏包括：用户基本信息模块、商品及订单模块、消息通知模块。

后端完成服务化架构之后，这三个模块可以解耦，拆分成三个HTTP API接口。这时候就可以通过`this.proxy`方法，去后端异步并发获取三个接口的数据。

这样有几个好处：

1. 在Nodejs层（服务端）异步并发向后端（服务端）获取数据，可以使HTTP走内网，性能更优；
2. 后端的接口可以同时提供给客户端，实现接口给Web+APP复用，后端开发成本更低；
3. 在Nodejs层获取数据后，直接交给页面，不管前端用什么技术栈，可以使首屏体验更佳。

那么，这么做是不是就完美了呢？肯定不是：

1. 后端接口在外网开放之后，如何保证接口安全性？
2. 如果当前页面请求是GET方法，但我想POST到后端怎么办？
3. 我想在Controller层重置post参数怎么办？
4. 后端接口设置cookie如何带给浏览器？
5. 经过一层Nodejs的代理之后，如何保证SESSION状态不丢失？
6. 如果当前请求是一个file文件流，又该怎么办呢？
...
