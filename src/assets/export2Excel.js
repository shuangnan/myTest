import XLSX from 'xlsx'

export default {
    exportExcel (id,title) {
        var xlsxParam = { raw: true };//转换成excel时，使用原始的格式
        /* generate workbook object from table */
        //判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
        //网上wb = XLSX.utils.table_to_book(document.querySelector('#'+id));直接这样写，如果存在固定列，导出的excel表格会重复两遍
        let fix = document.querySelector(`#${id} .el-table__fixed`);
        let popper=document.querySelectorAll(`#${id} .el-popper`);
        let wb;
        if (fix) {
            wb = XLSX.utils.table_to_book(document.querySelector('#'+id).removeChild(fix), xlsxParam);     //removeChild从子节点列表中删除某个节点:
            document.querySelector('#'+id).appendChild(fix);                                              //appendChild向节点添加最后一个子节点
        }else if(popper) {
            popper.forEach(v=>{
                v.remove();
            })
            wb = XLSX.utils.table_to_book(document.querySelector('#'+id), xlsxParam);     //removeChild从子节点列表中删除某个节点:
        }else {
            wb = XLSX.utils.table_to_book(document.querySelector('#'+id), xlsxParam);
        }

        //ecode_range(addr) 将 B1:C9这种字符串转换为行列对象(s:{c:1,r:0},e:{c:2,r:8})  s-start  e-end  c-col(列)  r-row(行)
        //'!ref'表示工作表范围的字符串。
        let range = XLSX.utils.decode_range(wb.Sheets['Sheet1']['!ref']);
        let borderStyle = {
            top: {style: "thin", color: { rgb: "000000" }}, bottom: {style: "thin", color: { rgb: "000000" }},
            left: {style: "thin", color: { rgb: "000000" }}, right: {style: "thin", color: { rgb: "000000" }}
        };
        let style = {
            border:borderStyle,
            alignment:{horizontal:'center',wrapText:true,vertical:'center'},
            font:{sz:14,color:{rgb:"000000"},outline:true},
        };

        let tmpWb = {};
        //Object 要返回其枚举自身属性的对象 let person = {name:"张三",age:25} Object.keys(person) =  ["name", "age"]
        Object.keys(wb.Sheets.Sheet1).forEach(item=>{
            if (item === "!rows" || item === "!cols" || item === "!fullref" || item === "!ref") {
                tmpWb[item] = wb.Sheets.Sheet1[item]
            }else {
                wb.Sheets.Sheet1[item]["s"] = style
            }
        });

        //wopts：
        //type	 	            输出数据类型（请参见下面的输出类型）"base64" Base64编码 "binary" 二进制字符串 "buffer" nodejs 缓冲区 "file" 直接创建文件（node 环境下有效）
        //cellDates	    false	将日期存储为类型'd'(默认为'n')
        //bookSST	    false	是否生成共享字符串表
        //bookType	   'xlsx'	工作簿的类型(xlsx、xlsm 或 xlsb)
        //showGridLines	true	是否显示网格线
        //Props	        null	工作簿的属性
	    let colWidth = [];               //设置列宽
	    Object.keys(wb.Sheets.Sheet1).forEach(item=>{
		    // if (item.replace(/[^0-9]/ig, "") === '2'){
			   //  colWidth.push({wch:wb.Sheets.Sheet1[item].v.length*1.8})
		    // }
			colWidth.push({wch:15})
	    });
	    wb.Sheets.Sheet1['!cols'] = colWidth;
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        let wbout = XLSX.write(wb, wopts);
        try {
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), title+'.xlsx')
        } catch (e) {
            if (typeof console !== 'undefined') window.console.log(e, wbout)
        }
        return wbout
    }
}

function s2ab(s) {
    if (typeof ArrayBuffer !== "undefined"){
        let buf = new ArrayBuffer(s.length);        //二进制数组（ArrayBuffer对象、TypedArray视图和DataView视图）是JavaScript操作二进制数据的一个接口。
        let view = new Uint8Array(buf);             // Uint8Array 数组类型表示一个8位无符号整型数组,创建时内容被初始化为0。
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        let buf = new Array(s.length);
        for (let j = 0; j != s.length; ++j) buf[j] = s.charCodeAt(j) & 0xFF;
        return buf
    }
}

function saveAs(obj, fileName) {
    var tmpa = document.createElement("a");
    tmpa.download = fileName || "未命名";
    // 兼容ie 火狐 下载文件
    if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, fileName);
    } else if (window.navigator.userAgent.includes("Firefox")) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(obj);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
    } else {
        tmpa.href = URL.createObjectURL(obj);
    }
    tmpa.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
}