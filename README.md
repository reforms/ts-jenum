# ts-jenum
TypeScript Enum like java.lang.Enum

# Installation
npm i ts-jenum

# Example in TypeScript
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