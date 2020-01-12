import {Enum, EnumType} from "ts-jenum";

describe("EnumApi", () => {

    test("values", () => {
        const states = State.values();
        expect(states.length).toBe(3);
        expect(states[0]).toBe(State.NEW);
        expect(states[1]).toBe(State.ACTIVE);
        expect(states[2]).toBe(State.BLOCKED);
    });

    test("valueOf", () => {
        expect(State.valueOf("New")).toBe(State.NEW);
        expect(State.valueOf("Active")).toBe(State.ACTIVE);
        expect(State.valueOf("Blocked")).toBe(State.BLOCKED);
    });

    test("valueOf$error", () => {
        expect(() => State.valueOf("Unknown")).toThrowError();
    });

    test("valueByName", () => {
        expect(State.valueByName("NEW")).toBe(State.NEW);
        expect(State.valueByName("ACTIVE")).toBe(State.ACTIVE);
        expect(State.valueByName("BLOCKED")).toBe(State.BLOCKED);
    });

    test("valueByName$error", () => {
        expect(() => State.valueByName("Unknown")).toThrowError();
    });

    test("enumName", () => {
        expect(State.NEW.enumName).toBe("NEW");
        expect(State.ACTIVE.enumName).toBe("ACTIVE");
        expect(State.BLOCKED.enumName).toBe("BLOCKED");
    });

    test("toString", () => {
        expect(State.NEW.toString()).toBe("New");
        expect(State.ACTIVE.toString()).toBe("Active");
        expect(State.BLOCKED.toString()).toBe("Blocked");
    });
});

@Enum("text")
class State extends EnumType<State>() {

    static readonly NEW = new State(1, "New");
    static readonly ACTIVE = new State(2, "Active");
    static readonly BLOCKED = new State(3, "Blocked");

    private constructor(readonly code: number, readonly text: string) {
        super();
    }
}