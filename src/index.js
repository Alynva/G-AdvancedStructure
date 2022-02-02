function readAdvanced(structure, defaultReader) {
	if (/[^bisuldfBS\[\]\(\)-\d=<>%&]/g.test(structure) || structure === "")
		throw new Error("Invalid structure string");
		
	if (/^[bisuldfBS]+$/g.test(structure))
		return defaultReader(structure)

	const result = []
	
	for (let i = 0; i < structure.length; i++) {
		const char = structure[i]
		let nextGroup, groupData
		
		switch (char) {
			// default data
			case "b":
			case "i":
			case "s":
			case "u":
			case "l":
			case "d":
			case "f":
			case "B":
			case "S":
				const reResult = /^[bisuldfBS]+/g.exec(structure.slice(i))
				const basicStructure = reResult[0]
				result.push(...defaultReader(basicStructure))

				i += basicStructure.length - 1
				break;

				
			// loop structure
			case "[":
				if (structure[i - 1] !== 'i')
					throw new Error("Invalid loop structure string at index "+i+", before the loop, it must read the size of the array")

				const size = result[result.length - 1]

				nextGroup = getNextGroup(structure.slice(i))

				groupData = []
				for (let j = 0; j < size; j++)
					groupData.push(readAdvanced(nextGroup.value, defaultReader))
				result.push(groupData)
				
				i += nextGroup.end
				break;
				
				
			// conditional strucutre
			case "(":
				if (!['i'].includes(structure[i - 1]))
					throw new Error(`Invalid conditional structure string at index ${i}, before the loop, it must be an integer. Structure: '${structure}'. Starting at: '${structure.slice(i)}'`)

				const type = structure[i - 1]
				const value = result[result.length - 1]
				
				do {
					nextGroup = getNextGroup(structure.slice(i))

					const operator = nextGroup.value[0]

					if (!['=', '<', '>', '%', '&'].includes(operator))
						throw new Error(`Invalid conditional operator at index ${i}. Condition: '${nextGroup.value}'`)

					let expectedValue = nextGroup.value.slice(1)
					if (type === 'i') expectedValue = Number(expectedValue)

					i += nextGroup.end
					nextGroup = getNextGroup(structure.slice(i))
					
					const shouldRead = (operator === '=' && value === expectedValue)
						  			|| (operator === '<' && value < expectedValue)
						  			|| (operator === '>' && value > expectedValue)
						  			|| (operator === '%' && value % expectedValue)
						  			|| (operator === '&' && value & expectedValue)

					if (shouldRead) result.push(readAdvanced(nextGroup.value, defaultReader))

					i += nextGroup.end
				} while (structure[i+1] === '(')
					
				break;
				
				
				
			default:
				throw new Error("Invalid structure string at index "+i+": "+char)
		}
		
	}
	
	return result
}
	
function getNextGroup(structure) {
	let start = -1, end = -1, type = null, value = null

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

module.exports = readAdvanced