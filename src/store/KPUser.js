export default {
    namespaced: true,
    state: {
        data:{},
    },
    mutations: {
        //更改消息连接状态
        changeKPUserData(state, data) {
            state.data = data;
            //方法调用 this.$store.commit("KPUser/changeKPUserData",{}); 同步操作
            //值调用 this.$store.state.KPUser.data
        },
    },
    actions: {
        //更改消息连接状态
        changeKPUserData(context, data) {
            context.commit("changeKPUserData", data);
            //方法调用 this.$store.dispatch("KPUser/changeKPUserData",{}); 可以含有异步操作，例如行后台提交数据
            //值调用 this.$store.state.KPUser.data
        },
    }
}