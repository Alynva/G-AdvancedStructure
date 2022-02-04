const { HPacket } = require('gnode-api')
require('G-ComplexStructure')(HPacket)

const p1 = new HPacket(1234)

const simpleStructure = "iiSSiiSiSiS"
let complexStructure = "iiSSi[iS]"
const rawData = [0, 1, "a", "b", 3, 0, "a", 1, "b", 2, "c"]

p1.append(simpleStructure, ...rawData)

console.log("===== Random Packet =====")
console.log("----- Packet data -----")
console.log(rawData)

console.log()
console.log("----- Packet content -----")
console.log(p1)

console.log()
console.log("----- Reading it -----")
console.log("_____ simple structure _____")
p1.resetReadIndex()
console.log({ simpleStructure })
console.log(p1.read(simpleStructure))

console.log()
console.log("_____ simple in complex method _____")
p1.resetReadIndex()
console.log({ simpleStructure })
console.log(p1.readComplex(simpleStructure))

console.log()
console.log("_____ complex structure _____")
p1.resetReadIndex()
console.log({ complexStructure })
console.log(p1.readComplex(complexStructure))

const p2 = new HPacket(1234)

const knownStructures = require('G-ComplexStructure/src/extra/knownStructures.json')
complexStructure = knownStructures['in:NewNavigatorSearchResults']
const complexRawData = ["query","disco-lee",1,"query","",2,false,0,3,[[80997887,"Deposito",7248438,"Disco-Lee",1,0,50,"",3,0,0,0,0,[],56],[13887443,"Disco-lee",9339814,":::Disco-lee::",0,0,25,"Disco-lee entrou no Hotel",2,91,0,0,0,[],40],[31697505,"Disco-Lee",16143083,"Wilshere",0,0,25,"",0,2,0,0,0,[],56]]].flat(4)
const simplifiedStructure = complexRawData
	.map(x => ({
		"string": "S",
		"number": "i",
		"boolean": "B",
	}[typeof x]))
	// .filter(x => typeof x !== 'undefined')
	.join("")

p2.append(simplifiedStructure, ...complexRawData)

console.log()
console.log("===== in:NewNavigatorSearchResults Packet =====")

console.log("----- Packet data -----")
console.log(complexRawData)

console.log()
console.log("----- Packet content -----")
console.log(p2)

console.log()
console.log("----- Reading it -----")
console.log("_____ simple structure _____")
p2.resetReadIndex()
console.log({ simplifiedStructure })
console.log(p2.read(simplifiedStructure))

console.log()
console.log("_____ complex structure _____")
p2.resetReadIndex()
console.log({ complexStructure })
console.log(p2.readComplex(complexStructure))
