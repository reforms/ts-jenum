import {Enum, EnumType, IStaticEnum} from "./../ts/jenum";

@Enum("text")
export class State extends EnumType<State>() {

    static readonly NEW = new State("Новый");
    static readonly ACTIVE = new State("Действующий");
    static readonly BLOCKED = new State("Заблокированный");

    private constructor(public text: string) {
        super();
    }
}

// Пример использования
window.console.log("" + State.ACTIVE);        // Действующий
window.console.log("" + State.BLOCKED);       // Заблокированный
window.console.log(State.values());           // [State.NEW, State.ACTIVE, State.BLOCKED]
window.console.log(State.valueOf("Новый"));   // State.NEW
window.console.log(State.valueByName("NEW")); // State.NEW
window.console.log(State.ACTIVE.enumName);    // ACTIVE