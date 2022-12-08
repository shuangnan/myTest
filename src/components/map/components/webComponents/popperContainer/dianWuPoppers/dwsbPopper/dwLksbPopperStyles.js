function imageLoader(imageUrl) {
	let imageBaseUrl = './dwsbPopperLogos/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/dwsbPopperLogos/' + imageUrl)
	// console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

let commonStyles = {
	height: '64px',
	width: '55px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}

export default {
	dw_lksb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('dw_lksb.png')}')`
	}
}
