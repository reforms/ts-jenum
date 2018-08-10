import {Enum, EnumType, IStaticEnum} from "./../ts/jenum";

@Enum("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State("New");
    static readonly ACTIVE = new State("Active");
    static readonly BLOCKED = new State("Blocked");

    private constructor(public text: string) {
        super();
    }
}

// Пример использования
window.console.log("" + State.ACTIVE);        // Active
window.console.log("" + State.BLOCKED);       // Blocked
window.console.log(State.values());           // [State.NEW, State.ACTIVE, State.BLOCKED]
window.console.log(State.valueOf("New"));     // State.NEW
window.console.log(State.valueByName("NEW")); // State.NEW
window.console.log(State.ACTIVE.enumName);    // ACTIVE