# ts-jenum
* TypeScript Enum like java.lang.Enum
    * EnumType
    * Enum
* Powerful tool to comfortable work with plain json struct like enum 
    * EnumTools

# Installation
npm i ts-jenum

# Example in TypeScript
## TypeScript Enum like java.lang.Enum
```typescript
import {Enum, EnumType} from "ts-jenum";

@Enum("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State(1, "New");
    static readonly ACTIVE = new State(2, "Active");
    static readonly BLOCKED = new State(3, "Blocked");

    private constructor(readonly code: number, readonly text: string) {
        super();
    }
}

// Usage example
console.log("" + State.ACTIVE);        // "Active"
console.log("" + State.BLOCKED);       // "Blocked"
console.log(State.values());           // [State.NEW, State.ACTIVE, State.BLOCKED]
console.log(State.valueOf("New"));     // State.NEW
State.valueOf("Unknown")               // throw Error(...)
console.log(State.valueByName("NEW")); // State.NEW
console.log(State.ACTIVE.enumName);    // ACTIVE

const first = state => state.code === 1;
console.log(State.find("New"));        // State.NEW
console.log(State.find(first));        // State.NEW
console.log(State.find("Unknown"));    // null
const last = state => state.code === 3;
console.log(State.filter(last))        // [State.BLOCKED]
console.log(State.keys())              // ["NEW", "ACTIVE", "BLOCKED"]

// be "NEW" | "ACTIVE" | "BLOCKED"
type StateNameUnion = EnumConstNames<typeof State>;

```
## EnumTools powerful tool to comfortable work with plain json struct like enum
```typescript
import {EnumTools} from "ts-jenum";
// plain json like enum
const Colors = {
    WHITE: "#FFFFFF",
    GRAY: "#808080",
    BLACK: "#000000"
};

// to be ["WHITE", "GRAY", "BLACK"]
const keys = EnumTools.keys(Colors);

// to be ["#FFFFFF", "#808080", "#000000"]
const values = EnumTools.values(Colors);

/**
 * to be {
 *    "#FFFFFF": "WHITE",
 *    "#808080": "GRAY",
 *    "#000000": "BLACK"
 * };
 */
const rStruct = EnumTools.reverse(Colors);

/**
 * to be: [
 *  {key: "WHITE", value: "#FFFFFF"},
 *  {key: "GRAY", value: "#808080"},
 *  {key: "BLACK", value: "#000000"}
 * ]
 */
const pairs = EnumTools.pairs(Colors);

/**
 * To be class like:
 * @Enum<ColorEnum>("key")
 * class ColorEnum extends EnumType<ColorEnum>() {
 *    static readonly WHITE = new ColorEnum("WHITE", "#FFFFFF");
 *    static readonly GRAY = new ColorEnum("GRAY", "#808080");
 *    static readonly BLACK = new ColorEnum("BLACK", "#000000");
 *    private constructor(readonly key: string, readonly value: string | number) {
 *        super();
 *    }
 * }
 * ColorEnum has all IDE hint for developer, type checking and type safety
 */
const ColorEnum = EnumTools.toClass(Colors);

```

Details. Type safety.
In example above, you can write "tExt" or "txt" instead of "text" as @Enum decorator argument and no exception happen. In example below this problem is absent. Add an expression &lt;State&gt; to @Enum decorator

```typescript
import {Enum, EnumConstNames, EnumType} from "ts-jenum";

@Enum<State>("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State(1, "New");
    static readonly ACTIVE = new State(2, "Active");
    static readonly BLOCKED = new State(3, "Blocked");

    private constructor(readonly code: number, readonly text: string) {
        super();
    }
}
// Get Enum Names
// be "NEW" | "ACTIVE" | "BLOCKED"
type StateNameUnion = EnumConstNames<typeof State>;
```

Powerful typing.

```typescript
@Enum<Person>("id")
class Person<IdType extends 1 | 2 = 1 | 2, 
             NameType extends "Ivan" | "John" = "Ivan" | "John"
            > extends EnumType<Person>() {

    static readonly IVAN = new Person(1 as const, "Ivan" as const);
    static readonly JOHN = new Person(2 as const, "John" as const);

    private constructor(readonly id: IdType, readonly name: NameType) {
        super();
    }

    static doSomeWork(): void {
        // type to be: "Ivan". Not string!
        const name = Person.IVAN.name;
        // to be: error
        // if (name === "cat") 
        //     ^ This condition will always return 'false' since the types '"Ivan"' and '"cat"' have no overlap.

        // type to be: 1. Not number!
        const id = Person.IVAN.id;
        // to be: error
        // if (id === 3) 
        //     ^ This condition will always return 'false' since the types '1' and '3' have no overlap
    }
}
```