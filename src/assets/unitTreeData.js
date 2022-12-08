/* eslint-disable no-inner-declarations */
import c from './com.js';
var urlTop = "";
var urlhostname = window.location.hostname;
if (process.env.NODE_ENV == "development") {
    urlTop = "http://10.192.6.176:9090/"; //测试服务器
} else {
    urlTop = "http://" + urlhostname + ":9090/";//正试服
}
export default {
    urlTop,
    //webParam url参数,filterRoot 是否过滤顶级节点
    getData_tree(webParam,filterRoot) {
        var url = c.origin + "/PTMS/GeneralProServlet";
        let rs = { value: "", treeData: [], flag: false, stncode: "", stnname: "" };
        let tt = c.getData({
            c: "0695",
            s: [webParam.Oid],
            url: url,
            async: false,
            a: "【0695】获取单位树"
        });
        tt = typeof (tt) === "string" ? tt.toLowerCase() : JSON.stringify(tt).toLowerCase();
        tt = JSON.parse(tt);
        if(filterRoot){
            tt=tt.filter(v=>{
                return v.id!=webParam.Oid.toLowerCase();
            });
        }
        let r = c.convertTreeData(tt, "id", "pid", "text", "");
        tt = tt.map(v => {
            v.outtop = "";
            v.innertop = "";
            if (v.zmlm.toUpperCase() === webParam.StnCode && v.zmlm !== "") {
                rs.value = v.id;
                rs.flag = false;
                rs.stncode = v.zmlm.toUpperCase();
                rs.stnname = v.text;
            }
            return v;
        });
        if (r.length === 0) {
            rs.flag = false;
            return rs;
        }
        if (webParam.DepId) { //有部门id
            var childrenTree = "";
            getChildrenTree(r[0], webParam.DepId);//根据部门id 获得部门树
            if (childrenTree !== "") {
                rs.treeData = [childrenTree];
                rs.flag = true;
            }
            function getChildrenTree(tree, depid) {//根据部门id 获得部门树
                if (tree.children) {
                    tree.children.forEach((v) => {
                        if (v.id.toUpperCase() === depid) {
                            childrenTree = v;
                        }
                        if (childrenTree === "" && v.children) {
                            getChildrenTree(v, depid);
                        }
                    })
                }
            }

        }
        if (rs.treeData.length === 0) {//没有部门id,没有查找到站名
            rs.treeData = r;
        }
        if (rs.value === "") {//没有站名略吗 查找单位树下第一个站名略吗不等于空的
            if (rs.treeData !== 0) {
                getZMlM(rs.treeData[0]);
            } else {
                rs.flag = false;
            }
        }
        function getZMlM(treeData) {//查找单位树下第一个站名略吗不等于空的
            if(treeData.children){
                var curNode = treeData.children[0];
                if (curNode.zmlm === "") {
                    getZMlM(treeData.children[0]);
                } else {
                    rs.value = curNode.id;
                    rs.flag = true;
                    rs.stncode = curNode.zmlm.toUpperCase();
                    rs.stnname = curNode.text;
                }
            }else{
                rs.flag = true;
                if(treeData){
                    rs.value = treeData.id;
                    rs.stncode = treeData.zmlm.toUpperCase();
                    rs.stnname = treeData.text;
                }
            }
            
        }
        return rs;
    },
    getTreeNodeByid(st_valueId, tree) {
        var node = {};
        getNode(tree)
        return node;
        function getNode(itemlist) {
            itemlist.forEach(v => {
                if (v.id == st_valueId) {
                    node = v;
                }
                if (v.children && v.children.length > 0) {
                    getNode(v.children)
                }
            })
        }
    },
    getSelectOname(webParam) {
        var url = c.origin + "/PTMS/GeneralProServlet";
        let rs = { value: "", selectData: [], flag: false };
        let tt = c.getDataSync({
            c: "0695",
            s: [webParam.Oid],
            url: url,
            async: false,
            a: "【0695】获取单位树"
        });
        tt = typeof (tt) === "string" ? tt.toLowerCase() : JSON.stringify(tt).toLowerCase();
        tt = JSON.parse(tt);
        let r = c.convertTreeData(tt, "id", "pid", "text", "");
        if(r[0].pid){
            rs.selectData=r;
        }else{
            rs.selectData=r[0].children;
            rs.flag=true;
        }
        rs.value=rs.selectData[0].id;
        return rs;
    },
    textChangeVoice(text, _voiceFlag) {
        if ('speechSynthesis' in window) {
            if (_voiceFlag) {
                var msg = new SpeechSynthesisUtterance();
                var voices = window.speechSynthesis.getVoices();
                msg.voice = voices[0];
                msg.rate = 0.7; //语速
                msg.pitch = 1; //语调
                text = this.initTEXT(text); //D替换成动，G替换成高，C替换成 成
                msg.text = text;
                speechSynthesis.speak(msg);
            }
        } else {
            alert('你的浏览器不支持语音合成');
        }
    },
    initTEXT(text) {
        text = this.addKeche(text);//纯数字客车添加 客车两字
        text = text.replace(/DJ/g, " 动检");
        text = text.replace(/D/g, " 动");
        text = text.replace(/G/g, " 高");
        text = text.replace(/C/g, " 成");
        if (text.indexOf("Z") > -1 || text.indexOf("T") > -1 || text.indexOf("K") > -1 || text.indexOf("Y") > -1) {
            text = text.replace(/车次/g, "");
        }
        text = text.replace(/Z/g, "客车 直");
        text = text.replace(/T/g, "客车 特");
        text = text.replace(/K/g, "客车 快");
        text = text.replace(/Y/g, "客车 游");
        return text;
    },
    //纯数字车次 加客车两字
    addKeche(text) {
        var tempText = text.replace(/\s/g, "");
        var ccIndex = tempText.indexOf("车次");
        if (ccIndex < 0) {
            return text;
        }
        var gdcIndex = ccIndex + 2;
        if (!isNaN(tempText.charAt(gdcIndex))) {
            text = text.replace(/车次/, '客车');
        }
        return text;
    },
}
