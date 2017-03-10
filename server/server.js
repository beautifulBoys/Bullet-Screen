var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var Bullet = require('../schemas/bullet.js'); // 数据库处理

function sock() {
    io.on('connection', function (socket) {
        console.log('新连接已创建 !');

        //监听新用户加入
        socket.on('login', function () {
            var me = this;
            //向除自己以外的所有客户端广播:有新用户加入
			console.log('有人联入');
/*

			Bullet.find({}, function (err, docs) {
                if (err) console.log(err);
                me.emit('loginSuccess', docs);
                console.log('有人联入');
            });

*/            
        });

        //监听用户退出
        socket.on('disconnect', function () {
            // 有人退出了群聊
            console.log('有人退出了群聊');
        });

        //监听用户发送弹幕
        socket.on('message', function (obj) {
            
    /*	        
			var me = this;
			var bullet = new Bullet(obj);
			bullet.save(function (err, bull) {
                if (err) console.log(err);
                console.log(bull);
            });
	
	*/        
            socket.emit('messageSuccess', obj);   // 向自己推送
            me.broadcast.emit('message', obj); // 广播给自己以外的所有用户
            console.log('有人发送弹幕了:' + obj.content);
        });

    });

    http.listen(3001, function () {
        console.log('监听端口:3001');
    });
}

module.exports = sock;
