export default {
	namespaced: true,
	state: {
		you1:'',
		you2:'',
		you3:'',
	},
	mutations: {
		setyou1(state,you1){
			state.you1=you1
			window.localStorage.setItem("you1",JSON.stringify(state.you1))
		},
		setyou2(state,you2){
			state.you2=you2
			window.localStorage.setItem("you2",JSON.stringify(state.you2))
		},
		setyou3(state,you3){
			state.you3=you3
			window.localStorage.setItem("you3",JSON.stringify(state.you3))
		}
	},
	actions: {
		
	}
}