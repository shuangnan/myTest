export default {
	namespaced:true,
	state:{
		data:{
			logined:false,
			userName:"用户名"
		},
	},
	mutations:{
		updateUser(state,payload){
			var newUser = Object.assign(state.data,payload);
			window.sessionStorage.setItem("loginUser",JSON.stringify(newUser));
			state.data = newUser;
		}
	},
	actions:{
		updateUser({ commit },payload){
			commit("updateUser",payload);
		}
	}
}