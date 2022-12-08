import store from '../store'
import C from './com.js'
export default {
    init() {
        var KPloginUser = window.sessionStorage.getItem("KPloginUser");
        KPloginUser = KPloginUser ? JSON.parse(KPloginUser) : { logined: false };
        if (KPloginUser.logined) {
            C.getData({ c: "trdm_lv_316", s: [KPloginUser.name, KPloginUser.pass], a: "登录",async:false }, function (r) {
                store.commit("KPUser/changeKPUserData", r[0]);
            })
        } else {
            store.commit("KPUser/changeKPUserData", {});
        }

    }
}
