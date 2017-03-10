<template>
  <div>
    <div style="height: 100px;width: 100%;"></div>
    <div class="box">
      <div class="container-fluid">
        <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 video-box">
          <video class="video" loop autoplay id="video">
            <source
              src="https://github.com/beautifulBoys/beautifulBoys.github.io/blob/master/source/site/video.mp4?raw=true"
              type='video/mp4'/>
          </video>
          <canvas id="canvas"></canvas>
          <div class="canvas">
            <div class="li-box"></div>
          </div>
          <div class="input">
            <div class="input-group">
              <div class="input-group-btn">
                <div class="btn-group dropup">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">颜色<span
                    class="caret"></span></button>
                  <ul class="dropdown-menu">
                    <li><a href="javascript:void(0)" @click="color = 'white'">白色</a></li>
                    <li><a href="javascript:void(0)" @click="color = 'red'">红色</a></li>
                    <li><a href="javascript:void(0)" @click="color = 'yellow'">黄色</a></li>
                  </ul>
                </div>
                <div class="btn-group dropup">
                  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">字体大小<span
                    class="caret"></span></button>
                  <ul class="dropdown-menu">
                    <li><a href="javascript:void(0)" @click="fontSize = '30px'">30px</a></li>
                    <li><a href="javascript:void(0)" @click="fontSize = '25px'">25px</a></li>
                    <li><a href="javascript:void(0)" @click="fontSize = '20px'">20px</a></li>
                  </ul>
                </div>
              </div>
              <input type="text" placeholder="请输入弹幕" v-model.trim="content" class="form-control"
                     @keyup.enter="enterEvent"/>
              <div class="input-group-btn">
                <div class="btn-group">
                  <button type="button" class="btn btn-success" @click="enterEvent">发送弹幕</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xs-0 col-sm-3 col-md-3 col-lg-3 list-box">
          <div style="width: 100%;height: 50px;border: 1px solid #dedede;"></div>
          <ul class="nav nav-tabs" id="nav">
            <li class="menu"><a href="#a" data-toggle="tab">推荐视频</a></li>
            <li class="menu active"><a href="#b" data-toggle="tab">弹幕列表</a></li>
            <li class="menu"><a href="#c" data-toggle="tab">屏蔽设定</a></li>
          </ul>
          <div class="tab-content" style="font-size: 16px;" data-target="#nav">
            <div class="tab-pane" id="a">我是推荐视频列表</div>
            <div class="tab-pane active" id="b">
              <div class="tab-pane-box">
                <div class="tab-header"><span style="width: 18%;text-align:center;">视频时间</span><span style="width: 50%">弹幕内容</span><span
                  style="width: 20%">发送时间</span>
                </div>
                <div class="talk-list-box">
                  <ol class="talk-list">
                    <li v-for="item in list">
                      <a href="javascript:void(0)">
                        <span class="currentTime">{{item.currentTime.mm}}:{{item.currentTime.ss}}</span>
                        <span class="content">{{item.content}}</span>
                        <span class="sendTime">{{item.sendTime.M}}-{{item.sendTime.D}} {{item.sendTime.hh}}:{{item.sendTime.mm}}</span>
                      </a>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div class="tab-pane" id="c">我是弹幕设定区块</div>
          </div>
        </div>
        <span class="length text"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from '../lib/jquery/jquery-3.1.1.min';
  import b from '../lib/bootstrap/js/bootstrap.min';
  import io from '../lib/socket.io';
  export default {
    name: 'app',
    data () {
      return {
        list: [{
          'currentTime': {
            'ss': '08',
            'mm': '00'
          },
          'sendTime': {
            'ss': '45',
            'mm': '37',
            'hh': '11',
            'D': '05',
            'M': '03'
          },
          'content': '后台及数据库未部署上线，请下载项目到本地运行。',
          'userId': 123414,
          'color': 'yellow',
          'fontSize': '25px'
        }],
        content: '',
        color: 'white',
        fontSize: '25px'
      };
    },
    mounted () {
      console.log(b);
      var me = this;
      this.connect();// 连接服务器
      setTimeout(function () { // 模拟一条提示弹幕
        me.danMuAnimate('后台及数据库未部署上线，请下载项目到本地运行。', 'yellow', '25px');
      }, 2500);
    },
    methods: {
      connect () {
        var me = this;
        this.httpServer = io.connect('http://192.168.175.103:3001'); // 后台IP地址及端口号 （自己电脑的ip）

        this.httpServer.emit('login');
        this.httpServer.on('loginSuccess', function (list) {
          if (list) {
            console.log('连接好了');
            me.list = list;
            me.scrollBullet();// 播放弹幕
          }
        });

        this.httpServer.on('messageSuccess', function (obj) { // 自己的信息发送成功。
          console.log('收到messageSuccess');
        });

        this.httpServer.on('message', function (obj) {
          console.log('收到message:' + obj.content);
          me.list.push(obj);
          me.danMuAnimate(obj.content, obj.color, obj.fontSize);
        });
      },
      scrollBullet () {
        var me = this;
        setInterval(function () {
          for (var i = 0; i < me.list.length; i++) {
            if (me.getNowDate().currentTime.mm === me.list[i].currentTime.mm) {
              me.danMuAnimate(me.list[i].content, me.list[i].color, me.list[i].fontSize);
            }
          }
        }, 1000);
      },
      enterEvent () {
        this.sendTalk(this.content);
        this.content = '';
      },
      sendTalk (content) {
        var a = this.getNowDate();
        a.content = content;
        a.userId = 123414;
        a.color = this.color;
        a.fontSize = this.fontSize;
        // 推送发消息
        this.list.push(a);
        this.danMuAnimate(content, this.color, this.fontSize);
        this.httpServer.emit('message', a);
      },
      colorEvent (color) {
        this.color = color;
      },
      getNowDate () {
        var date = new Date();
        var b = document.getElementById('video').currentTime.toFixed(2).toString().split('.');
        var a = {
          currentTime: {
            mm: b[0].length === 1 ? '0' + b[0] : b[0],
            ss: b[1].length === 1 ? '0' + b[1] : b[1]
          },
          sendTime: {
            M: (date.getMonth() + 1).toString().length === 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString(),
            D: date.getDay().toString().length === 1 ? '0' + date.getDay().toString() : date.getDay().toString(),
            hh: date.getHours().toString().length === 1 ? '0' + date.getHours().toString() : date.getHours().toString(),
            mm: date.getMinutes().toString().length === 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString(),
            ss: date.getSeconds().toString().length === 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString()
          }
        };
        return a;
      },
      danMuAnimate (content, color, fontSize) {
        content = content.toString();
        $('.length').eq(0).show();
        var length = $('.length').html(content).eq(0).width() + 16;
        $('.length').eq(0).hide();
        var time = ((400 - length) / 100 + 13) * 1000;
        $('.canvas .li-box').eq(0).append(`<p class="text">${content}</p>`);
        var top = 40 * parseInt(Math.random() * 580 / 40);

        $('.canvas .text').last()
          .css({
            'top': top + 'px',
            'left': `${1080}px`,
            'width': `${length}px`,
            'color': color,
            'font-size': fontSize
          }).animate({
          left: `-${length}px`
        }, time, 'linear', function () {
          $(this).remove();
        });
      }
    }
  };
