<!--
	数字容器
	@author ch
	@time 2020年6月4日
-->
<template>
    <div class="number-box">
		<div class="number-title" :class="{'is-blue':blueFlag}">{{label}}</div>
		<div class="number-item" v-for="item in numArr">
			<ul class="number-list" :class="curNumClass+item">
				<li v-for="n in numDic">{{n}}</li>
			</ul>
		</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
				numDic:["0","1","2","3","4","5","6","7","8","9"],
				numArr:["0","0","0","0","0"],
				curNum:"000000",
				curNumClass:"cur-num",
				intervalNum:null,
				blueFlag:false,
			}
        },
        props: {
			label:String,
            num: String,
        },
        mounted() {
			this.creatNum(this.num);
			
        },
        methods: {
            /**-------------------------响应事件-------------------------------*/
            /**-------------------------数据展示-------------------------------*/
			creatNum(v){
				this.curNum = v;
				this.numArr = v.split("");
			},
            /**-------------------------获取数据-------------------------------*/
        },
        watch: {
			num(v){
				this.creatNum(v);
			},
		},
        computed: {
        },
        components: {},
    }
</script>

<style scoped>
    .number-box {
        display: inline-block;
		vertical-align: middle;
		cursor: pointer;
    }
	.number-title{
		display: inline-block;
		vertical-align: middle;
		padding: 0 10px 0 30px;
		font-size: 20px;
		font-weight: bold;
		text-shadow: 0px 0px 3px black;
		color: #e6e6e6;
	}
	.number-title.is-blue{
		/* color: #20D0DB; */
	}
	.number-item{
		display: inline-block;
		vertical-align: middle;
		width: 40px;
		height: 60px;
		margin: 0 2px;
		overflow: hidden;
		border-radius: 7px;
		background: #27366C  url(../../assets/imgs/bigScreen/num-bg0.png)no-repeat;
		background-size: 100% 100%;
	}
	.number-list{
		display: inline-block;
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 40px;
		line-height: 60px;
		color: #20D0DB;
		font-weight: bold;
		height: 100%;
		transition: margin-top 3s;
	}
	.number-list.cur-num0{
		margin-top: 0;
	}
	.number-list.cur-num1{
		margin-top: -60px;
	}
	.number-list.cur-num2{
		margin-top: -120px;
	}
	.number-list.cur-num3{
		margin-top: -180px;
	}
	.number-list.cur-num4{
		margin-top: -240px;
	}
	.number-list.cur-num5{
		margin-top: -300px;
	}
	.number-list.cur-num6{
		margin-top: -360px;
	}
	.number-list.cur-num7{
		margin-top: -420px;
	}
	.number-list.cur-num8{
		margin-top: -480px;
	}
	.number-list.cur-num9{
		margin-top: -540px;
	}
	.number-list>li{
		list-style: none;
		padding: 0;
		margin: 0;
		display: inline-block;
		height: 100%;
	}
</style>
