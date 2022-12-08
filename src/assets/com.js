import $ from "jquery";
// import devUser from '../utils/dummyUser'
import service from './service'

import Ping from 'ping.js'
// import CrYPtoJS from "crypto-js";
let ADDS = {
    isPolice: 0,//是否为公安 (1-公安,0-路内)
    // HTTPS服务
    serv: "https://10.192.34.79/ky203", //本项目接口地址
    servGS: "https://kyd.cd-rail.com/way/ExChange/services/GeneralProServlet",
    // servGS: "https://10.192.34.79/ky203/GeneralProServlet",
    map: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3", //地图服务
    trainLine: "https://10.192.34.79/ky12555/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine", //铁路线服务
    url_34_79: "https://10.192.34.79",//内嵌的第三方iframe---JFLCMS/PTMSAdmin/获取PC访问IP接口

    FileUpload: "https://10.192.6.233:19060/FileUpload/services/UploadFile", //文件上传服务
    // 固定
    weatherUrl: "https://10.192.34.79/ky3450/SOSE/weather/icons/",//天气图片资源
    SSOP: "https://10.192.6.179:8168/SSOP/GeneralProServlet",
};
let servAdd = "http://123.70.204.72:9091/EPAY/GeneralProServlet";
let servHttp = "http://10.192.126.203:9088/admin/kydp/execute";
let servHttps = "https://10.192.126.203/GeneralProServlet"
let servNew = window.location.origin.includes("https") ? servHttps : servHttp; //旧版2
// 组织机构服务器
const orgUrl = "http://10.192.6.156:9090/PTMS/GeneralProServlet";

const base64EncodeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64DecodeChars = new Array(
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
);
//开发环境
if (process.env.NODE_ENV == "development") {
    // servAdd = "http://10.192.6.177:9090/TRDM/GeneralProServlet"; //正式服务器
    // servAdd = "http://10.192.6.110:9090/TRDM/GeneralProServlet"; //测试服务器
    // servAdd = "http://10.192.34.84:9090/TRDM/GeneralProServlet"; //测试服务器
    servAdd = "https://10.192.34.79/TRDM/GeneralProServlet"; //测试服务器
    // servAdd = "http://10.194.72.35:8080/TRDM/GeneralProServlet"; //杨顺测试服务器
    // servAdd = "http://10.192.185.15:9090/TRDM/GeneralProServlet"; //吕测试服务器
    // servAdd = "http://10.192.185.121:9090/TRDM/GeneralProServlet"; //周
    // servAdd = "https://10.192.126.203/GeneralProServlet"
    // origin = "http://10.192.6.175:9090"
    // origin = "https://10.192.34.79"
    origin = "http://10.192.6.110:9090"//110测试服
} else {
    origin = window.location.origin;
    servAdd = origin + "/TRDM/GeneralProServlet"; //正试服
    // servAdd = 'https://10.192.34.79/ky203/GeneralProServlet'
    orgUrl = origin + "/PTMS/GeneralProServlet";
    // ADDS.serv=origin;
    // ADDS.FileUpload=origin+"/FileUpload/services/UploadFile";
    // ADDS.weatherUrl=origin+"/SOSE/weather/icons/";
}
// 公安调用接口入口
if (window.location.pathname.includes("/police.html")) {
    //开发环境
    // 1 用于调试公安大屏
    servAdd = origin + "/TRDM/GeneralProServlet";
    ADDS.serv = origin + "/TRDM"; //本项目接口地址
    ADDS.servGS = origin + "/TRDM/GeneralProServlet";
    ADDS.map = origin + "/ky12555/iserver/services/map-ugcv5-ChinaMap3/rest/maps/ChinaMap3"; //地图服务
    ADDS.trainLine = origin + "/ky12555/iserver/services/map-ugcv5-RoadLine/rest/maps/RoadLine"; //铁路线服务
    ADDS.url_34_79 = origin;//内嵌的第三方iframe---JFLCMS/PTMSAdmin/获取PC访问IP接口
    //公安网
    if (ADDS.isPolice) {
        ADDS.FileUpload = "https://10.192.6.233:19060/FileUpload/services/UploadFile"; //文件上传服务
        // 固定
        ADDS.weatherUrl = "http://10.4.1.52:9090/ky3450/SOSE/weather/icons/";//天气图片资源
        ADDS.SSOP = "http://10.4.1.43/SSOP/GeneralProServlet";
    }
    window.console.log("你已进入公安接口调用", ADDS);
}
// 信息技术所(旧) 19B8C3534E4A5665E0539106C00A58FD
// 信息技术所(新) 99990002001499A50004
// window.console.log("接口地址", servAdd);
var xlientKey = {
    k: "m9X1Dg#d*xl7D",
    e: "xv0ptg6jxdkiyn18",
};

// 日期范围选择快捷配置
const shortcutsRange = [
    {
        text: "最近一周",
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
        },
    },
    {
        text: "最近一个月",
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            picker.$emit("pick", [start, end]);
        },
    },
    {
        text: "最近三个月",
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 3);
            picker.$emit("pick", [start, end]);
        },
    },
    {
        text: "最近半年",
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit("pick", [start, end]);
        },
    },
];

const ifInternetEnv = () => {
    return new Promise((resolve, reject) => {
        // let p = new Ping()
        // p.ping('https://www.baidu.com').then((data) => {
        // 	console.log('外网')
        // 	resolve(data)
        // }).catch((data) => {
        // 	console.log('内网')
        // 	reject(data)
        // })

        reject(false)
    })
}

//验证接口调用是否合法
let checkParam = (pa) => {
    var s = pa.s || [];
    var w = pa.w || [];
    var o = pa.o || [];
    var list = s.concat(w, o);
    var flag = true;
    try {
        checkList(list);
    } catch (error) {

    }
    function checkList(lt) {
        lt.forEach(v => {
            if (typeof (v) == "object" && v !== null) {
                try {
                    checkList(v);
                } catch (error) {

                }
            } else {
                if (v === null || String(v).startsWith("NaN")) {
                    flag = false;
                }
            }
        })
    }
    return flag;
}
// }