</script>

<style scoped lang="less">
  @import "../lib/bootstrap/css/bootstrap.min.css";

  .box {
    width: 100%;
    max-width: 1440px;
    min-width: 1440px;
    margin: 0 auto;
    background: #fff;
    font-size: 0;
    font-family: "Microsoft YaHei";
    button, input {
      outline: none;
    }
    .container-fluid {
      padding: 0;
      div[class^=col-] {
        padding: 0;
      }
      .video-box {
        width: 1080px;
        height: 608px;
        position: relative;
        .video {
          width: 100%;
          height: 100%;
        }
        .canvas {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          .li-box {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
          }
        }
        .input {
          width: 1080px;
          position: absolute;
          top: 608px;
          background: #fff;
        }
      }
      .list-box {
        height: 642px;
        ul {
          margin: 0;
          padding: 0;
          display: flex;
          li.menu {
            width: 100%;
            &.active a {
              color: #333;
              border-top: 1px solid #fff;
            }
            a {
              line-height: 15px;
              font-size: 13px;
              color: #888;
              margin: 0;
              text-align: center;
            }
          }
        }
        .tab-pane {
          .tab-pane-box {
            width: 100%;
            height: 550px;
            .talk-list-box {
              width: 100%;
              overflow-y: scroll;
              ol.talk-list {
                padding: 0;
                width: 100%;
                li {
                  padding: 0;
                  margin: 0;
                  height: 30px;
                  line-height: 30px;
                  width: 100%;
                  list-style-type: none;
                  &:hover {
                    background: #eee;
                    .content {
                      color: #333;
                    }
                  }
                  a {
                    font-size: 13px;
                    color: #888;
                    line-height: 30px;
                    height: 30px;
                    overflow: hidden;
                    text-decoration: none;
                    span {
                      display: inline-block;
                      height: 30px;
                      overflow: hidden;
                      &.content {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: 48%;
                        margin: 0 2%;
                      }
                      &.currentTime {
                        width: 18%;
                        text-align: center;
                      }
                      &.sendTime {
                        width: 22%;
                        margin: 0 0 0 2%;
                      }
                    }
                  }
                }
              }
            }
            .tab-header {
              background: #fff;
              padding: 3px 0;
              span {
                line-height: 30px;
                display: inline-block;
                font-size: 13px;
                color: #888;
                margin: 0 0 0 2%;
              }
            }
          }
        }
      }
      #canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        display: none;
      }
    }
  }
</style>
<style>
  .text {
    line-height: 30px;
    position: absolute;
    right: -300px;
    z-index: 100;
    font-size: 30px;
    padding: 0 8px;
    font-weight: 500;
    font-family: 'Microsoft YaHei';
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  }

  .length {
    display: none;
  }

  .talk-list-box {
    height: calc(100% - 38px);
  }
</style>

