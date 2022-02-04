# G-ComplexStructure
Utility function to allow read more complex packet in one go

## How-to

1. Install the project:

```sh
npm i Alynva/G-ComplexStructure
```

2. Add this code to your script:

```javascript
const { HPacket } = require('gnode-api')
require('G-ComplexStructure')(HPacket)
```

3. Read packets with the new `readComplex` method passing the structure pattern:

```javascript
const packet = message.getPacket()
console.log(packet.readComplex("i[iS]"))
```

## Structures pattern

### Loop

You can read a loop using this:

```
i[<structure-to-read-inside-the-loop>]
```

The first `i` represents the length of the loop, and inside the `[]` you can add the structure to be read for each iteration.

### Conditional

It's possible to read data based on the last field using this:

```
i(=<value>)[<structure-to-read-inside-the-loop>]
```

The first `i` represents the field that we are checking, inside the `()` you define the condition, the `<value>` represents the value that must be, in that case, equal to the first field and inside the `[]` you can add the structure to be read if that condition is true.

For now, its only possible to check integers (`i`), others can be added if needed.

There are multiple operators to let you define the condition, others can be added if needed, but probably the only really useful is the bitwise (more about it bellow):

- `=`: equal operator
- `<`: minor than
- `>`: greater than
- `%`: [remainder](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder)
- `&`: [bitwise and](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND)

It's possible to chain multiple conditionals, link this:

```
i(=1)[iS](=2)[iSS](=3)[SS]
```

#### Bitwise operators

Some times data is sent depending on one number, that represents some binary flags. For example:

- 0 (decimal) => 0000 (binary) => no flags on
- 1 (decimal) => 0001 (binary) => first flag on
- 2 (decimal) => 0010 (binary) => second flag on
- 3 (decimal) => 0011 (binary) => first and second flag on
- 5 (decimal) => 0101 (binary) => first and third flag on

To check that cases, we use the [bitwise AND operator (`&`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND), like this:

```js
const received_flag = 5
const conditional_case = 1

if (received_flag & conditional_case) {
  console.log("The first flag is on!")
}
```

In your structure, you can check that using this:

```
i(&1)[SSii]
```