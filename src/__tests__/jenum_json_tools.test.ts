import {EnumTools} from "../ts/jenum";

describe("EnumTools$BaseApi", () => {

    test("keys$string", () => {
        const keys = EnumTools.keys(Colors);
        expect(keys.length).toBe(3);
        expect(keys[0]).toBe("WHITE");
        expect(keys[1]).toBe("GRAY");
        expect(keys[2]).toBe("BLACK");
    });

    test("keys$digit", () => {
        const keys = EnumTools.keys(DigitKeyColors);
        expect(keys.length).toBe(3);
        expect(keys[0]).toBe("1");
        expect(keys[1]).toBe("2");
        expect(keys[2]).toBe("3");
    });

    test("keys$mixed", () => {
        const keys = EnumTools.keys(MixedColors);
        expect(keys.length).toBe(4);
        expect(keys[0]).toBe("1");
        expect(keys[1]).toBe("3");
        expect(keys[2]).toBe("GRAY");
        expect(keys[3]).toBe("DEFAULT");
    });

    test("values$string", () => {
        const values = EnumTools.values(Colors);
        expect(values.length).toBe(3);
        expect(values[0]).toBe("#FFFFFF");
        expect(values[1]).toBe("#808080");
        expect(values[2]).toBe("#000000");
    });

    test("values$digit", () => {
        const values = EnumTools.values(DigitValueColors);
        expect(values.length).toBe(3);
        expect(values[0]).toBe(255);
        expect(values[1]).toBe(127);
        expect(values[2]).toBe(0);
    });

    test("values$mixed", () => {
        const values = EnumTools.values(MixedColors);
        expect(values.length).toBe(4);
        expect(values[0]).toBe(255);
        expect(values[1]).toBe("#000000");
        expect(values[2]).toBe("#808080");
        expect(values[3]).toBe(255);
    });

    test("reverse$string", () => {
        const rStruct = EnumTools.reverse(Colors);
        expect(rStruct["#FFFFFF"]).toBe("WHITE");
        expect(rStruct["#808080"]).toBe("GRAY");
        expect(rStruct["#000000"]).toBe("BLACK");
    });

    test("reverse$digit", () => {
        const rStruct = EnumTools.reverse(DigitValueColors);
        expect(rStruct[255]).toBe("WHITE");
        expect(rStruct[127]).toBe("GRAY");
        expect(rStruct[0]).toBe("BLACK");
    });

    test("pairs$string", () => {
        const pairs = EnumTools.pairs(Colors);
        assertPair(pairs[0], "WHITE", "#FFFFFF");
        assertPair(pairs[1], "GRAY", "#808080");
        assertPair(pairs[2], "BLACK", "#000000");
    });

    test("pairs$digit", () => {
        const pairs = EnumTools.pairs(DigitValueColors);
        assertPair(pairs[0], "WHITE", 255);
        assertPair(pairs[1], "GRAY", 127);
        assertPair(pairs[2], "BLACK", 0);
    });

    test("pairs$mixed", () => {
        const pairs = EnumTools.pairs(MixedColors);
        assertPair(pairs[0], "1", 255);
        assertPair(pairs[1], "3", "#000000");
        assertPair(pairs[2], "GRAY", "#808080");
        assertPair(pairs[3], "DEFAULT", 255);
    });

    test("toClass$string", () => {
        const ColorEnum = EnumTools.toClass(Colors);
        const values = ColorEnum.values();
        assertPair(values[0], "WHITE", "#FFFFFF");
    });
});

function assertPair(pair: {
    key: string;
    value: string | number;
}, key: string, value: string | number) {
    expect(pair.key).toBe(key);
    expect(pair.value).toBe(value);
}

const Colors = {
    WHITE: "#FFFFFF",
    GRAY: "#808080",
    BLACK: "#000000"
};

const DigitValueColors = {
    WHITE: 255,
    GRAY: 127,
    BLACK: 0
};

const DigitKeyColors = {
    1: "#FFFFFF",
    2: "#808080",
    3: "#000000"
};

const MixedColors = {
    1: 255,
    GRAY: "#808080",
    3: "#000000",
    DEFAULT: 255
}