define(function (require, exports, module) {
    "use strict";

    var codeList = {
        "16000": "用户名或密码错误。",
        "16001": "登录超时或非法登录。",
        "16003": "未授权。"
    };

    var unTipCode = {}

    function showTipMsg(data) {
        var code = data.err;
        if (unTipCode[code]) {
            return;
        }
        if (codeList[code]) {
            utilInstall.showToast(codeList[code]);
        } else {
            if (data.msg && data.msg != "") {
                utilInstall.showToast(data.msg);
            } else {
                utilInstall.showToast("请求返回未知错误~");
            }


        }
    }

    var portalApiList = [
        "/portal/portal/systems",
        "/portal/login",
        "/portal/portal/logout"
    ];
    var util = function () {
        var utilObj = {
            isAndroid: (/android/gi).test(navigator.appVersion),
            isIphone: (/iphone/gi).test(navigator.appVersion) || (/ipad/gi).test(navigator.appVersion),
            empRole: null,//店长1，店员2
            // 服务器地址
            serverApiURLTest: 'http://192.168.175.115:8001/api',
            serverApiURL: 'http://192.168.175.103:3000',            //李鑫后台
            serverPortalApiURL: 'http://118.178.225.133:8888',
            //serverApiURL: 'http://192.168.175.122:8094',
            serverUrl: 'http://118.178.225.133:6080/',
            isTestApi: false,
            /**header 中需要的数据变量 */
            AccessToken: "",
            successCode: "0",
            logoutCode: "16001",

            /**store 中需要的数据变量 */
            storeAccessToken: "AccessToken",


            /**
             * 服务器XHR接口
             * @param apiName 接口名
             * @param postData 请求参数
             * @param callback 回调函数
             * @param method 请求方法（默认POST）
             * @param timeout 超时时间（默认30秒）
             */
            ajax: function (funcName, postData, callback, method, timeout) {
                var data = postData;

                if (!method) {
                    method = 'POST';
                }
                var contentType = "";

                if (!postData) {
                    postData = {};
                }

                var url = this.serverApiURL;

                if (!this.isTestApi) {
                    if (method == "POST" && portalApiList.indexOf(funcName) == -1) {
                        data = JSON.stringify(postData);
                        contentType = "application/json; charset=UTF-8";
                    } else {
                        data = $.param(postData);
                        contentType = "application/x-www-form-urlencoded; charset=UTF-8";
                    }
                    url = url + funcName;
                } else {
                    url = this.serverApiURLTest;
                    contentType = "application/x-www-form-urlencoded; charset=UTF-8";
                    data = {method: funcName, param_json: JSON.stringify(postData)}
                }
                console.log("ajax data: " + JSON.stringify(data));
                //alert(ServerRequstURL+funcName);
                console.log("ajax send action：" + url);
                $.ajax(
                    {
                        type: method,
                        async: true,
                        url: url,
                        dataType: 'json',
                        data: data,
                        timeout: 60000,
                        contentType: contentType,
                        // 成功时直接返回数据
                        success: function (data, textStatus, jqXHR) {
                            console.log("ajax send action success：" + url);

                            callback(data);
                        },
                        // 失败时返回默认错误
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log("ajax send action error：" + url);
                            callback({err: -1, msg: "网络请求error"});
                        }
                    });
            },

            /**
             * 月、日、时前补零
             * @param val
             * @returns {string}
             */
            zerofill: function (val) {
                var zerofill = "0" + val;
                return zerofill.substr(-2);
            },
            //格式化CST日期的字串
            formatCSTDate: function (strDate, format) {
                return utilObj.formatDate(new Date(strDate), format);
            },
            //格式化日期,
            formatDate: function (date, format) {
                var paddNum = function (num) {
                    num += "";
                    return num.replace(/^(\d)$/, "0$1");
                }
                //指定格式字符
                var cfg = {
                    yyyy: date.getFullYear() //年 : 4位
                    , yy: date.getFullYear().toString().substring(2)//年 : 2位
                    , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
                    , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
                    , d: date.getDate()   //日 : 如果1位的时候不补0
                    , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
                    , hh: date.getHours()  //时
                    , mm: paddNum(date.getMinutes()) //分
                    , ss: date.getSeconds() //秒
                }
                format || (format = "yyyy-MM-dd hh:mm:ss");
                return format.replace(/([a-z])(\1)*/ig, function (m) {
                    return cfg[m];
                });
            }

        };
        return utilObj;
    };
    var utilInstall = new util();
    return utilInstall;
});
