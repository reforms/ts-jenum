# ts-jenum
TypeScript Enum like java.lang.Enum

See example
```typescript
import {Enum, EnumType, IStaticEnum} from "ts-jenum";

@Enum("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State("New");
    static readonly ACTIVE = new State("Active");
    static readonly BLOCKED = new State("Blocked");

    private constructor(public text: string) {
        super();
    }
}

// Usage example
console.log("" + State.ACTIVE);        // Active
console.log("" + State.BLOCKED);       // Blocked
console.log(State.values());           // [State.NEW, State.ACTIVE, State.BLOCKED]
console.log(State.valueOf("New"));     // State.NEW
console.log(State.valueByName("NEW")); // State.NEW
console.log(State.ACTIVE.enumName);    // ACTIVE
```
