const isDOM = (typeof HTMLElement === 'object') ?
	function(obj) {
		return obj instanceof HTMLElement;
	} : function(obj) {
		return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
	}
const extend = function(obj, obj2) {
	for (var k in obj2) {
		obj[k] = obj2[k];
	}
	return obj;
}

/**
 * 打印方法
 * @param {Object} dom
 * @param {Object} options
 */
const Print = function(dom, options) {
	if (!(this instanceof Print)) return new Print(dom, options);
	this.options = extend({
		noPrint: '.no-print', //不打印内容样式
		prevStr: '', //打印前置内容
		nextStr: '', //打印后置内容
	}, options);
	if ((typeof dom) === "string") {
		this.dom = document.querySelector(dom);
	} else {
		isDOM(dom)
		this.dom = isDOM(dom) ? dom : dom.$el;
	}
	console.log(this.dom)
	this.init();
};
Print.prototype = {
	init: function() {
		// var content = this.getStyle() + this.getHtml();
		// this.writeIframe(content);
		this.writeIframe();
	},
	// 复制原网页所有的样式
	getStyle: function() {
		var str = "",
			styles = document.querySelectorAll('style,link');
		for (var i = 0; i < styles.length; i++) {
			str += styles[i].outerHTML;
		}
		str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";
		// 去除height：100%样式，解决分页下，样式混乱问题
		str += "<style>html,body,div{height: auto!important;}</style>";
		//修改 mini表格单元格间距
		str +=
			`<style>
	  .el-table--mini td, .el-table--mini th {padding: 6px 0 !important;}
	  .caret-wrapper{display:none !important;}
	  </style>`;
		return str;
	},
	// 获取打印内容
	getContent: function() {
		var header = this.dom.querySelector(".el-table__header").querySelectorAll("tr");
		var bodyer = this.dom.querySelector(".el-table__body").querySelectorAll("tr");
		var thead = [];
		let tbody = [];
		for (var i = 0; i < header.length; i++) {
			thead.push("<tr>");
			var tds = header[i].querySelectorAll("th");
			for (var j = 0; j < tds.length; j++) {
				if (tds[j].className !== "gutter") {
					const w = tds[j].offsetWidth + "px;";
					const rsp = tds[j].getAttribute("rowspan");
					const csp = tds[j].getAttribute("colspan");
					thead.push('<th style="width:' + w + '" rowspan=' + rsp + ' colspan=' + csp + '>' + tds[j].innerText + '</th>');
				}
			}
			thead.push("</tr>");
		}
		// 不让表格显示科学计数法或都其他格式
		// 方法1 tr 或 td 里面加 style="mso-number-format:'\@';" 方法2 改为 = 'XXX'格式
		// 如果纯数字且超过15位
		// var reg = /^[0-9]+.?[0-9]*$/;
		// if(v.length>15 && reg.test(v)){
		// 	v = '="' + v + '"';
		// }
		for (var i = 0; i < bodyer.length; i++) {
			tbody.push("<tr>");
			var tds = bodyer[i].querySelectorAll("td");
			for (var j = 0; j < tds.length; j++) {
				const rsp = tds[j].getAttribute("rowspan");
				const csp = tds[j].getAttribute("colspan");
				tbody.push('<td rowspan=' + rsp + ' colspan=' + csp + '>' + tds[j].innerHTML + '</td>');
			}
			tbody.push("</tr>");
		}
		thead = thead.join("");
		tbody = tbody.join("");
		var str = "<style>html,body,div{height: auto!important;}</style>";
		str +=
			`<style>
		.tab{font-size:12px;text-align:center;width:100%;border-collapse: collapse;}
		.tab th,.tab td{}
		.tab td{padding: 3px;}
		</style>
		${this.options.prevStr}
		<table class="tab" border="1" cellpadding="0" cellspacing="0">${thead}${tbody}</table>
		${this.options.nextStr}`;
		return str;
	},
	// 创建iframe
	writeIframe: function(content) {
		var w, doc, iframe = document.createElement('iframe'),
			f = document.body.appendChild(iframe);
		iframe.id = "myIframe";
		// iframe.style = "position:absolute;width:100%;height:100%;top:0;left:0;background:white;";
		iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
		w = f.contentWindow || f.contentDocument;
		doc = f.contentDocument || f.contentWindow.document;
		doc.open();
		// 获取内容
		var _content = this.getContent();
		doc.write(_content);
		// return;
		doc.close();
		this.toPrint(w);
		setTimeout(function() {
			document.body.removeChild(iframe)
		}, 100);
	},
	// 执行打印
	toPrint: function(frameWindow) {
		try {
			setTimeout(function() {
				frameWindow.focus();
				try {
					if (!frameWindow.document.execCommand('print', false, null)) {
						frameWindow.print();
					}
				} catch (e) {
					frameWindow.print();
				}
				frameWindow.close();
			}, 10);
		} catch (err) {
			console.log('err', err);
		}
	}
};

