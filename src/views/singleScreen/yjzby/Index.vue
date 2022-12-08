<!--
 * @created：2022年9月20日
 * @author：	ch
 * @version:	v1.0
 * @desc:		应急值班员
 -->
<template>
	<div class="b-lay">
		<div class="log"></div>
		<div style="display: flex; flex-direction: row">
      <div class="left">
        <div class="group-tit">值班人员信息</div>
        <div style="position:absolute;top:30px;left:40px;width:320px;">
          <el-input size="mini" placeholder="请输入单位|人名查询" v-model="str" @change="filterAllPersons">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
        </div>
        <ul class="per-list">
          <li v-for="item in allPersons_real">
            <div class="img">
              <img src="./img/main-2.png" />
            </div>
            <div class="name">{{item.DUTY_MAN}}</div>
            <div class="info" :title="item.O_NAME+'-'+item.GZ+'\n'+item.DUTY_PHONE">
              <div><i class="el-icon-star-on"></i>{{item.O_NAME}}-{{item.GZ}}</div>
              <div><i class="el-icon-phone"></i>{{item.DUTY_PHONE}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="main">
        <div class="group-tit">值班人员统计</div>
        <div class="level">
          <div>三级</div>
        </div>
        <div class="main-box">
          <div class="tongji">
            <div>总人数</div>
            <div>{{allPersons.length}}人</div>
          </div>
          <div class="con">
            <div class="group">
              <span>{{curUnit.O_NAME}}</span>
              <label>全部</label>
            </div>
            <ul class="ry-list unit">
              <li v-for="item in curUnit.PERSONS" :title="item.GZ+'-'+item.DUTY_MAN">{{item.GZ}}-{{item.DUTY_MAN}}</li>
            </ul>
            <ul class="ry-list all">
              <li v-for="item in allPersons" :title="item.GZ+'-'+item.DUTY_MAN">{{item.GZ}}-{{item.DUTY_MAN}}</li>
            </ul>
          </div>
        </div>
        <ul class="unit-list top">
          <li v-for="item in allUnits1" :class="{active:curUnit.O_ID===item.O_ID}" @click="chooseUnit(item)">
            <div>{{item.O_NAME}}</div>{{item.PERSONS.length}}人
          </li>
        </ul>
        <ul class="unit-list bottom">
          <li v-for="item in allUnits2" :class="{active:curUnit.O_ID===item.O_ID}" @click="chooseUnit(item)">
            <div>{{item.O_NAME}}</div>{{item.PERSONS.length}}人
          </li>
        </ul>
      </div>
    </div>
	</div>
</template>

<script>
	import C from "../../../assets/com.js";
	export default {
		data() {
			return {
				str: "",
				allPersons_real:[],
				allPersons:[],
				allUnits1:[],
				allUnits2:[],
				curUnit:{
					PERSONS:[]
				},
			}
		},
		components: {},
		created() {},
		mounted() {
			this.getAllPersons();
		},
		methods: {
			filterAllPersons(str){
				if(str===""){
					this.allPersons_real = this.allPersons;
				}else{
					this.allPersons_real = this.allPersons.filter(v=>v.DUTY_MAN.indexOf(str)>-1||v.O_NAME.indexOf(str)>-1);
				}
			},
			chooseUnit(unit){
				this.curUnit = unit;
			},
			getAllPersons() {
				C.getDataP123({
					c: "eqeh_zxy2061",
					a: "【eqeh_zxy2061】获取地震影响范围",
					url: "https://10.192.126.203/GeneralProServlet", //接口地址
				}, r => {
					this.allPersons = r["1"];
					this.allUnits1 = r["2"].slice(0,7);
					this.allUnits2 = r["2"].slice(7);
					this.filterAllPersons("");
					this.chooseUnit(this.allUnits1[3]);
				})
			},
		}
	}
</script>

<style scoped="scoped">
	.b-lay {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-image: url("./img/bg.png");
		background-size: 150% 100%;
		color: white;
	}

	.log {
		width: 1920px;
		height: 72px;
		background: url("./img/logo.png") no-repeat;
		background-size: 100% 100%;
		/*background-position: 50% -10px;*/
		/*!*logo 是否居中*!*/
		/*margin: 0 auto;*/
	}
	.level{
		position: absolute;
		top: 31px;
		left: 50%;
		width: 350px;
		height: 150px;
		margin-left: -175px;
		background: url("./img/level2.png") no-repeat;
		background-size: 100% 100%;
	}
	.level>div{
		position: absolute;
		top: 50%;
		left: 50%;
		width: 130px;
		height: 130px;
		margin-top: -65px;
		margin-left: -65px;
		background: url("./img/level1.png") no-repeat;
		background-size: 100% 100%;
		font-weight: bold;
		color: #00fcf9;
		font-size: 20px;
		text-align: center;
		padding-top: 50px;
	}
	
	.left {
    height:          910.1px;
    width:           410.4px;
		background: url("./img/bg-left.svg") no-repeat;
		background-size: 100% 100%;
	}

	.per-list {
		position: absolute;
		top: 60px;
		left: 30px;
		bottom: 40px;
		width: 340px;
		list-style: none;
		padding: 0;
		margin: 0;
		overflow: auto;
		text-align: left;
	}

	.per-list>li {
		display: inline-block;
		list-style: none;
		padding: 6px 0 10px 20px;
		width: 100%;
		height: 60px;
		margin-top: 10px;
		background: url("./img/left-1.png") no-repeat;
		background-size: 100% 100%;
		white-space: nowrap;
		opacity: 0.9;
	}

	.per-list>li>.img {
		display: inline-block;
		vertical-align: middle;
		width: 45px;
		height: 45px;
		border-radius: 6px;
		overflow: hidden;
	}

	.per-list>li>.img>img {
		width: 200%;
		height: 200%;
	}

	.per-list>li>.name {
		display: inline-block;
		vertical-align: middle;
		width: 90px;
		text-indent: 22px;
		font-size: 20px;
	}

	.per-list>li>.info {
		display: inline-block;
		vertical-align: middle;
		padding-left: 5px;
		width: 180px;
		overflow: hidden;
	}

	.main {
    height:          910.1px;
    width:           1435.75px;
		background: url("./img/bg-main.svg") no-repeat;
		background-size: 100% 100%;
	}

	.main-box {
		position: absolute;
		top: 58%;
		left: 0;
		width: 100%;
		height: 280px;
		margin-top: -150px;
	}

	.main-box>.con {
		position: absolute;
		top: 50%;
		left: 10px;
		right: 30px;
		height: 120px;
		margin-top: -70px;
		background: rgba(14, 78, 136, .6);
		border-radius: 20px;
	}

	.main-box>.con>.group {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 70px;
		width: 400px;
		margin-left: -210px;
		margin-top: -35px;
		background: rgba(17, 47, 89, .6);
		border-radius: 15px;
		font-weight: bold;
		color: #00fcf9;
		font-size: 16px;
	}

	.main-box>.con>.group>span {
		float: left;
		display: inline-block;
		margin-top: 25px;
		width: 80px;
		text-align: center;
	}

	.main-box>.con>.group>label {
		float: right;
		margin-top: 25px;
		width: 80px;
		text-align: center;
	}

	.ry-list {
		list-style: none;
		position: absolute;
		top: 10px;
		bottom: 10px;
		width: 33%;
		padding: 0;
		margin: 0;
		overflow: auto;
	}

	.ry-list.unit {
		left: 10px;
		text-align: left;
	}

	.ry-list.all {
		right: 10px;
		padding-right: 10px;
		text-align: right;
	}

	.ry-list>li {
		display: inline-block;
		list-style: none;
		padding: 5px;
		width: 140px;
		height: 30px;
		margin-top: 2px;
		margin-left: 8px;
		background: url("./img/main-3.png") no-repeat;
		background-size: 100% 100%;
		white-space: nowrap;
		overflow: hidden;
	}

	.unit-list {
		list-style: none;
		position: absolute;
		left: 0;
		right: 20px;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: space-around;
	}

	.unit-list.top {
		top: 130px;
	}

	.unit-list.bottom {
		bottom: 60px;
	}

	.unit-list>li {
		justify-content: space-around;
		display: inline-block;
		list-style: none;
		width: 160px;
		height: 190px;
		background: url("./img/main-1.png") no-repeat;
		background-size: 100% 100%;
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		color: #00fcf9;
		padding-top: 50px;
		opacity: 0.5;
	}

	.unit-list>li:hover,
	.unit-list>li.active {
		cursor: pointer;
		opacity: 1;
	}



	.main-box>.tongji {
		position: absolute;
		top: 0;
		left: 50%;
		width: 240px;
		height: 260px;
		padding-top: 100px;
		margin-left: -140px;
		background: url("./img/main-2.png") no-repeat;
		background-size: 100% 100%;
		z-index: 10;
	}

	.main-box>.tongji>div {
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		color: #00fcf9;
	}

	.group-tit {
		position: absolute;
		top: 3px;
		left: 0;
		width: 100%;
		font-weight: bold;
		text-align: center;
	}

	>>>.el-input__inner {
		background: transparent;
		color: #fff;
	}
</style>
<style>
	/* 发光字体 */
	.shadow-txt {
		color: #D0C5E3;
		text-shadow: 0 0 10px #0000FF, 0 0 20px #fff;
	}
</style>
