# Bullet Screen Project

> 这是Node.js 学习的一个小例子，仿照哔哩哔哩弹幕网做的一个弹幕系统。包括前台、后台、以及数据库的部分。

## 项目预览

[点我在线预览](https://beautifulboys.github.io/html/example/bullet/)

## 项目安装及运行

``` bash

# 前台安装依赖，根目录下执行：
npm install

# 前台项目运行,根目录下执行：
npm run dev

# 后台安装依赖，server目录下：
npm install

# 后台项目运行，server目录下执行：
npm run build

# 数据库连接
// 数据库连接方式见下

# 浏览器访问：localhost:5555

```


## 页面展示

<p align="center">
	<img style="border: 1px solid #888" src="https://raw.githubusercontent.com/beautifulBoys/beautifulBoys.github.io/master/source/bullet/show.png"/>
</p>

## 后台配置相关

```js
// 前台连接方式（前台页面）
    this.httpServer = io.connect('http://192.168.175.103:3001'); // 后台IP地址（自己电脑的ip）及端口号 （自己后台接受请求端口号）

// 后台接受请求方式（后台页面）
    http.listen(3001, function () { // 自主修改端口号 ， 和前台端口号一致。
        console.log('监听端口:3001');
    });

// 数据库连接方式
    mongoose.connect('mongodb://192.168.175.115/lixinDb'); // IP地址 + 数据库名称

```
