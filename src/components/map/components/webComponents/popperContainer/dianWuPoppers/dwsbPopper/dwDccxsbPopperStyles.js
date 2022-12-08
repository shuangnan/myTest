function imageLoader(imageUrl) {
	let imageBaseUrl = './dwsbPopperLogos/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/dwsbPopperLogos/' + imageUrl)
	console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

let commonStyles = {
	height: '85.3px',
	width: '73.7px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}

export default {
	dw_dccxsb: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('dw_dccxsb.png')}')`
	}
}
