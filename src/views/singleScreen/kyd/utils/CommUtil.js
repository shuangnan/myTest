export default{
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
	getUrlParam(isJM) {
	    var rs = {};
	    var txt = window.location.hash.split("?")[1]; // 参数
	    if (txt && txt !== "") {
	        if (isJM) { //需要解码
	            txt = this.base64decode(txt);
	        }
	        var sarr = txt.split("&");
	        $.each(sarr, function (i, v) { // decodeURIComponent()[谷歌]、unescape()[IE]
	            var t = v.split("=");
	            rs[t[0]] = decodeURI(t[1]);
	            if (t[0] === "token") {
	                rs[t[0]] = decodeURIComponent(t[1]);
	                rs[t[0]] = rs[t[0]].replace(/ /g, "+");
	            }
	        });
	    }
	    return rs;
	},
}