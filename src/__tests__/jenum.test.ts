import {Enum, EnumType, SearchPredicate} from "../ts/jenum";

describe("EnumApi", () => {

    test("values", () => {
        const states = State.values();
        expect(states.length).toBe(3);
        expect(states[0]).toBe(State.NEW);
        expect(states[1]).toBe(State.ACTIVE);
        expect(states[2]).toBe(State.BLOCKED);
    });

    test("keys", () => {
        const enumNames = State.keys();
        expect(enumNames.length).toBe(3);
        expect(enumNames[0]).toBe("NEW");
        expect(enumNames[1]).toBe("ACTIVE");
        expect(enumNames[2]).toBe("BLOCKED");
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

    test("find$usingId", () => {
        expect(State.find("New")).toBe(State.NEW);
        expect(State.find("Active")).toBe(State.ACTIVE);
        expect(State.find("Blocked")).toBe(State.BLOCKED);
        expect(State.find("Unknown")).toBeNull();
    });

    test("find$usingPredicate", () => {
        expect(State.find(state => state.code === 1)).toBe(State.NEW);
        expect(State.find(state => state.code === 2)).toBe(State.ACTIVE);
        expect(State.find(state => state.code === 3)).toBe(State.BLOCKED);
        expect(State.find(state => state.code === 4)).toBeNull();
    });

    test("filter", () => {
        expect(State.filter(state => state.code === 1)[0]).toBe(State.NEW);
        expect(State.filter(state => state.code === 2)[0]).toBe(State.ACTIVE);
        expect(State.filter(state => state.code === 3)[0]).toBe(State.BLOCKED);
        expect(State.filter(state => state.code === 4).length).toBe(0);
        const checkFilter = (predicate:  SearchPredicate<State>, expectedStatew: State[]) => {
            const actualStates = State.filter(predicate);
            expect(actualStates.length).toBe(expectedStatew.length);
            for (let index = 0; index < actualStates.length; index++) {
                expect(actualStates[index]).toBe(expectedStatew[index]);
            }
        }
        checkFilter(state => state.code > 1, [State.ACTIVE, State.BLOCKED]);
        checkFilter(state => state.code !== 2, [State.NEW, State.BLOCKED]);    
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