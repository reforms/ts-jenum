# ts-jenum
TypeScript Enum like java.lang.Enum

See example
```typescript
import {Enum, EnumType} from "ts-jenum";

@Enum("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State(1, "New");
    static readonly ACTIVE = new State(2, "Active");
    static readonly BLOCKED = new State(3, "Blocked");

    private constructor(public code: number, public text: string) {
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

Details. Type safety.
In example above, you can write "tExt" or "txt" instead of "text" as @Enum decorator argument and no exception happen. In example below this problem is absent. Add an expression &lt;State&gt; to @Enum decorator

```typescript
import {Enum, EnumConstNames, EnumType} from "ts-jenum";

@Enum<State>("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State(1, "New");
    static readonly ACTIVE = new State(2, "Active");
    static readonly BLOCKED = new State(3, "Blocked");

    private constructor(public code: number, public text: string) {
        super();
    }
}
// Get Enum Names
// be "NEW" | "ACTIVE" | "BLOCKED"
type StateNameUnion = EnumConstNames<typeof State, State>;
```