import {Enum, EnumType, EnumConstNames} from "../ts/jenum";

/** N1 ------------------------------------------------- **/
@Enum<State>("text")
class State extends EnumType<State>() {

    static readonly NEW = new State(1, "New");
    static readonly ACTIVE = new State(2, "Active");
    static readonly BLOCKED = new State(3, "Blocked");

    private constructor(readonly code: number, readonly text: string) {
        super();
    }
}
// to be: "NEW" | "ACTIVE" | "BLOCKED"
type StateNames = EnumConstNames<typeof State/*, State*/>;

// to be: [State.NEW, State.ACTIVE, State.BLOCKED]
const states = State.values();

// to be: ["NEW", "ACTIVE", "BLOCKED"]
const enumNames = State.keys();

// to be: State.NEW
const newState = State.valueByName("NEW")

// to be: State.ACTIVE
const activeState = State.valueOf("Active");

// to be: State.BLOCKED
const blockedState = State.find("Blocked");

// to be: State.BLOCKED
const blocedByCode3 = State.find(state => state.code === 3);

// to be: [State.ACTIVE, State.BLOCKED]
const someStates = State.filter(state => state.code >= 2);

// to be: "Active"
const activeText = State.ACTIVE.toString();

/** N2 ------------------------------------------------- **/
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
        // if (name === "ivan") 
        //     ^ This condition will always return 'false' since the types '"Ivan"' and '"cat"' have no overlap.

        // type to be: 1. Not string!
        const id = Person.IVAN.id;
        // to be: error
        // if (id === 3) 
        //     ^ This condition will always return 'false' since the types '1' and '3' have no overlap
    }
}