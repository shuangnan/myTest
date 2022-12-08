//自写表格 固定表头方案
import $ from "jquery";
export default {
    //方案1 
    //给表头加css样式 利用translate 固定表头，
    //滚动时 表头border会消失，用box-shadow: inset 1px 1px 0 0 #0e90d2;绘制表头边框
    //滚动到指定行 
    //$("#zydbBox").animate({ scrollTop: top },1000) 自动滚动时表头固定不住
    //
    fexed1() {
        var get = document.querySelector.bind(document);
        var boxEle1 = get("#zydbBox");
        boxEle1.addEventListener('scroll', function () {
            this.querySelector("thead").style.transform = 'translate(0,' + this.scrollTop + 'px)';
        });
    },
    //滚动到指定行 滚动的盒子，一次滚动距离，滚动计数字段
    //var boxEle2 = get("#zydbBox");
    // this.sTout(boxEle2, tt10, 0);
    sTout(boxEle2, lth, index) {
        setTimeout(() => {
            boxEle2.scrollTop += lth;
            index += 1;
            if (index < 50) {
                this.sTout(boxEle2, lth, index);
            }
        }, 20);
    },
    // 方案2 
    //复制一个表头，固定在顶部，在数据加载完成后 ，计算表头宽度
    //复制表头
    copyThead(id) {
        const thead = $("#" + id + " thead")[0].outerHTML;
        $("#" + id).append(thead);
        const pt = $("#" + id + " thead").eq(0).offset();
        $("#" + id + " thead").eq(1).css({
            position: "fixed",
            top: pt.top + "px",
            left: pt.left + "px",
        })
        this.fixedThead(id);
    },
    //计算表头单元格宽度
    // document.querySelector("#" + id + " tbody tr").querySelectorAll("td").forEach((item, i) => {
    //     document.querySelector("#" + id + " thead tr").querySelectorAll("td")[i].style.width = item.offsetWidth + "px";
    //   })
    fixedThead(id) {
        let theadList = $("#" + id + " thead");
        theadList.eq(0).find("th").each(function (i) {
            theadList.eq(1).find("th").eq(i).width($(this).width());
        })
    },
}

