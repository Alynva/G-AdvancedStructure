/** @param {String} structure */
function getNextGroup(structure) {
	let start = -1, end = -1

	/** @type {"[]"|"()"} */
	let type = null

	/** @type {String} */
	let value = null

	let skipping = 0
	for (let i = 0; i < structure.length; i++) {
		if (start >= 0 && end >= 0) {
			break
		} else if (type === null) {
			if (structure[i] === '[') {
				type = '[]'
				start = i
			} else if (structure[i] === '(') {
				type = '()'
				start = i
			}
		} else if (structure[i] === '[' || structure[i] === '(') {
			skipping++
		} else if (structure[i] === ']' || structure[i] === ')') {
			if (skipping) skipping--
			else if (type.endsWith(structure[i])) end = i
			else throw new Error(`Unexpected closing group character "${structure[i]}" at index ${i}, was expected "${type[1]}".`)
		}
	}

	if (start >= 0 && end >= 0) {
		value = structure.slice(start+1, end)
	}

	return { start, end, type, value }
}

module.exports = getNextGroup