/**
 * 导出方法
 * @param {Object} dom
 * @param {Object} options
 */
const Export = function(dom, options) {
	if (!(this instanceof Export)) return new Export(dom, options);
	this.options = extend({
		noExport: "noExport", //不导出的列样式
		filename: Math.random().toString(16).substring(3), //导出文件名称 默认随机字符
		worksheet: "Worksheet", //工作薄名称
		prevStr: '', //导出前置内容
		nextStr: '', //导出后置内容
		exported: null
	}, options);
	if ((typeof dom) === "string") {
		this.dom = document.querySelector(dom);
	} else {
		isDOM(dom)
		this.dom = isDOM(dom) ? dom : dom.$el;
	}
	this.init();
};
Export.prototype = {
	init: function() {
		this.toExport();
	},
	// 获取内容
	getContent: function() {
		var header = this.dom.querySelector(".el-table__header").querySelectorAll("tr");
		var bodyer = this.dom.querySelector(".el-table__body").querySelectorAll("tr");
		var thead = [];
		let tbody = [];
		for (var i = 0; i < header.length; i++) {
			thead.push("<tr>");
			var tds = header[i].querySelectorAll("th");
			let tdsLen = tds.length;
			for (var j = 0; j < tdsLen; j++) {
				if (tds[j].className !== "gutter") {
					// 有不导出的列配置
					const w = tds[j].offsetWidth + "px;";
					const rsp = tds[j].getAttribute("rowspan");
					const csp = tds[j].getAttribute("colspan");
					const txt = tds[j].innerText;
					thead.push(`<th style="width:${w}" rowspan="${rsp}" colspan="${csp}">${txt}</th>`);
				}
			}
			thead.push("</tr>");
		}
		// 不让表格显示科学计数法或都其他格式
		// 方法1 tr 或 td 里面加 style="mso-number-format:'\@';" 方法2 改为 = 'XXX'格式
		// 如果纯数字且超过15位
		// var reg = /^[0-9]+.?[0-9]*$/;
		// if(v.length>15 && reg.test(v)){
		// 	v = '="' + v + '"';
		// }
		
		// 日期格式:<td style="vnd.ms-excel.numberformat:yyyy-mm-dd hh:MM:ss">2020-01-01 12:22:11</td>
		for (var i = 0; i < bodyer.length; i++) {
			tbody.push("<tr>");
			var tds = bodyer[i].querySelectorAll("td");
			for (var j = 0; j < tds.length; j++) {
				const rsp = tds[j].getAttribute("rowspan");
				const csp = tds[j].getAttribute("colspan");
				const tan = tds[j].style.textAlign;
				const cls = tds[j].getAttribute("class");
				const _style = cls.indexOf("is-center")>-1?'style="text-align:center"':'style="text-align:left"'; //内容对齐方式
				const txt = tds[j].innerHTML; //单元格内html
				const str = tds[j].innerText; //纯字符串
				// 如果纯数字且超过10位
				var reg = /^[0-9]+.?[0-9]*$/;
				if (str.length > 10 && reg.test(str)) {
					txt = '="' + str + '"';
				}
				tbody.push(`<td ${_style} rowspan="${rsp}" colspan="${csp}">${txt}</td>`);
			}
			tbody.push("</tr>");
		}
		thead = thead.join("");
		tbody = tbody.join("");
		var str = "<style>html,body,div{height: auto!important;}</style>";
		str +=
			`<style>
		.tab{font-size:12px;width:100%;border-collapse: collapse;}
		.tab th,.tab td{}
		.tab td{padding: 3px;}
		</style>
		${this.options.prevStr}
		<table class="tab" border="1" cellpadding="0" cellspacing="0">${thead}${tbody}</table>
		${this.options.nextStr}`;
		return str;
	},

	// 执行导出
	toExport: function() {
		var uri = 'data:application/vnd.ms-excel;base64,',
			template =
			'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>',
			base64 = function(s) {
				return window.btoa(unescape(encodeURIComponent(s)))
			},
			format = function(s, c) {
				return s.replace(/{(\w+)}/g, function(m, p) {
					return c[p];
				})
			}
		var table = this.getContent();
		var ctx = {
			worksheet: this.options.worksheet,
			table: table
		};
		var data = base64(format(template, ctx));
		if (window.navigator.msSaveBlob) {
			var blob = b64toBlob(data);
			window.navigator.msSaveBlob(blob, this.options.filename);
		} else {
			var alink = document.createElement('a');
			alink.style.display = "none";
			alink.setAttribute("href", uri + data);
			alink.setAttribute("download", this.options.filename);
			alink.setAttribute("href", uri + data);
			alink.click();
			alink.remove();
		}
		this.options.exported&&this.options.exported.call(null);
	},
};
const MyPlugin = {}
MyPlugin.install = function(Vue, options) {
	// 添加实例方法
	Vue.prototype.$Print = Print
	Vue.prototype.$Export = Export
}
export default MyPlugin
