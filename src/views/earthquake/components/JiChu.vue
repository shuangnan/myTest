<template>
  <div
    style="
								display: flex;
								flex-direction: column;
								align-items: center;
								margin-top: 20px;
								height: 100%;
								overflow-y: scroll;
							"
  >
    <div
      v-for="(event, index) in yjEvents"
      :key="index"
      class="yj-event"
      @click="handleYjEventClick(event)"
    >
      <div
        style="
										width: 122px;
										height: 112px;
										display: flex;
										align-items: center;
										align-content: center;
										justify-content: center;
									"
      >
        <div>
										<span class="yj-event-level">
											{{ event.levelstr }}
										</span>
        </div>
      </div>
      <div
        style="
										margin-top: 20px;
										height: 92px;
										width: calc(413px - 130px);
										display: flex;
										flex-direction: column;
									"
      >
        <div
          style="
											width: 100%;
											display: flex;
											flex-direction: row;
											align-content: center;
											align-items: center;
											justify-content: space-between;
										"
        >
          <div>
											<span
                        style="
													font-size: 20px;
													font-weight: bold;
													color: #00F6FF;
												"
                      >{{ event.xianming }}线</span
                      >
          </div>
          <div>
											<span
                        style="
													font-size: 14px;
													font-weight: bold;
													color: #00F6FF;
												"
                      >{{ event.zhanming }}</span
                      >
          </div>
          <div>
											<span style="font-size: 12px">{{
                          event.fssj
                                                    }}</span>
          </div>
        </div>
        <div style="color: #25AEEA">
          {{ event.gzlxstr }}
        </div>
        <div
          style="
											color: white;
											font-size: 12px;
											height: 40px;
											width: 283px;
											overflow-y: auto;
										"
        >
          {{ event.shijianBaogao }}
        </div>
      </div>
      <!--                <h1>{{ event.fssj }} / {{ event.levelstr }}</h1>-->
      <!--                <h3>{{ event.xianming }}线 / {{ event.zhanming }} / {{ event.gonglibiao }}</h3>-->
      <!--                <h4>{{ event.gzlxstr }}</h4>-->
      <!--                <h5>{{ event.shijianBaogao }}</h5>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "JiChu",
  computed: {
    yjEvents () {
      return this.$store.state.yjEventPush.events;
    },
  },
  methods: {
    handleYjEventClick ( e ) {
      this.$emit( 'yjClick', e )
    }
  }
}
</script>

<style scoped>
.yj-event {
  width:           413px;
  height:          112px;
  margin-bottom:   15px;
  background:      url("../img/yjEvent.png") no-repeat;
  background-size: 100% 100%;
  display:         flex;
}

.yj-event-level {
  font-size: 30px;
  color: #00f6ff;
  font-weight: bold;
  text-shadow: 0 0 7px #00f6ff;
}
</style>
