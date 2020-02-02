import {EnumTools, SearchPredicate, EnumType} from "../ts/jenum";

describe("EnumTools$toClass", () => {

    test("values", () => {
        const State = EnumTools.toClass(States);
        const states = State.values();
        expect(states.length).toBe(3);
        expect(states[0]).toBe(State.NEW);
        expect(states[1]).toBe(State.ACTIVE);
        expect(states[2]).toBe(State.BLOCKED);
    });

    test("keys", () => {
        const State = EnumTools.toClass(States);
        const enumNames = State.keys();
        expect(enumNames.length).toBe(3);
        expect(enumNames[0]).toBe("NEW");
        expect(enumNames[1]).toBe("ACTIVE");
        expect(enumNames[2]).toBe("BLOCKED");
    });

    test("valueOf", () => {
        const State = EnumTools.toClass(States);
        expect(State.valueOf("NEW")).toBe(State.NEW);
        expect(State.valueOf("ACTIVE")).toBe(State.ACTIVE);
        expect(State.valueOf("BLOCKED")).toBe(State.BLOCKED);
    });

    test("valueOf$error", () => {
        const State = EnumTools.toClass(States);
        expect(() => State.valueOf("Unknown")).toThrowError();
    });

    test("valueByName", () => {
        const State = EnumTools.toClass(States);
        expect(State.valueByName("NEW")).toBe(State.NEW);
        expect(State.valueByName("ACTIVE")).toBe(State.ACTIVE);
        expect(State.valueByName("BLOCKED")).toBe(State.BLOCKED);
    });

    test("valueByName$error", () => {
        const State = EnumTools.toClass(States);
        expect(() => State.valueByName("Unknown")).toThrowError();
    });

    test("find$usingId", () => {
        const State = EnumTools.toClass(States);
        expect(State.find("NEW")).toBe(State.NEW);
        expect(State.find("ACTIVE")).toBe(State.ACTIVE);
        expect(State.find("BLOCKED")).toBe(State.BLOCKED);
        expect(State.find("Unknown")).toBeNull();
    });

    test("find$usingPredicate", () => {
        const State = EnumTools.toClass(States);
        expect(State.find(state => state.value === 1)).toBe(State.NEW);
        expect(State.find(state => state.value === 2)).toBe(State.ACTIVE);
        expect(State.find(state => state.value === 3)).toBe(State.BLOCKED);
        expect(State.find(state => state.value === 4)).toBeNull();
    });

    test("filter", () => {
        class State extends EnumTools.toClass(States) {}
        expect(State.filter(state => state.value === 1)[0]).toBe(State.NEW);
        expect(State.filter(state => state.value === 2)[0]).toBe(State.ACTIVE);
        expect(State.filter(state => state.value === 3)[0]).toBe(State.BLOCKED);
        expect(State.filter(state => state.value === 4).length).toBe(0);
        const checkFilter = (predicate:  SearchPredicate<State>, expectedStatew: State[]) => {
            const actualStates = State.filter(predicate);
            expect(actualStates.length).toBe(expectedStatew.length);
            for (let index = 0; index < actualStates.length; index++) {
                expect(actualStates[index]).toBe(expectedStatew[index]);
            }
        }
        checkFilter(state => state.value > 1, [State.ACTIVE, State.BLOCKED]);
        checkFilter(state => state.value !== 2, [State.NEW, State.BLOCKED]);    
    });

    test("enumName", () => {
        const State = EnumTools.toClass(States);
        expect(State.NEW.enumName).toBe("NEW");
        expect(State.ACTIVE.enumName).toBe("ACTIVE");
        expect(State.BLOCKED.enumName).toBe("BLOCKED");
    });

    test("toString", () => {
        const State = EnumTools.toClass(States);
        expect(State.NEW.toString()).toBe("NEW");
        expect(State.ACTIVE.toString()).toBe("ACTIVE");
        expect(State.BLOCKED.toString()).toBe("BLOCKED");
    });
});

function assertPair(pair: {
    key: string;
    value: string | number;
}, key: string, value: string | number) {
    expect(pair.key).toBe(key);
    expect(pair.value).toBe(value);
}

const States = {
    NEW: 1,
    ACTIVE: 2,
    BLOCKED: 3
};