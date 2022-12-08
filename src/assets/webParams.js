/*
 * @Author: LC
 * @Date: 2022-06-24 15:09:55
 * @LastEditors: [LC]
 * @LastEditTime: 2022-10-31 10:29:57
 * @Description:
 */
import store from '../store'
import C from './com.js'
export default {
	ssoaDecode(ssoa, sys) {
		// debugger
		// 应急专用
		if (sys === "yjgl") {
			return new Promise((resolve, reject) => {
				C.getData({
					c: 'ssat_wangyy9001',
					s: {
						"client": "yjgl",
						"urlEncode": ssoa
					},
					url: 'https://10.192.126.203/GeneralProServlet',
					a: '获取权限',
					async: false
				}, (r) => {
					// debugger
					let userData = JSON.parse(r.data)
					let ssoaCorrect = r.result
					console.log('WEBSSOA', r.data[0], ssoaCorrect)
					if (ssoaCorrect) {
						// debugger
						if (r.data[0] === '[') {
							resolve(userData[0])
						} else {
							resolve(userData)
						}
						// resolve(userData[0])
					} else {
						reject(false)
					}
				})
			});
		}else{
			return new Promise((resolve, reject) => {
				C.getData({
					c: 'trdm_lv_653',
					s: [ssoa],
					a: '获取权限',
					async: false
				}, (r) => {
					let userData = JSON.parse(r.data)
					let ssoaCorrect = r.result
					if (ssoaCorrect) {
						resolve(userData)
					} else {
						reject(false)
					}
				})
			})
		}
	},
	init() {
		return new Promise((resolve, reject) => {
			let params = C.getUrlParam(); //获取url参数
			// var role = false;

			if (params.SSOA) {
				this.ssoaDecode(params.SSOA, params.sys).then((user) => {
					for (let i in user) {
						params[i] = user[i]
					}
					store.commit('updateParams', params)
					resolve()
				}).catch(() => {
					document.body.innerHTML = "非法访问";
					reject()
				})
			} else {
				store.commit('updateParams', params)
				resolve()
			}
		})

		// if (params.SSOA) {
		// 	C.getData({
		// 		c: "kydp_zxy8021",
		// 		s: [params.SSOA],
		// 		url: "https://10.192.34.79/ky203/GeneralProServlet",
		// 		a: "获取权限",
		// 		async: false,
		// 	}, (r) => {
		// 		r = JSON.parse(r.data);
		// 		role = r.result;
		// 		if (role) {
		// 			let pp = JSON.parse(r.data);
		// 			for (var i in pp) {
		// 				params[i] = pp[i];
		// 			}
		// 		}
		// 	});
		// } else {
		// 	role = true;
		// }
		// if (!role) {
		// 	document.body.innerHTML = "非法访问";
		// }
		// //在这将整个系统公用的数据存入store
		// store.commit("updateParams", params);
		// return role;
	}
}
