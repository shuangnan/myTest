function imageLoader(imageUrl) {
	let imageBaseUrl = './kysbPopperLogos/'
	// console.log(require(imageBaseUrl + imageUrl))
	let img = require(__dirname + '/kysbPopperLogos/' + imageUrl)
	// console.log(img)
	return img
	// return require(imageBaseUrl + imageUrl)
}

let commonStyles = {
	height: '96px',
	width: '95px',
	backgroundSize: '100% 100%',
	backgroundColor: 'none',
	backgroundRepeat: 'no-repeat'
}

export default {
	ky_sb_yjsscs: {
		...commonStyles,
		backgroundImage: `url('${imageLoader('popper_ky_sb_yjsscs.png')}')`
	}
}
