<template>
  <div class="container">
    <div class="title-container">
      <span>地方应急人员通讯录</span>
    </div>
    <div
      class="report-card-container scroll_parent_box"
      @mouseover="clearDdCommandAutoScroll"
      @mouseout="setDdCommandAutoScroll"
    >
      <div
        class="scroll_list"
        :style="{
					transform: `translate(0px, -${scrollTop}px)`
				}"
      >
        <div id="subCommandContainer">
          <div
            v-for="(person, index) in allPersons_real"
            class="scroll_item"
            :key="index"
            style="width: 100%; height: auto; display: flex; flex-direction: row; margin-bottom: 15px; padding-top: 15px; padding-bottom: 15px"
            :style="{
							backgroundColor:
								index % 2 === 0
									? 'rgba(23,61,134,0.3)'
									: 'rgba(17,45,81,0.3)'
						}"
          >
            <div
              style="width: 15%; display: flex; align-content: center; align-items: center; justify-content: center"
            >
							<span
                style="color: white; font-weight: bold; font-size: 45px"
              >{{ person.DUTY_MAN }}</span
              >
            </div>
            <div
              style="width: 40%; display: flex; align-content: center; align-items: center; justify-content: center"
            >
							<span
                style="color: white; font-weight: bold; font-size: 45px"
              >{{ person.O_NAME }}</span
              >
            </div>
            <div
              style="width: 25%; display: flex; align-content: center; align-items: center; justify-content: center"
            >
							<span
                style="color: white; font-weight: bold; font-size: 45px"
              >{{ person.DUTY_TEL }}</span
              >
            </div>
            <div
              style="width: 20%; display: flex; align-content: center; align-items: center; justify-content: center"
            >
							<span
                style="color: white; font-weight: bold; font-size: 45px"
              >{{ person.DUTY_PHONE }}</span
              >
            </div>
          </div>
        </div>
        <div v-html="copyHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
import C from "../../../assets/com.js";
import axios from "axios";

export default {
  data() {
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
      allPersonContainerAutoScroll: null,
      scrollTop: 0,
      scrollSpeed: 10,
      copyHtml: "",
      refreshTimer: null
    };
  },
  components: {},
  created() {},
  mounted() {
    this.getAllPersons();
    this.setAutoRefresh();
  },
  methods: {
    filterAllPersons(str) {
      if (str === "") {
        this.allPersons_real = this.allPersons;
      } else {
        this.allPersons_real = this.allPersons.filter(
          v =>
            v.DUTY_MAN.indexOf(str) > -1 ||
            v.O_NAME.indexOf(str) > -1
        );
      }
    },
    chooseUnit(unit) {
      this.curUnit = unit;
    },
    getAllPersons() {
      axios.get('http://10.3.102.111:8084/cdyjnew/jxfh/getCdLwtxlList').then((res) => {
        let data = res.data
      }).catch((err) => {
        this.$message.error(err)
      })
      
      C.getDataP123(
        {
          c: "eqeh_zxy2061",
          url: "https://10.192.126.203/GeneralProServlet" //接口地址
        },
        r => {
          this.allPersons = r["1"];
          this.allUnits1 = r["2"].slice(0, 7);
          this.allUnits2 = r["2"].slice(7);
          this.filterAllPersons("");
          this.chooseUnit(this.allUnits1[0]);
          console.log(this.allPersons);
          this.$nextTick(() => {
            this.copyHtml = document.getElementById(
              "subCommandContainer"
            ).innerHTML;
            // console.log(this.copyHtml);
            this.setDdCommandAutoScroll();
          });
        }
      );
    },
    scroll() {
      this.scrollTop++
      let scrollItemBox = document.getElementById("subCommandContainer").offsetHeight
      if (this.scrollTop >= scrollItemBox) {
        this.scrollTop = 0
      }
    },
    setAutoRefresh() {
      this.refreshTimer = setInterval(() => {
        this.getAllPersons()
      }, 60 * 1000)
    },
    setDdCommandAutoScroll() {
      if (this.ddCommandAutoScroll) {
        this.clearDdCommandAutoScroll()
      }
      this.ddCommandAutoScroll = setInterval(this.scroll, this.scrollSpeed)
      // let container = document.getElementById("subCommandContainer");
      // this.ddCommandAutoScroll = setInterval(() => {
      // 	this.scrollTop++;
      // 	if (this.scrollTop >= container.offsetHeight) {
      // 		this.scrollTop = 0;
      // 	}
      // 	// } else {
      // 	//   container.scrollTo( {
      // 	//     top: container.scrollTop + 2,
      // 	//     behavior: 'smooth'
      // 	//   } )
      // 	// }
      // }, this.scrollSpeed);
    },
    clearDdCommandAutoScroll() {
      clearInterval(this.ddCommandAutoScroll);
    },
    setCenterStaffAutoScroll() {
      this.centerStaffAutoScroll = setInterval(() => {
        this.autoScrollUnitIndex++;
        let allUnitsLength =
          this.allUnits1.length + this.allUnits2.length;
        if (this.autoScrollUnitIndex > allUnitsLength) {
          this.autoScrollUnitIndex = 0;
        }
        if (this.autoScrollUnitIndex < this.allUnits1.length) {
          this.chooseUnit(this.allUnits1[this.autoScrollUnitIndex]);
        } else {
          let realIndex =
            this.autoScrollUnitIndex - this.allUnits1.length;
          this.chooseUnit(this.allUnits2[realIndex]);
        }
      }, 1500);
    },
    clearCenterStaffAutoScroll() {
      clearInterval(this.centerStaffAutoScroll);
    },
    setAllPersonCardsAutoScroll() {
      let container = document.getElementById("allPersonCards");
      this.allPersonContainerAutoScroll = setInterval(() => {
        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight
        ) {
          container.scrollTop = 0;
        } else {
          container.scrollTo({
            top: container.scrollTop + 2,
            behavior: "smooth"
          });
        }
      }, 500);
    },
    clearAllPersonCardsAutoScroll() {
      clearInterval(this.allPersonContainerAutoScroll);
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  background: url("./img/bg-new.png") no-repeat;
  background-size: 100% 100%;
}

.title-container {
  width: 1797px;
  background: url("./img/title-bg.svg") no-repeat;
  height: 162px;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.title-container > span {
  color: white;
  font-weight: bold;
  font-size: 50px;
}

.report-card-container {
  height: calc(100% - 177px);
  width: 100%;
  overflow: hidden;
  margin-top: 15px;
  box-sizing: border-box;
}

.scroll_list {
  transition: all 0ms ease-in 0s;
}

.command-card {
  background: url("./img/left-1.png") no-repeat;
  height: 71px;
  width: 358px;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: flex-start;
  margin-top: 15px;
}

.command-brief {
  height: 100%;
  width: 47%;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.command-content {
  height: 100%;
  width: 53%;
  padding: 5px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-wrap: break-word;
}
</style>
