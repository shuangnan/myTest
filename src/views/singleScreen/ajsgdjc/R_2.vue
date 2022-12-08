<template>
  <div class="productProcess">
    <div class="title">预警与提示</div>
    <!-- 如果页面刷新数据比较频繁，可以将loading、showFlag的相关代码删除，防止过于频繁的出现加载动画 -->
    <!-- <div class="loading_div" v-show="!showFlag">
      <div>Loading...</div>  
    <!-- </div> -->
 
      
      <!-- 标准title可以调用组件 -->
      <div class="title_div">
        <!--  <titleComponent :title="title"></titleComponent> --> 
      </div>
 
      <!-- 参数名称、列数根据实际情况调整 -->
      <div class="table_body">
        <!-- <div class="table_th">
          <div class="tr1 th_style">排产编号</div>
          <div class="tr2 th_style">类型</div>
          <div class="tr3 th_style">日期</div>
          <div class="tr4 th_style">进度</div>
        </div> -->
        <div class="table_main_body" @mouseenter="mEnter" @mouseleave="mLeave">
          <div class="table_inner_body" :style="{transform: `translate(0px, -${scrollTop}px)`}">
			   <div ref="scrollItemBox">
            <div class="table_tr" v-for="(item,index) in tableList" :key="index" >
				<div :class="item.type===2 ? 'img2':'img'"></div>
				<div  :title="item.DuanName" class="DuanName">{{item.departmentName}}</div>
				<div :class="item.type===2 ?'Content':'Content2'">{{item.content}}</div>
				<div class="Data">{{item.createTime}}</div>
             <!-- <div class="tr1 tr" >{{item.planNo}}</div>
              <div class="tr2 tr" >{{item.type}}</div>
              <div class="tr3 tr" v-if="item.startDate!='-'" >{{item.startDate}} ~ {{item.endDate}}</div>
              <div class="tr3 tr" v-else >-</div>
              <div class="tr4 tr" v-if="item.process!='-'">{{Number(item.process).toFixed(2)}} %</div>
              <div class="tr4 tr" v-else >-</div> -->
            </div>
			</div>
			<div v-html="copyHtml"></div>
          </div>
        </div>
      </div>
  </div>
</template>
 
