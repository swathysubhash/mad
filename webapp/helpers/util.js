
import marked from 'marked'

export function isEmpty(val) {
	if (typeof val === 'string' && val.trim().length > 0){
			return true
		}
		else if (typeof val !== 'string' && typeof val !== 'undefined'){
			return true
		}
		return false
}

export function removeEmptyObjects(arr, keys) {
	return arr.filter(a => keys.find(k => isEmpty(a[k])))
}

export function renderMarkdown(md) {
	marked.setOptions({
		breaks: true,
	})
	return marked(md)
}