export default {
    $,
    ADDS,
    orgUrl,
    origin,
    kydUrl: 'https://10.192.34.79' + "/ky203/GeneralProServlet", //客运段目接口地址
    weatherUrl: origin + "/SOSE/weather/icons/",
    //获取数据

    shortcutsRange,
    getData: (pa, callback) => {
        // 判断外网或内网
        let p = new Ping()
        p.ping('https://www.baidu.com').then((data) => {
            //外网
            window.console.log("外网调用")
            // console.log("----------",JSON.stringify(pa))
            let overPayload = {
                "code": pa.c,
                "sql": pa.s
            }
            let rs = [];
            console.log("overPayload", overPayload)
            service.getData(overPayload, 0).then((res) => {
                console.log("外网调用结果：：：", res);
                rs = res;
                callback && callback(res);
                return rs;
            })
        }).catch((data) => {
            console.log("catch data", data)
            //内网
            window.console.log("内网调用")
            let rs = [];
            if (pa.c) {
                var flag = checkParam(pa);
                if (!flag) {
                    window.console.log('参数中存在NaN打头或者null', pa);
                    return;
                }
                var p = {};
                p.code = pa.c;
                p.login = JSON.stringify(["10.192.111.79", "hhs", "hhs"]);
                p.sql = JSON.stringify(pa.s ? pa.s : []);
                p.where = JSON.stringify(pa.w ? pa.w : []);
                p.order = JSON.stringify(pa.o ? pa.o : []);
                $.ajax({
                    type: pa.type ? pa.type : "post",
                    url: pa.url ? pa.url : servAdd,
                    data: pa.data ? pa.data : p,
                    dataType: pa.dataType ? pa.dataType : "json",
                    async: pa.async === false ? false : true, //默认：false（同步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                    xhrFields: {
                        withCredentials:
                            pa.withCredentials === false ? false : true,
                    },
                    crossDomain: true,
                    success: function (r) {
                        if (r !== "" && r !== "null") {
                            try {
                                r = typeof r == "string" ? JSON.parse(r) : r;
                            } catch (e) {
                                window.console.log("数据解析-" + e);
                            }
                            rs = r;
                            callback && callback(r);
                        } else {
                            window.console.log("数据格式错误-" + pa.a);
                        }
                    },
                    error: function () {
                        window.console.log("服务器无响应-" + pa.a);
                    },
                });
            } else {
                window.console.log("缺少参数‘code’-" + pa.a);
            }
            return rs;
        })

    },

    //根据外网或内网调用getData
    getDataNet: (pa, callback) => {
        let p = new Ping()
        p.ping('https://www.baidu.com').then((data) => {
            //外网
            window.console.log("外网调用")
            getData(pa, callback).then((r) => {
                window.console.log("内网调用成功")
            })
        }).catch((data) => {
            //内网
            window.console.log("内网调用")
            getData(pa, callback).then((r) => {
                window.console.log("内网调用成功")
            })
        })
    },

    //同步
    getDataSync(pa) {
        let rs = [];
        if (pa.c) {
            var p = {};
            p.code = pa.c;
            p.login = JSON.stringify(["10.192.111.79", "hhs", "hhs"]);
            p.sql = JSON.stringify(pa.s ? pa.s : []);
            p.where = JSON.stringify(pa.w ? pa.w : []);
            p.order = JSON.stringify(pa.o ? pa.o : []);
            $.ajax({
                type: pa.type ? pa.type : "post",
                url: pa.url ? pa.url : servAdd,
                data: pa.data ? pa.data : p,
                dataType: pa.dataType ? pa.dataType : "json",
                async: false, //异步的:默认：true（异步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                xhrFields: {
                    withCredentials: true,
                },
                crossDomain: true,
                success: function (r) {
                    if (r !== "" && r !== "null") {
                        try {
                            r = typeof r == "string" ? JSON.parse(r) : r;
                        } catch (e) {
                            window.console.log("数据解析-" + e);
                        }
                        rs = r;
                    } else {
                        window.console.log("数据格式错误-" + pa.a);
                    }
                },
                error: function () {
                    window.console.log("服务器无响应-" + pa.a);
                },
            });
        } else {
            window.console.log("缺少参数‘code’-" + pa.a);
        }
        return rs;
    },
    getDataNew: (pa, callback) => {
        let rs = [];
        if (pa.c) {
            var flag = checkParam(pa);
            if (!flag) {
                window.console.log('参数中存在NaN打头或者null', pa);
                return;
            }
            var p = {};
            p.code = pa.c;
            p.sql = JSON.stringify(pa.s ? pa.s : []);
            p.where = JSON.stringify(pa.w ? pa.w : []);
            p.order = JSON.stringify(pa.o ? pa.o : []);
            $.ajax({
                type: pa.type ? pa.type : "post",
                // url: pa.url ? pa.url : servNew + pa.m,
                url: pa.url ? pa.url : servNew,
                data: pa.data ? pa.data : JSON.stringify(p),
                dataType: pa.dataType ? pa.dataType : "json",
                async: pa.async === false ? false : true, //默认：false（同步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                xhrFields: {
                    withCredentials:
                        pa.withCredentials === false ? false : true,
                },
                contentType: "application/json;charset=UTF-8",
                crossDomain: true,
                success: function (r) {
                    if (r !== "" && r !== "null") {
                        try {
                            r = typeof r == "string" ? JSON.parse(r) : r;
                        } catch (e) {
                            window.console.log("数据解析-" + e);
                        }
                        if (r.success) {
                            rs = r.data;
                            callback && callback(r.data);
                        }
                    } else {
                        window.console.log("数据格式错误-" + pa.a);
                    }
                },
                error: function () {
                    window.console.log("服务器无响应-" + pa.a);
                },
            });
        } else {
            window.console.log("缺少参数‘code’-" + pa.a);
        }
        return rs;
    },
    getDataBS: (pa, callback) => {
        let rs = [];
        if (pa.c) {
            var p = {};
            p.code = pa.c;
            p.login = JSON.stringify(["10.192.111.79", "hhs", "hhs"]);
            p.sql = JSON.stringify(pa.s ? pa.s : []);
            p.where = JSON.stringify(pa.w ? pa.w : []);
            p.order = JSON.stringify(pa.o ? pa.o : []);
            $.ajax({
                type: pa.type ? pa.type : "post",
                url: pa.url ? pa.url : servAdd,
                data: pa.data ? pa.data : p,
                dataType: pa.dataType ? pa.dataType : 'json',
                async: pa.async === false ? false : true, //默认：false（同步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (r) {
                    if (r !== "" && r !== "null") {
                        try {
                            r = typeof (r) == "string" ? JSON.parse(r) : r;
                        } catch (e) {
                            window.console.log("数据解析-" + e);
                        }
                        rs = r;
                        callback && callback(r);
                    } else {
                        window.console.log("数据格式错误-" + pa.a);
                    }
                },
                error: function () {
                    window.console.log("服务器无响应-" + pa.a);
                }
            });
        } else {
            window.console.log("缺少参数‘code’-" + pa.a);
        }
        return rs;
    },

    //接口加密调用
    // asyncDataKEY(pa, callBackFn) {
    //     var rs = {
    //         flag: false,
    //         data: "",
    //     };
    //     if (pa.code) {
    //         var type = pa.type ? pa.type : "post";
    //         var params = {};
    //         params.code = pa.code;
    //         params.login = JSON.stringify(["10.192.111.79", "hhs", "hhs"]);
    //         params.sql = JSON.stringify(pa.sql ? pa.sql : []);
    //         params.where = JSON.stringify(pa.where ? pa.where : []);
    //         params.order = JSON.stringify(pa.order ? pa.order : []);
    //
    //         var url = pa.url ? pa.url : "/SSOP/SecurityPost";
    //         // 参数加密传输
    //         const key = CrYPtoJS.enc.Utf8.parse(xlientKey.e);
    //         const options = {
    //             mode: CrYPtoJS.mode.ECB,
    //             padding: CrYPtoJS.pad.Pkcs7,
    //         };
    //         params.code = CrYPtoJS.AES.encrypt(
    //             CrYPtoJS.enc.Utf8.parse(params.code),
    //             key,
    //             options
    //         ).toString();
    //         params.login = CrYPtoJS.AES.encrypt(
    //             CrYPtoJS.enc.Utf8.parse(params.login),
    //             key,
    //             options
    //         ).toString();
    //         params.sql = CrYPtoJS.AES.encrypt(
    //             CrYPtoJS.enc.Utf8.parse(params.sql),
    //             key,
    //             options
    //         ).toString();
    //         params.where = CrYPtoJS.AES.encrypt(
    //             CrYPtoJS.enc.Utf8.parse(params.where),
    //             key,
    //             options
    //         ).toString();
    //         params.order = CrYPtoJS.AES.encrypt(
    //             CrYPtoJS.enc.Utf8.parse(params.order),
    //             key,
    //             options
    //         ).toString();
    //         // 2.参数签名
    //         params.timestamp = this.getCurrentZoneTime() + "";
    //         // 开始签名
    //         var paramEncodeStr = this.concatParamStr(params);
    //         params.sgr = this.signatureParam(
    //             paramEncodeStr,
    //             "url",
    //             type,
    //             params.timestamp
    //         );
    //
    //         $.ajax({
    //             type: type,
    //             url: url, //
    //             data: pa.data ? pa.data : params,
    //             timeout: 30000,
    //             async: pa.async ? pa.async : false, // 默认：false-同步
    //             success: function (r) {
    //                 if (r != "" && r != "null") {
    //                     rs = {
    //                         flag: true,
    //                         data: r,
    //                     };
    //                     callBackFn && callBackFn(r);
    //                     if (pa.callback) {
    //                         try {
    //                             if (pa.callbackParam) {
    //                                 eval(pa.callback + "(r,pa.callbackParam)");
    //                             } else {
    //                                 eval(pa.callback + "(r)");
    //                             }
    //                         } catch (e) {
    //                             // alert("callback参数有误-" + pa.author);
    //                         }
    //                     }
    //                 } else {
    //                     window.console.log("数据格式错误-" + pa.author);
    //                 }
    //             },
    //             error: function () {
    //                 window.console.log("调用接口错误-" + pa.author);
    //             },
    //             complete: function (XMLHttpRequest, status) {
    //                 if (status === "timeout") {
    //                     window.console.log("接口超时-" + pa.author);
    //                 }
    //             },
    //         });
    //     } else {
    //         alert("缺少参数‘code’-" + pa.author);
    //     }
    //     if (typeof pa.async == "undefined" || !pa.async) {
    //         // 异步调用，将结果返回
    //         return rs;
    //     }
    // },
    //获取数据
    getDataP123: (pa, callback) => {
        pa.a = pa.a ? pa.a : "";
        if (pa.c) {
            var p = {
                code: pa.c,
                sql: JSON.stringify(pa.s ? pa.s : []),
                where: JSON.stringify(pa.w ? pa.w : []),
                order: JSON.stringify(pa.o ? pa.o : []),
            };
            var opts = {
                type: pa.type ? pa.type : "post",
                contentType: "application/json",
                url: pa.url ? pa.url : servAdd,
                data: pa.data ? pa.data : JSON.stringify(p),
                dataType: pa.dataType ? pa.dataType : "json",
                timeout: 30000,
                async: (pa.async ? pa.async : false) || true, //异步的:默认：true（异步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                success: (r) => {
                    try {
                        r = typeof r === "string" ? JSON.parse(r) : r;
                        // 其它所有接口
                        if (r.success === true) {
                            callback && callback(r.data);
                        } else {
                            callback && callback(false);
                        }
                    } catch (e) {
                        callback && callback(false);
                        console.log(e);
                    }
                },
                error: function () {
                    callback && callback(false);
                },
                complete: (XMLHttpRequest, status) => {
                    if (status === "timeout") {
                    }
                },
            };
            if (pa.c !== "CTTS_LOGIN") {
            }
            $.ajax(opts);
        } else {
            callback && callback(false);
            ElementUI.Message({
                message: "缺少参数‘code’" + pa.a,
                type: "error",
            });
        }
    },
    //获取地址栏参数(默认不解码)
    getUrlParam(isJM) {
        if (process.env.NODE_ENV === 'development') {
            // 开发环境下返回测试用户
            return devUser
        } else {
            // 从SSOA登录
            var rs = {};
            var txt = window.location.hash.split("?")[1]; // 参数
            if (isJM) {
                //需要解码
                txt = this.base64decode(txt);
            }
            if (txt && txt !== "") {
                rs.fullPath = txt;
                var sarr = txt.split("&");
                $.each(sarr, function (i, v) {
                    // decodeURIComponent()[谷歌]、unescape()[IE]
                    var t = v.split("=");
                    rs[t[0]] = decodeURI(t[1]);
                });
                return rs;
            } else {
                return false;
            }
        }
    },
    //生成UUID
    getUuid() {
        var s = [];
        var hexDigits = "0123456789ABCDEF";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        var uuid = s.join("");
        return uuid;
    },
    //克隆对象
    cloneObj(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    /**日期格式化函数
     * @param {Object} _date [空] [日期字符串] [日期]
     * @param {Object} fmt [空] [格式字符串]
     */
    formatDate(_date, fmt) {
        //
        if (_date === "" || _date === null || typeof _date === "undefined") {
            _date = new Date();
        } else if (typeof _date === "string") {
            _date = new Date(_date);
        }
        fmt = fmt || "yyyy-MM-dd hh:mm:ss";
        var o = {
            "M+": _date.getMonth() + 1, // 月份
            "d+": _date.getDate(), // 日
            "h+": _date.getHours(), // 小时
            "m+": _date.getMinutes(), // 分
            "s+": _date.getSeconds(), // 秒
            "q+": Math.floor((_date.getMonth() + 3) / 3), // 季度
            S: _date.getMilliseconds(),
            // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (_date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
        return fmt;
    },
    /** 将一维对象数组(id,pid格式)转为树形数据
     * @param {Object} d	一维对象数组
     * @param {Object} idKey	数据唯一字段key
     * @param {Object} pidKey	数据父级字段key
     * @param {Object} codeKey	树节点可用数据字段
     * @param {Object} replaceText	树节点替换文本
     */
    convertTreeData(d, idKey, pidKey, codeKey, replaceText) {
        idKey = idKey ? idKey : "ID";
        pidKey = pidKey ? pidKey : "PID";
        let rs = [];
        for (let i = 0; i < d.length; i++) {
            d[i].id = d[i][idKey];
            d[i].label = d[i].TEXT;
            d[i].code = d[i][codeKey]; //单位id 或 部门id
            replaceText
                ? (d[i].label = d[i].label.replace(replaceText, ""))
                : null;
            let mark = false;
            for (let j = 0; j < d.length; j++) {
                if (d[i][pidKey] !== null && d[i][pidKey] === d[j][idKey]) {
                    mark = true;
                    if (typeof d[j].children === "undefined")
                        d[j].children = [d[i]];
                    else d[j].children.push(d[i]);
                    break;
                }
            }
            if (!mark) {
                rs.push(d[i]);
            }
        }
        return rs;
    },

    /**
     * 以某个字段为key进行分组
     * @param {Object} data 数据源
     * @param {Object} _key 分组字段名
     */
    creatJsonArrByKey(data, _key) {
        let { rs, jsonKey, jsonIndex } = {
            rs: [],
            jsonKey: {},
            jsonIndex: 0,
        };
        data.forEach((item) => {
            const cloneObj = this.cloneObj(item);
            if (typeof jsonKey[item[_key]] === "undefined") {
                const cloneObjChild = this.cloneObj(item);
                cloneObj.children = [cloneObjChild];
                rs.push(cloneObj);
                jsonKey[item[_key]] = jsonIndex++;
            } else {
                rs[jsonKey[item[_key]]].children.push(cloneObj);
            }
        });
        return rs;
    },

    //在一个日期上加时间
    getDateTimeSub(curDate, formatStr, hours) {
        curDate.setHours(curDate.getHours() + hours);
        formatStr = formatStr.replace("yyyy", curDate.getFullYear());
        formatStr = formatStr.replace(
            "MM",
            curDate.getMonth() + 1 > 9
                ? curDate.getMonth() + 1
                : "0" + (curDate.getMonth() + 1)
        );
        formatStr = formatStr.replace(
            "dd",
            curDate.getDate() > 9 ? curDate.getDate() : "0" + curDate.getDate()
        );
        formatStr = formatStr.replace(
            "hh",
            curDate.getHours() > 9
                ? curDate.getHours()
                : "0" + curDate.getHours()
        );
        formatStr = formatStr.replace(
            "mm",
            curDate.getMinutes() > 9
                ? curDate.getMinutes()
                : "0" + curDate.getMinutes()
        );
        formatStr = formatStr.replace(
            "ss",
            curDate.getSeconds() > 9
                ? curDate.getSeconds()
                : "0" + curDate.getSeconds()
        );
        formatStr = formatStr.replace("SSS", curDate.getMilliseconds());
        return formatStr;
    },
    //加密的方法（base64）
    encodeUrlParam($url) {
        var tmp = $url.split("?");
        if (tmp.length > 1) {
            return tmp[0] + "?" + this.base64encode(encodeURI(tmp[1]));
        } else {
            return tmp[0];
        }
    },
    // 格式化车次输入
    parseTrainCode(v) {
        // 除第1位可以为字母,则之后不能再出现字母
        // 若第1位=0,后面只能有一个字母且紧靠0
        // 只能包含数字 字母 斜杠/
        v = v.replace(/[^\d\a-z\A-Z]\//g, "").toUpperCase();
        if (v.length >= 2) {
            let first = v.substring(0, 1); //第1位
            let second = v.substring(1, 2); //第2位
            let other = "";
            // 第1位不能是/
            if (first === "/") {
                first = "";
            }
            if (first !== "0" && first !== "D") {
                // 第1位非0和D,则第2位只能为数字
                second = second.replace(/[\a-z\A-Z]/g, "");
            }
            if (v.length >= 3) {
                other = v.substring(2).replace(/[\a-z\A-Z]/g, ""); //其它
            }
            v = first + second + other;
        }
        return v;
    },
    base64encode(str) {
        let out, i, len;
        let c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(
                    ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
                );
                out += base64EncodeChars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(
                ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
            );
            out += base64EncodeChars.charAt(
                ((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)
            );
            out += base64EncodeChars.charAt(c3 & 0x3f);
        }
        return out;
    },
    base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;

            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;

            out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    },
    getCurrentZoneTime() {
        //1.【失败】通过offset获取中国时间
        // var timezone = 8;
        // var offset_GMT = new Date().getTimezoneOffset();//本地时间和格林威治时间差，单位分钟
        // var nowDate = new Date().getTime();//本地时间距离1970年1月1日毫秒数
        // var targetDate = new Date(nowDate + offset_GMT*60*1000 +
        // timezone*60*60*1000); //当前东八区时间
        // var current = targetDate.getTime(); //当前时区时间戳
        // return current;

        //2.【失败，不支持火狐浏览器】获取计算机当前时间的格式化
        //	var currentDateString = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
        //	var currentDateCnString = currentDateString + " GMT+0800";//将当前时间表强制转换为中国时间
        //	var currentTimeStamp = (new Date(currentDateCnString)).getTime();
        //	return currentTimeStamp;

        //3.【失败，不支持部分谷歌浏览器】获取计算机当前时间的格式化
        //	var currentDateString = (new Date()).Format("yyyy/MM/dd hh:mm:ss");
        //	var currentDateCnString = currentDateString + " GMT+0800";//将当前时间表强制转换为中国时间
        //	var currentTimeStamp = (new Date(currentDateCnString)).getTime();
        //	return currentTimeStamp;

        //4.最终后台屏蔽时间戳验证策略，这个时间戳因为要参与签名，还是需要的
        return new Date().getTime();
    },
    concatParamStr(params) {
        var keys = [
            "code",
            "en",
            "login",
            "sql",
            "where",
            "order",
            "timestamp",
        ];
        var paramArr = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            paramArr.push(key + "=" + params[key]);
        }
        var paramStr = paramArr.join("&");
        var paramEncodeStr = encodeURIComponent(paramStr);
        return paramEncodeStr;
    },
    // signatureParam(paramEncodeStr, url, type, timestamp) {
    //     var urlEncodeStr = encodeURIComponent(url);
    //     var signatureStrBefore =
    //         type + "&" + urlEncodeStr + "&" + paramEncodeStr;
    //     var secretKey = xlientKey.k + timestamp.substr(-3);
    //     const signatureStrSHA = CrYPtoJS.HmacSHA1(
    //         signatureStrBefore,
    //         secretKey
    //     ).toString();
    //     const signatureStrBase64 = this.base64encodeStr(signatureStrSHA);
    //     // console.log("signatureStrBefore,", signatureStrBefore);
    //     // console.log("signatureStrSHA:", signatureStrSHA);
    //     // console.log("signatureStrBase64:", signatureStrBase64)
    //     return signatureStrBase64;
    // },
    base64encodeStr(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(
                    ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
                );
                out += base64EncodeChars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(
                ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
            );
            out += base64EncodeChars.charAt(
                ((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)
            );
            out += base64EncodeChars.charAt(c3 & 0x3f);
        }
        return out;
    },
    /** elementUI 表格跨行计算方法
     * @param {Object} data 源数据 一维对象数组
     * @param {Object} keys 一维数组 ["key1","key2,key3"]
     * 返回数据中带spans_key1_key2_key3_.....跨行数据格式
     */
    convertTableSpan(data, keys) {
        let tempLastIndex = {};
        let tempKeys = keys.map((k) => {
            const mk = k.replace(/,/g, "_");
            tempLastIndex[mk] = 0;
            return {
                keyStr: mk,
                keyArr: k.split(","),
            };
        });
        data.forEach((item, index) => {
            tempKeys.forEach((keyObj) => {
                // 将待计算跨行的数据加上默认跨行对象
                if (typeof item["spans_" + keyObj.keyStr] === "undefined") {
                    item["spans_" + keyObj.keyStr] = {
                        rowspan: 1,
                        colspan: 1,
                    };
                }
                const preCompareStr = keyObj.keyArr
                    .map((k) => data[tempLastIndex[keyObj.keyStr]][k])
                    .join(""); //上一条比较字段
                const curCompareStr = keyObj.keyArr
                    .map((k) => item[k])
                    .join(""); //当前比较字段
                const nexCompareStr = data[index + 1]
                    ? keyObj.keyArr.map((k) => data[index + 1][k]).join("")
                    : null; //下一条比较字段
                // 比较字段有变化
                if (preCompareStr !== curCompareStr) {
                    tempLastIndex[keyObj.keyStr] = index;
                }

                // 下一条数据车次未改变，则合并+1
                if (curCompareStr === nexCompareStr) {
                    data[tempLastIndex[keyObj.keyStr]]["spans_" + keyObj.keyStr]
                        .rowspan++;
                    data[index + 1]["spans_" + keyObj.keyStr] = {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            });
        });
        return data;
    },
    //setIntervalItem(func,1000).start(); 代替setinterval
    setIntervalItem(f, time) {
        let startFlag = true,
            sto = null;
        const startSTO = () => {
            sto = setTimeout(() => {
                f();
                clearTimeout(sto);
                if (startFlag) {
                    startSTO();
                }
            }, time);
        };
        const stopSTO = () => {
            startFlag = false;
            clearTimeout(sto);
        };
        return { start: startSTO, stop: stopSTO };
    },
    //animationItem(func).start(); 代替setinterval 刷新频率为显示器刷新频率
    animationItem(f) {
        let startFlag = true,
            sto = null;
        const startSTO = () => {
            sto = requestAnimationFrame(() => {
                f();
                cancelAnimationFrame(sto);
                if (startFlag) {
                    startSTO();
                }
            });
        };
        const stopSTO = () => {
            startFlag = false;
            cancelAnimationFrame(sto);
        };
        return { start: startSTO, stop: stopSTO };
    },

    //同步
    getDataSync(pa) {
        let rs = [];
        if (pa.c) {
            var p = {};
            p.code = pa.c;
            p.login = JSON.stringify(["10.192.111.79", "hhs", "hhs"]);
            p.sql = JSON.stringify(pa.s ? pa.s : []);
            p.where = JSON.stringify(pa.w ? pa.w : []);
            p.order = JSON.stringify(pa.o ? pa.o : []);
            p.auther = pa.a;
            $.ajax({
                type: pa.type ? pa.type : "post",
                url: pa.url ? pa.url : servAdd,
                data: pa.data ? pa.data : p,
                dataType: pa.dataType ? pa.dataType : 'json',
                async: false, //异步的:默认：true（异步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (r) {
                    if (r !== "" && r !== "null") {
                        try {
                            r = typeof (r) == "string" ? JSON.parse(r) : r;
                        } catch (e) {
                            window.console.log("数据解析-" + e);
                        }
                        rs = r;
                    } else {
                        window.console.log("数据格式错误-" + pa.a);
                    }
                },
                error: function () {
                    window.console.log("服务器无响应-" + pa.a);
                }
            });
        } else {
            window.console.log("缺少参数‘code’-" + pa.a);
        }
        return rs;
    },
    //接口加密调用
    asyncDataKEY(pa, callBackFn) {
        var rs = {
            flag: false,
            data: ""
        };
        if (pa.code) {
            var type = pa.type ? pa.type : "post";
            var params = {};
            params.code = pa.code;
            params.login = JSON.stringify(["10.192.111.79", "hhs", "hhs"]);
            params.sql = JSON.stringify(pa.sql ? pa.sql : []);
            params.where = JSON.stringify(pa.where ? pa.where : []);
            params.order = JSON.stringify(pa.order ? pa.order : []);
            params.auther = pa.a;

            var url = pa.url ? pa.url : "/SSOP/SecurityPost";
            // 参数加密传输
            const key = CrYPtoJS.enc.Utf8.parse(xlientKey.e);
            const options = {
                mode: CrYPtoJS.mode.ECB,
                padding: CrYPtoJS.pad.Pkcs7
            };
            params.code = CrYPtoJS.AES.encrypt(CrYPtoJS.enc.Utf8.parse(params.code), key, options).toString();
            params.login = CrYPtoJS.AES.encrypt(CrYPtoJS.enc.Utf8.parse(params.login), key, options).toString();
            params.sql = CrYPtoJS.AES.encrypt(CrYPtoJS.enc.Utf8.parse(params.sql), key, options).toString();
            params.where = CrYPtoJS.AES.encrypt(CrYPtoJS.enc.Utf8.parse(params.where), key, options).toString();
            params.order = CrYPtoJS.AES.encrypt(CrYPtoJS.enc.Utf8.parse(params.order), key, options).toString();
            // 2.参数签名
            params.timestamp = this.getCurrentZoneTime() + "";
            // 开始签名
            var paramEncodeStr = this.concatParamStr(params);
            params.sgr = this.signatureParam(paramEncodeStr, "url", type, params.timestamp);

            $.ajax({
                type: type,
                url: url, //
                data: pa.data ? pa.data : params,
                timeout: 30000,
                async: pa.async ? pa.async : false, // 默认：false-同步
                success: function (r) {
                    if (r != "" && r != "null") {
                        rs = {
                            flag: true,
                            data: r
                        };
                        callBackFn && callBackFn(r);
                        if (pa.callback) {
                            try {
                                if (pa.callbackParam) {
                                    eval(pa.callback + "(r,pa.callbackParam)");
                                } else {
                                    eval(pa.callback + "(r)");
                                }
                            } catch (e) {
                                // alert("callback参数有误-" + pa.author);
                            }
                        }
                    } else {
                        window.console.log("数据格式错误-" + pa.author);
                    }
                },
                error: function () {
                    window.console.log("调用接口错误-" + pa.author);
                },
                complete: function (XMLHttpRequest, status) {
                    if (status === "timeout") {
                        window.console.log("接口超时-" + pa.author);
                    }
                }
            });
        } else {
            alert("缺少参数‘code’-" + pa.author);
        }
        if (typeof (pa.async) == "undefined" || !pa.async) { // 异步调用，将结果返回
            return rs;
        }
    },
    //获取数据
    getDataP123: (pa, callback) => {
        pa.a = pa.a ? pa.a : "";
        if (pa.c) {
            var p = {
                "code": pa.c,
                "sql": JSON.stringify(pa.s ? pa.s : []),
                "where": JSON.stringify(pa.w ? pa.w : []),
                "order": JSON.stringify(pa.o ? pa.o : []),
                auther: pa.a
            };
            console.log(p.code)
            var opts = {
                type: pa.type ? pa.type : "post",
                contentType: "application/json",
                url: pa.url ? pa.url : servAdd,
                data: pa.data ? pa.data : JSON.stringify(p),
                dataType: pa.dataType ? pa.dataType : 'json',
                timeout: 30000,
                async: (pa.async ? pa.async : false) || true, //异步的:默认：true（异步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                success: (r) => {
                    r = typeof (r) === "string" ? JSON.parse(r) : r;
                    // 其它所有接口
                    if (typeof (r.success) === "undefined") {
                        callback && callback(r);
                    } else if (r.success === true) {
                        callback && callback(r.data);
                    } else {
                        callback && callback(false);
                    }
                },
                error: function () {
                    callback && callback(false);
                },
                complete: (XMLHttpRequest, status) => {
                    if (status === "timeout") { }
                }
            };
            if (pa.c !== "CTTS_LOGIN") { }

            // $.ajax(opts);

            ifInternetEnv().then(() => {
                internetCom.getData(p).then((r) => {
                    r = typeof (r) === "string" ? JSON.parse(r) : r;
                    // 其它所有接口
                    if (typeof (r.success) === "undefined") {
                        callback && callback(r);
                    } else if (r.success === true) {
                        callback && callback(r.data);
                    } else {
                        callback && callback(false);
                    }
                }).catch((e) => {
                    callback && callback(false)
                })
            }).catch(() => {
                $.ajax(opts);
            })
        } else {
            callback && callback(false);
            ElementUI.Message({
                message: "缺少参数‘code’" + pa.a,
                type: "error"
            });
        }
    },
    //获取数据
    getDataP123WithNoStringify: (pa, callback) => {
        pa.a = pa.a ? pa.a : "";
        if (pa.c) {
            var p = {
                "code": pa.c,
                "sql": JSON.stringify(pa.s ? pa.s : []),
                "where": pa.w,
                "order": pa.o,
                auther: pa.a
            };
            var opts = {
                type: pa.type ? pa.type : "post",
                contentType: "application/json",
                url: pa.url ? pa.url : servAdd,
                data: pa.data ? pa.data : JSON.stringify(p),
                dataType: pa.dataType ? pa.dataType : 'json',
                timeout: 30000,
                async: (pa.async ? pa.async : false) || true, //异步的:默认：true（异步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                success: (r) => {
                    r = typeof (r) === "string" ? JSON.parse(r) : r;
                    // 其它所有接口
                    if (typeof (r.success) === "undefined") {
                        callback && callback(r);
                    } else if (r.success === true) {
                        callback && callback(r.data);
                    } else {
                        callback && callback(false);
                    }
                },
                error: function () {
                    callback && callback(false);
                },
                complete: (XMLHttpRequest, status) => {
                    if (status === "timeout") { }
                }
            };
            if (pa.c !== "CTTS_LOGIN") { }
            $.ajax(opts);
        } else {
            callback && callback(false);
            ElementUI.Message({
                message: "缺少参数‘code’" + pa.a,
                type: "error"
            });
        }
    },
    //获取地址栏参数(默认不解码)
    getUrlParam(isJM) {
        var rs = {};
        var txt = window.location.hash.split("?")[1]; // 参数
        if (isJM) { //需要解码
            txt = this.base64decode(txt);
        }
        if (txt && txt !== "") {
            rs.fullPath = txt;
            var sarr = txt.split("&");
            $.each(sarr, function (i, v) { // decodeURIComponent()[谷歌]、unescape()[IE]
                var t = v.split("=");
                rs[t[0]] = decodeURI(t[1]);
            });
            return rs;
        } else {
            return false;
        }
    },
    //生成UUID
    getUuid() {
        var s = [];
        var hexDigits = "0123456789ABCDEF";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        var uuid = s.join("");
        return uuid;
    },
    //克隆对象
    cloneObj(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    /**日期格式化函数
     * @param {Object} _date [空] [日期字符串] [日期]
     * @param {Object} fmt [空] [格式字符串]
     */
    formatDate(_date, fmt) { //
        if (_date === '' || _date === null || typeof (_date) === "undefined") {
            _date = new Date();
        } else if (typeof (_date) === "string") {
            _date = new Date(_date);
        }
        fmt = fmt || "yyyy-MM-dd hh:mm:ss";
        var o = {
            "M+": _date.getMonth() + 1, // 月份
            "d+": _date.getDate(), // 日
            "h+": _date.getHours(), // 小时
            "m+": _date.getMinutes(), // 分
            "s+": _date.getSeconds(), // 秒
            "q+": Math.floor((_date.getMonth() + 3) / 3), // 季度
            "S": _date.getMilliseconds()
            // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) :
                    (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    /** 将一维对象数组(id,pid格式)转为树形数据
     * @param {Object} d	一维对象数组
     * @param {Object} idKey	数据唯一字段key
     * @param {Object} pidKey	数据父级字段key
     * @param {Object} codeKey	树节点可用数据字段
     * @param {Object} replaceText	树节点替换文本
     */
    convertTreeData(d, idKey, pidKey, codeKey, replaceText) {
        idKey = idKey ? idKey : "ID";
        pidKey = pidKey ? pidKey : "PID";
        let rs = [];
        for (let i = 0; i < d.length; i++) {
            d[i].id = d[i][idKey];
            d[i].label = d[i].TEXT;
            d[i].code = d[i][codeKey]; //单位id 或 部门id
            replaceText ? d[i].label = d[i].label.replace(replaceText, "") : null;
            let mark = false;
            for (let j = 0; j < d.length; j++) {
                if (d[i][pidKey] !== null && d[i][pidKey] === d[j][idKey]) {
                    mark = true;
                    if (typeof (d[j].children) === "undefined")
                        d[j].children = [d[i]];
                    else d[j].children.push(d[i]);
                    break;
                }
            }
            if (!mark) {
                rs.push(d[i]);
            }
        }
        return rs;
    },

    /**
     * 以某个字段为key进行分组
     * @param {Object} data 数据源
     * @param {Object} _key 分组字段名
     */
    creatJsonArrByKey(data, _key) {
        let {
            rs,
            jsonKey,
            jsonIndex
        } = {
            rs: [],
            jsonKey: {},
            jsonIndex: 0
        };
        data.forEach(item => {
            const cloneObj = this.cloneObj(item);
            if (typeof (jsonKey[item[_key]]) === "undefined") {
                const cloneObjChild = this.cloneObj(item);
                cloneObj.children = [cloneObjChild];
                rs.push(cloneObj);
                jsonKey[item[_key]] = jsonIndex++;
            } else {
                rs[jsonKey[item[_key]]].children.push(cloneObj);
            }
        });
        return rs;
    },

    //在一个日期上加时间
    getDateTimeSub(curDate, formatStr, hours) {
        curDate.setHours(curDate.getHours() + hours);
        formatStr = formatStr.replace("yyyy", curDate.getFullYear());
        formatStr = formatStr.replace('MM', (curDate.getMonth() + 1) > 9 ? (curDate.getMonth() + 1) : '0' + (curDate.getMonth() +
            1));
        formatStr = formatStr.replace('dd', curDate.getDate() > 9 ? curDate.getDate() : '0' + curDate.getDate());
        formatStr = formatStr.replace('hh', curDate.getHours() > 9 ? curDate.getHours() : '0' + curDate.getHours());
        formatStr = formatStr.replace("mm", curDate.getMinutes() > 9 ? curDate.getMinutes() : '0' + curDate.getMinutes());
        formatStr = formatStr.replace("ss", curDate.getSeconds() > 9 ? curDate.getSeconds() : '0' + curDate.getSeconds());
        formatStr = formatStr.replace("SSS", curDate.getMilliseconds());
        return formatStr;
    },
    //加密的方法（base64）
    encodeUrlParam($url) {
        var tmp = $url.split('?');
        if (tmp.length > 1) {
            return tmp[0] + '?' + this.base64encode(encodeURI(tmp[1]));
        } else {
            return tmp[0];
        }
    },
    // 格式化车次输入
    parseTrainCode(v) {
        // 除第1位可以为字母,则之后不能再出现字母
        // 若第1位=0,后面只能有一个字母且紧靠0
        // 只能包含数字 字母 斜杠/
        v = v.replace(/[^\d\a-z\A-Z\/]/g, "").toUpperCase();
        v = v.replace(/\/+/g, "/");
        if (v.length > 0) {
            let first = v.substring(0, 1); //第1位
            if (v.length === 1 && first === "/") {
                v = "";
            }
            if (v.length >= 2) {
                let second = v.substring(1, 2); //第2位
                let other = "";
                // 第1位不能是/
                if (first === "/") {
                    first = "";
                }
                if (first !== "0" && first !== "D") {
                    // 第1位非0和D,则第2位只能为数字
                    second = second.replace(/[\a-z\A-Z]/g, "");
                }
                if (v.length >= 3) {
                    other = v.substring(2).replace(/[\a-z\A-Z]/g, ""); //其它
                }
                v = first + second + other;
            }
        }
        return v;
    },
    /**
     * crypto-js 加/解密
     * @param {Object} str 字符串
     * @param {Object} jiemi 是否解密
     */
    securityStr(str, jiemi) {
        const key = CryptoJS.enc.Utf8.parse(xlientKey.e);
        const options = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
        //解密
        if (jiemi) {
            var rsTxt = str;
            try {
                // 有汉字，则为原始文本
                if (/[\u4e00-\u9fa5]/.test(str)) {

                } else {
                    //加密后的文本
                    str = str.replace(/ /g, "+");
                    var tempTxt = CryptoJS.AES.decrypt(str, key, options).toString(CryptoJS.enc.Utf8);
                    if (tempTxt !== "") {
                        rsTxt = tempTxt;
                    }
                }
            } catch (e) { }
            return rsTxt;
        } else {
            return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(str), key, options).toString();
        }
    },
    base64encodeOut(str) {
        return this.base64encode(str);
    },
    base64encode(str) {
        let out, i, len;
        let c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },
    base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;

            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;

            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    },
    getCurrentZoneTime() {
        //1.【失败】通过offset获取中国时间
        // var timezone = 8;
        // var offset_GMT = new Date().getTimezoneOffset();//本地时间和格林威治时间差，单位分钟
        // var nowDate = new Date().getTime();//本地时间距离1970年1月1日毫秒数
        // var targetDate = new Date(nowDate + offset_GMT*60*1000 +
        // timezone*60*60*1000); //当前东八区时间
        // var current = targetDate.getTime(); //当前时区时间戳
        // return current;

        //2.【失败，不支持火狐浏览器】获取计算机当前时间的格式化
        //	var currentDateString = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
        //	var currentDateCnString = currentDateString + " GMT+0800";//将当前时间表强制转换为中国时间
        //	var currentTimeStamp = (new Date(currentDateCnString)).getTime();
        //	return currentTimeStamp;

        //3.【失败，不支持部分谷歌浏览器】获取计算机当前时间的格式化
        //	var currentDateString = (new Date()).Format("yyyy/MM/dd hh:mm:ss");
        //	var currentDateCnString = currentDateString + " GMT+0800";//将当前时间表强制转换为中国时间
        //	var currentTimeStamp = (new Date(currentDateCnString)).getTime();
        //	return currentTimeStamp;

        //4.最终后台屏蔽时间戳验证策略，这个时间戳因为要参与签名，还是需要的
        return new Date().getTime();
    },
    concatParamStr(params) {
        var keys = ["code", "en", "login", "sql", "where", "order", "timestamp"];
        var paramArr = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            paramArr.push(key + "=" + params[key]);
        }
        var paramStr = paramArr.join("&");
        var paramEncodeStr = encodeURIComponent(paramStr);
        return paramEncodeStr;
    },
    signatureParam(paramEncodeStr, url, type, timestamp) {
        var urlEncodeStr = encodeURIComponent(url);
        var signatureStrBefore = type + "&" + urlEncodeStr + "&" + paramEncodeStr;
        var secretKey = xlientKey.k + timestamp.substr(-3);
        const signatureStrSHA = CrYPtoJS.HmacSHA1(signatureStrBefore, secretKey).toString();
        const signatureStrBase64 = this.base64encodeStr(signatureStrSHA);
        // console.log("signatureStrBefore,", signatureStrBefore);
        // console.log("signatureStrSHA:", signatureStrSHA);
        // console.log("signatureStrBase64:", signatureStrBase64)
        return signatureStrBase64;
    },
    base64encodeStr(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },
    /** elementUI 表格跨行计算方法
     * @param {Object} data 源数据 一维对象数组
     * @param {Object} keys 一维数组 ["key1","key2,key3"]
     * 返回数据中带spans_key1_key2_key3_.....跨行数据格式
     */
    convertTableSpan(data, keys) {
        let tempLastIndex = {};
        let tempKeys = keys.map(k => {
            const mk = k.replace(/,/g, "_");
            tempLastIndex[mk] = 0;
            return {
                keyStr: mk,
                keyArr: k.split(",")
            };
        });
        data.forEach((item, index) => {
            tempKeys.forEach(keyObj => {
                // 将待计算跨行的数据加上默认跨行对象
                if (typeof (item[
                    'spans_' + keyObj.keyStr]) === "undefined") {
                    item['spans_' + keyObj.keyStr] = {
                        rowspan: 1,
                        colspan: 1
                    }
                }
                const preCompareStr = keyObj.keyArr.map(k => data[tempLastIndex[keyObj.keyStr]][k]).join(""); //上一条比较字段
                const curCompareStr = keyObj.keyArr.map(k => item[k]).join(""); //当前比较字段
                const nexCompareStr = data[index + 1] ? keyObj.keyArr.map(k => data[index + 1][k]).join("") : null; //下一条比较字段
                // 比较字段有变化
                if (preCompareStr !== curCompareStr) {

                    tempLastIndex[keyObj.keyStr] = index;
                }

                // 下一条数据车次未改变，则合并+1
                if (curCompareStr === nexCompareStr) {
                    data[tempLastIndex[keyObj.keyStr]]["spans_" + keyObj.keyStr].rowspan++;
                    data[index + 1]["spans_" + keyObj.keyStr] = {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            });
        });
        return data;
    },
    //setIntervalItem(func,1000).start(); 代替setinterval
    setIntervalItem(f, time) {
        let sto = null;
        const startSTO = () => {
            sto = setTimeout(() => {
                clearTimeout(sto);
                startSTO();
                f();
            }, time);
        }
        const stopSTO = () => {
            clearTimeout(sto);
        };
        return { start: startSTO, stop: stopSTO };
    },
    //animationItem(func).start(); 代替setinterval 刷新频率为显示器刷新频率
    animationItem(f) {
        let sto = null;
        const startSTO = () => {
            sto = requestAnimationFrame(() => {
                cancelAnimationFrame(sto);
                startSTO();
                f();
            });
        }
        const stopSTO = () => {
            cancelAnimationFrame(sto);
        };
        return { start: startSTO, stop: stopSTO };
    },
    // 、将一个数组分割为X份数 array[待分割数组] size[每份数组长度]
    sliceArr(array, size) {
        var result = [];
        for (var x = 0; x < Math.ceil(array.length / size); x++) {
            var start = x * size;
            var end = start + size;
            result.push(array.slice(start, end));
        }
        return result;
    },
    latlngRiceExchange(d, ty) {
        // 经纬度转米
        if (ty === "rice") {

        }
        // 米转经纬度
        else {
            return {
                lat: d / 11132 * 0.1, //纬度
                lng: d / 10000 * 0.1, //经度
            }
        }
    },
    /**获取数据
     * @param {Object} pa    {url:""}
     * */
    getPromiseData(payload) {
        const opt = this.creatOptions(payload);
        const promise = new Promise(function (resolve, reject) {
            const options = {
                type: "post",
                url: opt.url,
                data: opt.data,
                dataType: 'json',
                async: payload.async === false ? false : true, //默认：true（异步）(false:同步，按顺序执行，等待此方法调用完成以后才执行之后的程序)
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                timeout: 30000,
                dataFilter: (data) => {
                    if (typeof data === 'string') {
                        const JSONbigString = new JSONbig({
                            storeAsString: true
                        });
                        const real = JSONbigString.parse(data);
                        return JSON.stringify(real);
                    } else {
                        return data;
                    }
                },
                success: (r) => {
                    if (r.success) {
                        resolve(r.data);
                    } else {
                        reject("[" + opt.author + "]" + r.errorMessage, r);
                    }
                },
                error: function (XMLHttpRequest, string, error) {
                    window.console.log("[" + opt.author + "]服务器无响应");
                    reject("[" + opt.author + "]服务器无响应-" + error, error);
                },
                complete: function (XMLHttpRequest, status) {
                    if (status === "timeout") {
                        window.console.log("[" + opt.author + "]访问超时");
                        reject("[" + opt.author + "]访问超时", status);
                    }
                }
            };
            //旧版2  新版
            if (typeof (payload.module) !== "undefined") {
                options.data = JSON.stringify(opt.data);
                options.contentType = "application/json";
            }
            $.ajax(options);
        });
        return promise;
    },
    /** 组织请求参数
    带 * 号为必传字段,若未指定module,则使用c\s\w\o方式
    list(列表): {*module:"模块",*funcType:"list",order:["*fileName,1|0|,day|month|year",...],pager:[*pageNum,*pageSize],params:{k:v,...}}
    export(导出): {*module:"模块",*funcType:"list",order:["*fileName,1|0|,day|month|year",...],params:{k:v,...}}
    add(插入): {*module:"模块",*funcType:"add",*params:{k:v,...}}
    delete(删除): {*module:"模块",*funcType:"delete",*params:["id","id",...]}
    update(修改): {*module:"模块",*funcType:"update",*params:{k:v,...}}
    view(查详情): {*module:"模块",*funcType:"view",*params:"id"}
     * @param {Object} payload
     */
    creatOptions(payload) {
        let opt = {
            author: payload.a || payload.c,
            url: (payload.url || this.ADDS.serv + "/GeneralProServlet") + (payload.u || ""),
            data: {}
        };
        // 原始访问方式
        if (typeof (payload.module) === "undefined") {
            opt.data = payload.data || {
                code: payload.c,
                login: JSON.stringify(["10.192.111.79", "hhs", "hhs"]),
                sql: JSON.stringify(payload.s ? payload.s : []),
                where: JSON.stringify(payload.w ? payload.w : []),
                order: JSON.stringify(payload.o ? payload.o : [])
            };
            return opt;
        } else if (payload.module === "execute") {
            opt.data = {
                code: payload.c
            };
            payload.s && (opt.data.sql = typeof (payload.s) === "string" ? payload.s : JSON.stringify(payload.s));
            payload.w && (opt.data.where = typeof (payload.w) === "string" ? payload.w : JSON.stringify(payload.w));
            payload.o && (opt.data.order = typeof (payload.o) === "string" ? payload.o : JSON.stringify(payload.o));
            // sql: JSON.stringify(payload.s ? payload.s : []),
            // where: JSON.stringify(payload.w ? payload.w : []),
            // order: JSON.stringify(payload.o ? payload.o : []),
            return opt;
        }
    },

};