<script>
// import titleComponent from "@/components/titleComponent";
let timer = null;
import axios from 'axios'
export default {
  components: {
    // titleComponent
  },
  data() {
    return {
      showFlag: true,
      tableTimer: null,
      tableTop: 0,
      tableList: [
		// {
  //         "DuanName":"成都工务段",
  //         "Content":"TQI低于前三个月平均值(预警)",
  //         "Date":"2022年06月07日",
		//   "type":1,//1为预警，2为提示
  //       },
		// {
		//     "DuanName":"达州工务段",
		//     "Content":"成贵线线路质量连续下降(预警)",
		//     "Date":"2022年06月07日",
		// 	"type":1,
		// },
		// {
		//     "DuanName":"成都工务段",
		//     "Content":"成渝线重复Ⅱ级超限达5次以上(提示)",
		//     "Date":"2022年06月07日",
		// 	"type":2,
			
		// },
		// {
		//     "DuanName":"成都工务段",
		//     "Content":"成昆线线路质量评为差(预警)",
		//     "Date":"2022年06月07日",
		// 	"type":1,
		// },
		
		// {
		//     "DuanName":"成都工务段",
		//     "Content":"成贵线设备检查超周期(提示)",
		//     "Date":"2022年06月07日",
		// 	"type":2,
		// },
		// {
		//     "DuanName":"成都工务段",
		//     "Content":"成贵客专线发生Ⅲ（Ⅳ）级超限(预警)",
		//     "Date":"2022年06月07日",
		// 	"type":1,
		// },
		// {
		//     "DuanName":"成都工务段",
		//     "Content":"成渝线超周期整改(提示)",
		//     "Date":"2022年06月07日",
		// 	"type":2,
		// },
		// {
		//     "DuanName":"成都工务段",
		//     "Content":"襄渝线超周期整改2次以上(预警)",
		//     "Date":"2022年06月07日",
		// 	"type":1,
		// },
		// {
		//   "DuanName":"成都工务段",
		//   "Content":"TQI低于前三个月平均值(预警)",
		//   "Date":"2022年06月07日",
		//   "type":1,
		// },
		
		],
      /* tableList 参考格式
        [{
          "process":0.0000,
          "planNo":"BP2022060701",
          "endDate":"2022-06-07",
          "type":"砌块",
          "startDate":"2022-06-07"
        },
        {
          "process":0.0000,
          "planNo":"WP2022061301",
          "endDate":"2022-06-13",
          "type":"墙板",
          "startDate":"2022-06-13"
        }]
      */
      tableListSize: 0,
      componentTimer: null,

      //需要根据情况设置的参数
      // title: "排产进度",
      visibleSize: 3, //容器内可视最大完整行数
      lineHeight: 49, //每行的实际高度（包含margin-top/bottom,border等）
      componentTimerInterval: 360000000, //刷新数据的时间间隔
      tableTimerInterval: 100 ,//向上滚动 1px 所需要的时间，越小越快，推荐值 100
	  
	  scrollTop: 0,
	  speed: 90,
	  copyHtml: '',
    };
  },
 
  //如果没有父元素传值，将watch内的内容搬至mounted中即可
  props: [],
  watch: {
    
  },
	  mounted() {
		this.getDatabykys()
		setTimeout(()=>{
			this.tableActionFun()
		},200)
		
		

		// clearInterval(this.componentTimer);
		// this.bsGetProductProcess();
		// this.componentTimerFun();
	  },
	  beforeDestroy() {
		clearInterval(this.componentTimer);
		clearInterval(this.tableTimer);
	  },
	  methods: {
		  getDatabykys() {
		  	// var that = this
		  	axios.get('https://10.192.34.79/kys119/external/getGwWarningNotificationIndexByYearAndMonth?year=2022&month=10')
		  		.then((response) => {
		  			// console.log("科研所接口数据")
		  			// console.log(response.data.data)
		  			this.tableList = response.data.data
					console.log("this is R_2")
		  			console.log(response.data.data)
					console.log(this.tableList.length)
					for(let i=0;i<this.tableList.length;i++){
						this.tableList[i].createTime = this.tableList[i].createTime.split(' ',2)[0]
						// console.log(this.tableList[i].content.length)
						// this.tableList[i].content=this.tableList[i].content+this.tableList[i].content
						if(this.tableList[i].content.length>45){
							this.tableList[i].content=this.tableList[i].content.slice(0,45)
						}
					}
		  			
		  		})
		  },
		  initScroll() {
		              this.$nextTick(() => {
		                  this.copyHtml = this.$refs.scrollItemBox.innerHTML
		                  this.startScroll()
		              })
		          },
		          // 鼠标移入停止滚动
		          mEnter() {
		              clearInterval(timer);
		          },
		          // 鼠标移出继续滚动
		          mLeave() {
		              this.startScroll()
		          },
		          // 开始滚动
		          startScroll() {
		  
		              if (this.tableListSize > this.visibleSize) {
		                timer = setInterval(this.scroll, this.speed);
		              }
		          },
		          // 滚动处理方法
		          scroll() {
		              this.scrollTop++
		              // 获取需要滚动的盒子的高度
		              let scrollItemBox = this.$refs.scrollItemBox.offsetHeight
		              // 当判断滚动的高度大于等于盒子高度时，从头开始滚动
		              if (this.scrollTop >= scrollItemBox) {
		                  this.scrollTop = 0
		              }
		          },
		  
		tableActionFun() {
		  this.tableListSize = this.tableList.length;
		  if (this.tableListSize > this.visibleSize) {
			// this.tableList = this.tableList.concat(this.tableList);
			this.initScroll()
		  } else {
			this.fillTableList();
		  }
	  },
    //当数据过少时，不触发自动轮播事件，并填充没有数据的行，参数根据实际情况修改即可
    fillTableList() {
      var addLength = this.visibleSize - this.tableListSize;
      for (var i = 0; i < addLength; i++) {
        this.tableList.push({

        });
      }
    },
    tableTimerFun() {
      var count = 0;
      this.tableTimer = setInterval(() => {
        if (count < (this.tableList.length / 2) * this.lineHeight) {
          this.tableTop -= 1;
          count++;
        } else {
          count = 0;
          this.tableTop = 0;
        }
      }, this.tableTimerInterval);
    },
    componentTimerFun() {
      this.componentTimer = setInterval(() => {
        this.bsGetProductProcess();
      }, this.componentTimerInterval);
    },
	stop(){
		// clearInterval(this.componentTimer);
		clearInterval(this.tableTimer);
	},
	start(){
		if (this.tableListSize > this.visibleSize) {
			this.tableTimerFun()
		}
		
	}
  }
};
</script>
 
