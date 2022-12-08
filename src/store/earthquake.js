export default {
    namespaced: true,
    state: {
        currentEarthquake: {},                      // 当前地震概况
        currentRenderingSection: {},                // 显示影响范围的区间
        currentEarthquakeEffectedLines: [],         // 全部受影响线别 [1]
        currentEarthquakeSubSections: [],           // 全部影响子区间 [2]
        currentEarthquakeStations: [],              // 全部受影响车站 [3]
        currentEarthquakeEffectedTrains: [],        // 全部受影响列车 [4]
        currentEarthquakeInfo: {},                  // 地震信息 [5]
        currentEarthquakeIncomingTrains: [],        // 全部将行至影像区域列车 [6]
        currentEarthquakeEffectedSections: [],      // 全部受影响区间和区间中受影响车型统计(区间首尾合并) [7]
        currentEarthquakeEffectedTrainsBrief: [],   // 全部受影响车型统计 [8]
        reports: [],                                // 速报信息
        hidePanelOverRide: false,                   // 强制隐藏地震相应模块
        stopAutoScroll: false,                      // 人工操作使轮播停止
        lineTrainPlans: [],                         // 轨道车开行计划
        updateCount: 0,                             // 大屏更新消息接收次数
        detailLineTrainPlan: [],                    // 巡线车信息
        reportEffectedBrief: {},                    // 站段上报速报统计
        ddsCommandList: [],                         // 调度命令
        emergencySource: {},                        // 应急资源统计结果
        earthquakeReports: [],                      // 应急速报列表
        emergencyContacts: [],                      // 应急抢险通讯录
        effectedTrainsDiff: [],                     // 影响列车对比
        checkTrainsCount: {},                       //
        eqList: [],
    },
    mutations: {
        updateCurrentEarthquake(state, earthquake) {
            state.currentEarthquake = JSON.parse(JSON.stringify(earthquake))
        },
        updateEqList(state, eqs) {
          state.eqList = eqs
        },
        updateCurrentEarthquakeInfo(state, data) {
            state.currentEarthquakeEffectedLines = JSON.parse(JSON.stringify(data['1']))
            state.currentEarthquakeSubSections = JSON.parse(JSON.stringify(data['2']))
            state.currentEarthquakeStations = JSON.parse(JSON.stringify(data['3']))
            state.currentEarthquakeEffectedTrains = JSON.parse(JSON.stringify(data['4']))
            state.currentEarthquakeInfo = JSON.parse(JSON.stringify(data['5']))[0]
            state.currentEarthquakeIncomingTrains = JSON.parse(JSON.stringify(data['6']))
            state.currentEarthquakeEffectedSections = JSON.parse(JSON.stringify(data['7']))
            state.currentEarthquakeEffectedTrainsBrief = JSON.parse(JSON.stringify(data['8']))
        },
        updateHidePanelOverRide(state, status) {
            state.hidePanelOverRide = status
        },
        updateCurrentRenderingSection(state, section) {
            state.currentRenderingSection = section
        },
        updateReports(state, reports) {
            console.log('更新速报', reports)
            state.reports = reports['1']
            state.reportEffectedBrief = reports['2'][0]
            state.ddsCommandList = reports['3']
            state.checkTrainsCount = reports['4'][0]
        },
        updateStopAutoScroll(state, auto) {
            state.stopAutoScroll = auto
        },
        updateLineTrainPlans(state, plans) {
            state.lineTrainPlans = plans
        },
        updateCount(state) {
            state.updateCount++
        },
        updateTrainInfo(state, trainInfo) {
            // console.log('9010Payload', trainInfo)
            state.currentEarthquakeEffectedTrains = JSON.parse(JSON.stringify(trainInfo[0]))
            state.currentEarthquakeEffectedSections = JSON.parse(JSON.stringify(trainInfo[1]))
            state.currentEarthquakeEffectedTrainsBrief = JSON.parse(JSON.stringify(trainInfo[2]))
        },
        updateDetailLineTrainPlans(state, trains) {
            state.detailLineTrainPlan = trains
        },
        updateEmergencySources(state, source) {
            state.emergencySource = source
        },
        updateEarthquakeReports(state, source) {
            state.earthquakeReports = source
        },
        updateEmergencyContacts(state, payload) {
            state.emergencyContacts = payload
        },
        updateEffectedTrainsDiff(state, payload) {
            state.effectedTrainsDiff = payload
        },
        reset(state) {
            state.currentEarthquake = {}
            state.currentRenderingSection = {}
            state.currentEarthquakeEffectedLines = []
            state.currentEarthquakeSubSections = []
            state.currentEarthquakeStations = []
            state.currentEarthquakeEffectedTrains = []
            state.currentEarthquakeInfo = {}
            state.currentEarthquakeIncomingTrains = []
            state.currentEarthquakeEffectedSections = []
            state.currentEarthquakeEffectedTrainsBrief = []
            state.reports = []
            state.hidePanelOverRide = false
            state.stopAutoScroll = false
            state.lineTrainPlans = []
            state.updateCount = 0
            state.detailLineTrainPlan = []
            state.reportEffectedBrief = {}
            state.ddsCommandList = []
            state.earthquakeReports = []
            state.emergencyContacts = []
            state.effectedTrainsDiff = []
        }
    }
}
