<!--
 * @created：2022年9月21日
 * @author：	cpy
 * @version:	v1.0
 * @desc:		应急调度信息
 -->
<template>
  <div style="height: 100vh; width: 100vw; display: flex; flex-direction: column" class="b-lay">
    <div class="log"></div>
    <div class="main-container">
      <div class="command-container">
        <div class="area-title">
          <span>值班人员信息</span>
        </div>
        <div class="dd-commands">
          <div style="width: 85%; margin-top: 10px" class="dd-command-search">
            <el-input v-model="str" style="width: 100%" size="mini" placeholder="请输入单位|人名查询" @change="filterAllPersons">
              <i slot="suffix" class="el-icon-search el-input__icon"></i>
            </el-input>
          </div>
          <div class="commands" id="ddCommandContainer" @mouseover="clearDdCommandAutoScroll" @mouseout="setDdCommandAutoScroll">
            <div
              v-for="(person, index) in allPersons_real"
              :key="index" class="command-card">
              <div class="command-brief">
                <span style="font-size: 20px; font-weight: bold">{{ person.DUTY_MAN }}</span>
              </div>
              <div class="command-content" :title="person.O_NAME+'-'+person.GZ+'\n'+person.DUTY_PHONE">
                <div><i class="el-icon-star-on"></i>{{person.O_NAME}}-{{person.GZ}}</div>
                <div><i class="el-icon-phone"></i>{{person.DUTY_PHONE}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-container">
        <div class="area-title">
          <span>值班人员统计</span>
        </div>
        <div class="infos">
          <div class="urge-level">
            <div class="urge-level-circle">
              <span>三级</span>
            </div>
          </div>
          <div class="top-staff-list">
            <div class="unit-button" v-for="(unit, index) in allUnits1" :key="index" @click="chooseUnit(unit)" :class="{
              active: curUnit.O_ID === unit.O_ID
            }" @mouseover="clearCenterStaffAutoScroll" @mouseout="setCenterStaffAutoScroll">
              <div>{{ unit.O_NAME }}</div>
              <div>{{ unit.PERSONS.length }}人</div>
            </div>
          </div>
          <div class="center-staffs">
            <div class="current-unit-staffs">
              <div class="person-cards">
                <div class="person-card" v-for="(person, index) in curUnit.PERSONS" :key="index" :title="person.GZ+'-'+person.DUTY_MAN">
                  <p>{{ person.GZ }} - {{ person.DUTY_MAN }}</p>
                </div>
              </div>
              <div class="cur-unit-name" :title="curUnit.O_NAME">
                <p>{{ curUnit.O_NAME }}</p>
              </div>
            </div>
            <div class="all-staff-count">
              <div>总人数</div>
              <div>{{ allPersons.length }}人</div>
            </div>
            <div class="all-unit-staffs">
              <div class="all-unit-name">
                <span>全部</span>
              </div>
              <div class="person-cards" id="allPersonCards" @mouseover="clearAllPersonCardsAutoScroll" @mouseout="setAllPersonCardsAutoScroll">
                <div class="person-card" v-for="(person, index) in allPersons" :key="index" :title="person.GZ+'-'+person.DUTY_MAN">
                  <p>{{ person.GZ }} - {{ person.DUTY_MAN }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="top-staff-list">
            <div class="unit-button" v-for="(unit, index) in allUnits2" :key="index" @click="chooseUnit(unit)" :class="{
              active: curUnit.O_ID === unit.O_ID
            }" @mouseover="clearCenterStaffAutoScroll" @mouseout="setCenterStaffAutoScroll">
              <div>{{ unit.O_NAME }}</div>
              <div>{{ unit.PERSONS.length }}人</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import C from "../../../assets/com.js";

