/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-23 15:27:50
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\markerContainer\keYunMarkers\keYunMarkerStyles.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mapUtil from "../../../../js/mapUtil"
import configs from '../../../../js/config'
/**--------------------------------------初始化vm-----------------------------------------*/

const curZoom = configs.superMap.zoomGA;
console.log("curZoom:", curZoom)
function imageLoader(imageUrl) {
	let imageBaseUrl = './gongAnMarkerImgs/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/gongAnMarkerImgs/' + imageUrl)
	// console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

const isPolice = window.location.pathname.includes("/police.html")
let commonStyles = {
	height: '12px',
	width: '10px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}

export default {
	// 全部铁路派出所
	wu_pcs_tlpcs: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_tlpcs.png')}')`
	},
	// 全部地方派出所
	wu_pcs_dfpcs: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_dfpcs.png')}')`
	},
	// 派出所-进京
	wu_pcs_jjing: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_jjing.png')}')`
	},
	// 派出所-进疆
	wu_pcs_jjiang: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_jjiang.png')}')`
	},
	// 派出所-进藏
	wu_pcs_jzang: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_jzang.png')}')`
	},
	// 派出所-客运枢纽所
	wu_pcs_kysn: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_kysn.png')}')`
	},
	// 派出所-客运A类所
	wu_pcs_kya: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_kya.png')}')`
	},
	// 派出所-客运B类所
	wu_pcs_kyb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_kyb.png')}')`
	},
	// 派出所-客运C类所
	wu_pcs_kyc: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_kyc.png')}')`
	},
	// 派出所-线路A类所
	wu_pcs_linea: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_linea.png')}')`
	},
	// 派出所-线路B类所
	wu_pcs_lineb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_lineb.png')}')`
	},
	// 派出所-线路C类所
	wu_pcs_linec: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_linec.png')}')`
	},

	// 沿线机构-地方派出所
	wu_yxjg_dfpcs: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_pcs_dfpcs.png')}')`
	},

	// 沿线机构-医院
	wu_yxjg_hospital: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_yxjg_hospital.png')}')`
	},

	// 沿线机构-学校
	wu_yxjg_school: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_yxjg_school.png')}')`
	},
	// 沿线机构-铁路内部单位
	wu_yxjg_tlnb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_yxjg_tlnb.png')}')`
	},

	// 设施设备_桥梁 wu_sb_bridge
	wu_sb_bridge: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('wu_sb_bridge.png')}')`
	},

	// single-marker
	single_marker: {
		...commonStyles,
		height: '45px',
		width: '38px',
		backgroundImage: `url('${imageLoader('single_marker.png')}')`
	},




}
