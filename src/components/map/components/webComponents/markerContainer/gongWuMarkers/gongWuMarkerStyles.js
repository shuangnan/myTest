function imageLoader(imageUrl) {
	let imageBaseUrl = './gongWuMarkerImgs/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/gongWuMarkerImgs/' + imageUrl)
	// console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

export default {
	'gw_slpc': {
		height: '30.3px',
		width: '26.7px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('gw_slpc.png')}')`
	},
	'gw_llxc': {
		height: '30.3px',
		width: '26.7px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('gw_llxc.png')}')`
	}
}
