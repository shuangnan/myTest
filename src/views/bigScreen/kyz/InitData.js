/* eslint-disable no-inner-declarations */
import c from '../../../assets/com';
const webParam = c.getUrlParam();
var urlTop = "";
var urlhostname = window.location.hostname;
// if (urlhostname !== "localhost" && urlhostname !== "127.0.0.1" && urlhostname.indexOf("10.192.185") < 0 && urlhostname !== "") {
//     urlTop = "http://" + urlhostname + ":9090/";//正试服
// } else {
//     urlTop = "http://10.192.6.155:9090/"; //测试服务器
// }
if (process.env.NODE_ENV == "development") {
    urlTop = "http://10.192.6.155:9090/"; //测试服务器
} else {
    urlTop = "http://" + urlhostname + ":9090/";//正试服
}
export default {
    webParam,
    urlTop,
    //查询该站所管理的车站列表
    getGLStnList(stncode, date,stnname,callback) {
        c.getData({
            c: "kydb_ys_0002",
            s: [stncode, date],
            a: "查询该站所管理的车站列表",
            async: true,
        }, function (rs) {
            if(rs.length==0){
                rs=[{STN_CODE: stncode,
                STN_NAME: stnname,
                USE_FLAG: "1"}]
            }
            rs.forEach(v => {
                v.DETAIL = [];
            })
            callback(rs);
        });
    },
    //type 1-发送人数，2-客运收入
    queryStnWCTotal(stnString,type,sdate,edate,callback){
        c.getData({
            c: "trdm_lv_626",
            s: [stnString,type,sdate,edate],
            a: "获取指定站，指定日期范围内，指定类型18点数据",
            async: true,
        }, function (rs) {
            callback(rs,type,stnString);
        });
    },
    queryHYNum_J(stnString,date,type,callback){
        c.getData({
            c: "trdm_lv_608",
            s: [stnString, type,date],
            a: "获取会议奋斗必保数据",
            async: true,
        }, function (rs) {
            callback(rs,type,stnString);
        });
    },
}