export default {
  data () {
    return {
      str: "",
      allPersons_real: [],
      allPersons: [],
      allUnits1: [],
      allUnits2: [],
      curUnit: {
        PERSONS: []
      },
      ddCommandAutoScroll: null,
      centerStaffAutoScroll: null,
      autoScrollUnitIndex: 0,
      allPersonContainerAutoScroll: null
    }
  },
  components: {},
  created () {
  },
  mounted () {
    this.getAllPersons();
    this.setDdCommandAutoScroll();
    this.setCenterStaffAutoScroll();
    this.setAllPersonCardsAutoScroll();
  },
  methods: {
    filterAllPersons ( str ) {
      if (str === "") {
        this.allPersons_real = this.allPersons;
      } else {
        this.allPersons_real = this.allPersons.filter( v => v.DUTY_MAN.indexOf( str ) > - 1 || v.O_NAME.indexOf( str ) > - 1 );
      }
    },
    chooseUnit ( unit ) {
      this.curUnit = unit;
    },
    getAllPersons () {
      C.getDataP123( {
        c: "eqeh_zxy2061",
        a: "【eqeh_zxy2061】获取地震影响范围",
        url: "https://10.192.126.203/GeneralProServlet", //接口地址
      }, r => {
        this.allPersons = r["1"];
        this.allUnits1 = r["2"].slice( 0, 7 );
        this.allUnits2 = r["2"].slice( 7 );
        this.filterAllPersons( "" );
        this.chooseUnit( this.allUnits1[0] );
      } )
    },
    setDdCommandAutoScroll() {
      let container = document.getElementById('ddCommandContainer')
      this.ddCommandAutoScroll = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0
        } else {
          container.scrollTo({
            top: container.scrollTop + 2,
            behavior: 'smooth'
          })
        }
      }, 100)
    },
    clearDdCommandAutoScroll() {
      clearInterval(this.ddCommandAutoScroll)
    },
    setCenterStaffAutoScroll() {
      this.centerStaffAutoScroll = setInterval(() => {
        this.autoScrollUnitIndex++
        let allUnitsLength = this.allUnits1.length + this.allUnits2.length
        if (this.autoScrollUnitIndex > allUnitsLength) {
          this.autoScrollUnitIndex = 0
        }
        if (this.autoScrollUnitIndex < this.allUnits1.length) {
          this.chooseUnit(this.allUnits1[this.autoScrollUnitIndex])
        } else {
          let realIndex = this.autoScrollUnitIndex - this.allUnits1.length
          this.chooseUnit(this.allUnits2[realIndex])
        }
      }, 1500)
    },
    clearCenterStaffAutoScroll() {
      clearInterval(this.centerStaffAutoScroll)
    },
    setAllPersonCardsAutoScroll() {
      let container = document.getElementById('allPersonCards')
      this.allPersonContainerAutoScroll = setInterval(() => {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          container.scrollTop = 0
        } else {
          container.scrollTo({
            top: container.scrollTop + 2,
            behavior: 'smooth'
          })
        }
      }, 100)
    },
    clearAllPersonCardsAutoScroll() {
      clearInterval(this.allPersonContainerAutoScroll)
    }
  }
}
</script>

<style scoped="scoped">
.b-lay {
  position:              relative;
  width:                 100%;
  height:                100%;
  overflow:              hidden;
  background:            url("../yjddInfo/img/bg-new.png");
  background-size:       150% 150%;
  color: white;
}

.log {
  width:           1920px;
  height:          72px;
  background:      url("./img/logo-new.png") no-repeat;
  background-size: 100% 100%;
}

.main-container {
  width:           100%;
  height:          auto;
  display:         flex;
  flex-direction:  row;
  align-content:   center;
  align-items:     center;
  justify-content: flex-start;
  margin-top:      10px;
}

.info-container {
  background:      url("./img/bg-main.svg") no-repeat;
  height:          910.1px;
  width:           1435.75px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
}

.command-container {
  background:      url("./img/bg-left.svg") no-repeat;
  height:          910.1px;
  width:           410.4px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
  margin-left: 60px;
}

.area-title {
  width:           100%;
  height:          22px;
  display:         flex;
  align-content:   center;
  align-items:     center;
  justify-content: center;
  margin-top:      5px;
}

.area-title > span {
  font-weight: bold;
}

.infos {
  height:          calc(100% - 22px);
  width:           100%;
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
  padding-left: 50px;
  padding-right: 50px;
}

