
function isEmpty(obj) {
	return !Object.keys(obj).find(o => {
		console.log('1', typeof obj[o], obj[o].trim && obj[o].trim().length, typeof obj[o] === 'string' && obj[o].trim().length > 0)
		if (typeof obj[o] === 'string' && obj[o].trim().length > 0){
			console.log('REturn 1')
			return true
		}
		else if (typeof obj[o] !== 'undefined'){
			console.log('REturn 2')
			return true
		}
		console.log('REturn 3')
		return false
	})
}

function removeEmptyObjects(arr) {
	return arr.filter(a => !isEmpty(a))
}