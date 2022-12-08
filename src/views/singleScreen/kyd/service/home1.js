import c from "../../../../assets/com.js";
export default {
    //获取餐售统计
    getCSTJ(p) {
        p.module = "execute"
        p.c = "kydp_zxy8011"
        return c.getPromiseData(p)
    },
    //获取保洁考核数据
    getBJKH(p){
        p.module = "execute"
        p.c = "kydp_zxy8015"
        return c.getPromiseData(p)
    },
    //获取保洁表格数据
    getBJDataTBList(p){
        p.module = "execute"
        p.c = "kyd_in_out_179"
        return c.getPromiseData(p)
    },
    //获取车长信息
    getCZInfo(p){
        p.module = "execute"
        p.c = "kydp_zxy2030"
        return c.getPromiseData(p)
    },
    //获取正晚点列车
    getZWDInfo(p){
        p.module = "execute"
        p.c = "kydp_zxy2006"
        return c.getPromiseData(p)
    },
    //获取车站字典
	getCzzd(p) {
		p.module = "execute"
		p.c = "zwdms_wangyy2001"
		return c.getPromiseData(p)
    },
    //获取保洁打分
	getCL3BJ(p) {
		p.module = "execute"
		p.c = "kydp_zxy8009"
		return c.getPromiseData(p)
    },
    //获取保洁打分
	getCL3BP(p) {
		p.module = "execute"
		p.c = "kydp_zxy8010"
		return c.getPromiseData(p)
    },
    getCL2(p){
        p.module = "execute"
		p.c = "kydp_zxy9003"
		return c.getPromiseData(p)
    },
    getCL1(p){
        p.module = "execute"
		p.c = "kydp_zxy2005"
		return c.getPromiseData(p)
    },
    getCR42(p){
        p.module = "execute";
        p.c = "kydp_zxy2034";
		return c.getPromiseData(p)
    },
    getCR11(p){
        p.module = "execute"
		p.c = "kydp_zxy8017"
		return c.getPromiseData(p)
    },
    getCR12(p){
        p.module = "execute"
		p.c = "kydp_zxy8018"
		return c.getPromiseData(p)
    },
    getCR41(p){
        p.module = "execute"
		p.c = "kydp_zxy8019"
		return c.getPromiseData(p)
    },
    getHOME1(p){
        p.module = "execute"
		p.c = "kydp_zxy2045"
		return c.getPromiseData(p)
    },
    getTrainNum(p){
        p.module = "execute"
		p.c = "kydp_zxy2064"
		return c.getPromiseData(p)
    },
}