.urge-level {
  background: url("./img/level-new.png") no-repeat;
  width: 277px;
  height: 115px;
  background-size: 100% 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.urge-level-circle {
  background: url("./img/level1.png") no-repeat;
  width: 130px;
  height: 130px;
  background-size: 100% 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.top-staff-list {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-around;
}

.center-staffs {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 40px;
}

.all-staff-count {
  background: url("./img/main-2.png") no-repeat;
  width: 262px;
  height: 284px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  z-index: 6;
}

.all-staff-count > div {
  font-size: 24px;
  font-weight: bold;
  color: #00fcf9;
}

.current-unit-staffs {
  background: rgba(14, 78, 136, .6);
  border-radius: 20px;
  height: 140px;
  width: 540px;
  margin-right: -40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}

.person-cards {
  height: 90%;
  width: 450px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  justify-content: flex-start;
  padding: 10px;
  overflow-y: scroll;
}

.person-card {
  background: url("./img/main-3.png") no-repeat;
  width: 118px;
  height: 27px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 10px;
}

.person-card > p {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.cur-unit-name {
  background: #0D1831;
  width: 150px;
  height: 60px;
  border-radius: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  padding-left: 15px;
  padding-right: 35px;
}

.cur-unit-name > p {
  font-size: 18px;
  font-weight: bold;
  color: #00fcf9;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.all-unit-staffs {
  background: rgba(14, 78, 136, .6);
  border-radius: 20px;
  height: 140px;
  width: 540px;
  margin-left: -40px;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
}

.all-unit-name {
  background: #0D1831;
  width: 150px;
  height: 60px;
  border-radius: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: flex-end;
  padding-right: 15px;
}

.all-unit-name > span {
  font-size: 18px;
  font-weight: bold;
  color: #00fcf9;
}

.unit-button {
  background: url("./img/main-1.png") no-repeat;
  width: 145.8px;
  height: 166.2px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  cursor: pointer;
}

.unit-button.active {
  opacity: 1;
}

.unit-button > div {
  font-size: 20px;
  font-weight: bold;
  color: #00fcf9;
  opacity: 0.5;
}

.unit-button.active > div {
  opacity: 1;
}

.urge-level-circle > span {
  font-size: 24px;
  font-weight: bold;
}

.center-info {
  height:          100%;
  width:           50%;
  display:         flex;
  flex-direction:  column;
  align-content:   center;
  align-items:     center;
  justify-content: flex-start;
}

.earthquake-effect-title {
  height:          26px;
  width:           381px;
  background:      url("../../../components/map/components/EarthquakeView/imgs/SplitLine2.png") no-repeat;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  row;
  align-items:     center;
  align-content:   center;
  justify-content: center;
}

.earthquake-effect-title > span {
  text-shadow: 0 0 .05em, 0 0 .1em;
  font-weight: bold;
  font-size:   16px;
}

.report-container {
  width:      85%;
  height:     calc(100% - 30px - 26px - 30px - 40px);
  margin-top: 30px;
  overflow-y: scroll;
  padding:    30px 30px 60px;
}

.dd-commands {
  width:           100%;
  height:          calc(100% - 22px);
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
}

.commands {
  width:           100%;
  height:          calc(100% - 45 - 20px);
  margin-top:      7px;
  overflow-y:      scroll;
  display:         flex;
  flex-direction:  column;
  align-content:   center;
  align-items:     center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.command-card {
  background:      url("./img/left-1.png") no-repeat;
  height:          71px;
  width:           358px;
  background-size: 100% 100%;
  display:         flex;
  flex-direction:  row;
  align-items:     center;
  align-content:   center;
  justify-content: flex-start;
  margin-top:      15px;
}

.command-brief {
  height:          100%;
  width:           47%;
  display:         flex;
  flex-direction:  column;
  align-content:   center;
  align-items:     center;
  justify-content: center;
}

.command-content {
  height:             100%;
  width:              53%;
  padding:            5px;
  word-break:         break-all;
  text-overflow:      ellipsis;
  display:            -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow:           hidden;
  word-wrap:          break-word;
}

.command-no {
  border-radius:   30px;
  border:          1px solid #4EABF8;
  background:      #163156;
  display:         flex;
  align-items:     center;
  align-content:   center;
  justify-content: center;
  padding:         5px;
}

.command-no > span {
  color:       #4EABF8;
  font-weight: bold;
}

>>> .el-input-group__prepend {
  background: transparent;
}

>>> .el-input__inner {
  background: transparent;
  color:      #FFF;
}

::-webkit-scrollbar {
  display: none;
}

</style>
<style>
/* 发光字体 */
.shadow-txt {
  color:       #D0C5E3;
  text-shadow: 0 0 10px #0000FF, 0 0 20px #FFF;
}
</style>

