/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-20 08:41:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-15 09:25:05
 * @FilePath: \JFLCMS_MAP\src\components\map\components\webComponents\markerContainer\keYunMarkers\keYunMarkerStyles.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function imageLoader(imageUrl) {
	let imageBaseUrl = './keYunMarkerImgs/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/keYunMarkerImgs/' + imageUrl)
	// console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

const isPolice = window.location.pathname.includes("/police.html")
let commonStyles =  isPolice?{
	height: '10px',
	width: '10px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}: {
	height: '30px',
	width: '30px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}

export default {
	ky_sb_yl: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('ky_sb_yl.png')}')`
	},
	ky_sb_xf: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('ky_sb_xf.png')}')`
	},
	ky_sb_pcs: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('ky_sb_pcs.png')}')`
	},
	// 地方派出所
	ky_sb_local_pcs: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('logo.png')}')`
	},
	ky_sb_yjys: {
		height: '35px',
		width: '30px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('ky_sb_yjys.png')}')`
	},
	ky_sb_fdwz: {
		height: '35px',
		width: '30px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('ky_sb_fdwz.png')}')`
	},
	ky_sb_yjsscs: isPolice?{
		height: '12px',
		width: '10px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('ky_sb_yjsscs.png')}')`
	}:{
		height: '35px',
		width: '30px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('ky_sb_yjsscs.png')}')`
	}
}
