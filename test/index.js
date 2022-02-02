const readAdvanced = require('G-AdvancedStructure')

function read(structure) {
	if(typeof structure !== 'string') {
		throw new Error("Invalid argument(s) passed");
	}

	let result = [];

	for(let c of structure) {
		switch(c) {
			case 'b':
				result.push(this.readByte());
				break;
			case 'i':
				result.push(1);
				break;
			case 's':
				result.push(2);
				break;
			case 'u':
				result.push(3);
				break;
			case 'l':
				result.push(4);
				break;
			case 'd':
				result.push(5.1);
				break;
			case 'f':
				result.push(6.1);
				break;
			case 'B':
				result.push(false);
				break;
			case 'S':
				result.push("asd");
				break;
			default:
				throw new Error("Invalid structure string, '" + c + "' undefined");
		}
	}

	return result;
}

console.log(readAdvanced("iii[iiiSss]i(&2)[ii]", read))