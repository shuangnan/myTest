function imageLoader(imageUrl) {
	let imageBaseUrl = './dianWuMarkerImgs/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/dianWuMarkerImgs/' + imageUrl)
	// console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

let commonStyles = {
	height: '30px',
	width: '30px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}

export default {
	dw_4g: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('dw_4g.png')}')`
	},
	dw_gdsb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('dw_gdsb.png')}')`
	},
	dw_lksb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('dw_lksb.png')}')`
	},
	dw_lksb_w: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('dw_lksb_w.png')}')`
	},
	dw_dccxsb: {
		height: '30.3px',
		width: '26.7px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('dw_dccxsb.png')}')`
	},
	dw_xhj: {
		height: '30.3px',
		width: '26.7px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('dw_xhj.png')}')`
	},
	dw_dx: {
		height: '30.3px',
		width: '26.7px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('dw_dx.png')}')`
	},
	dw_bpbl: {
		height: '30.3px',
		width: '26.7px',
		backgroundSize: '100% 100%',
		backgroundColor: 'none',
		backgroundRepeat: 'no-repeat',
		backgroundImage: `url('${imageLoader('dw_bpbl.png')}')`
	}
}