<style scoped>
.productProcess {
		background: url(img2/右边框.png)no-repeat;
		background-size: 100% 100%;
		padding-top: 20px;
		height: 100%;
}
.img{
	background: url(img2/橙色-c5733c.png)no-repeat;
	margin-top: 13px;
	margin-left: 12px;
}
.img2{
	background: url(img2/jj.png)no-repeat;
	margin-top: 13px;
	margin-left: 10px;
}
.title{
	position: absolute;
		margin-top: -20px;
		margin-left: 15px;
		font-size: 16px;
		color: #bccde6;
		/* background-image: linear-gradient(#1ae3ff,#2f7aca); */
		-webkit-background-clip: text;
		/* color: transparent; */
		-webkit-user-select: none;
	}

.loading_div {
  color: #eee;
  padding-top: 100px;
}
.title_div {
  width: 100%;
}
.table_body {
  width: 100%;
  height: 95%;
  margin-top: 0px;
}
.table_th {
  width: 100%;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.tr {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 5px;
  text-align: center;
  font-size: 14px;
}
.tr1 {
  width: 28%;
}
.tr2 {
  width: 15%;
}
.tr3 {
  width: 35%;
  font-size: 13px;
}
 
.tr4 {
  flex: 1;
}
 
.th_style {
  color: rgb(0, 221, 253);
  font-weight: bold;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 5px;
  text-align: center;
}
.table_main_body {
  position: absolute;
  width: 90%;
  height: 100%;
  margin-left: 25px;
  margin-top: 10px;
  overflow: hidden;
  position: relative;
  -webkit-user-select: none;
}
.table_inner_body {
  width: 100%;
  position: absolute;
  left: 0;
}
.table_tr {
  display: flex;
  min-height: 85px;
  line-height: 40px;
  color: #eee;
  font-size: 15px;
  background: rgba(8, 17, 39, 25);
  /* border: 1px solid rgb(4, 114, 131); */
  margin-top: 7px;
  align-items: center;
  align-content: center;
}
.table_tr>.img{
		display: inline-block;
		width: 58px;
		height: 58px;
		padding-top: 0px;
		padding-left: 10px;
		-webkit-user-select: none;
}
.table_tr>.img2{
		display: inline-block;
		width: 58px;
		height: 58px;
		padding-top: 0px;
		padding-left: 10px;
		-webkit-user-select: none;
}
.table_tr>.DuanName{
	position: absolute;
	font-size: 16px;
	color: #ffffff;
	padding-top: 8px;
	padding-left: 65px;
	width: 170px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	z-index: 11;
	cursor: pointer;
}
.table_tr>.Content{
	position: absolute;
	font-size: 17px;
	color: #ff6b60;
	padding-top: 8px;
	padding-left: 160px;
	width: 390px;
	word-wrap: break-word;
	word-break: break-all;
	line-height: 20px;
	z-index: 10;
	line-height: 22px;
}
.table_tr>.Content2{
	position: absolute;
	font-size: 17px;
	color: #ffba4a;
	padding-top: 8px;
	padding-left: 160px;
	width: 390px;
	word-wrap: break-word;
	word-break: break-all;
	line-height: 20px;
	z-index: 10;
	line-height: 22px;
}
.table_tr>.Data{
	position: absolute;
	font-size: 15px;
	color: #ffffff;
	padding-top: 8px;
	padding-left: 410px;
	z-index: 1;
}
</style>

