/**
 * Decorator for Enum.
 * @param {string} idProperty - property name to find enum value by property value. Usage in valueOf method
 * @return constructor of enum type
 */
export function Enum(idProperty?: string) {
    // tslint:disable-next-line
    return function <T extends Function, V>(target: T): T {
        if ((target as any).__enumMap__ || (target as any).__enumValues__) {
            const enumName = (target as any).prototype.constructor.name;
            throw new Error(`The enumeration ${enumName} has already initialized`);
        }
        const enumMap: any = {};
        const enumMapByName: any = {};
        const enumValues = [];
        // Lookup static fields
        for (const key of Object.keys(target)) {
            const value: any = (target as any)[key];
            // Check static field: to be instance of enum type
            if (value instanceof target) {
                let id;
                if (idProperty) {
                    id = (value as any)[idProperty];
                    if (typeof id !== "string" && typeof id !== "number") {
                        const enumName = (target as any).prototype.constructor.name;
                        throw new Error(`The value of the ${idProperty} property in the enumeration element ${enumName}. ${key} is not a string or a number: ${id}`);
                    }
                } else {
                    id = key;
                }
                if (enumMap[id]) {
                    const enumName = (target as any).prototype.constructor.name;
                    throw new Error(`An element with the identifier ${id}: ${enumName}.${enumMap[id].enumName} already exists in the enumeration ${enumName}`);
                }
                enumMap[id] = value;
                enumMapByName[key] = value;
                enumValues.push(value);
                Object.defineProperty(value, "__enumName__", {value: key});
                Object.freeze(value);
            }
        }
        Object.freeze(enumMap);
        Object.freeze(enumValues);
        Object.defineProperty(target, "__enumMap__", {value: enumMap});
        Object.defineProperty(target, "__enumMapByName__", {value: enumMapByName});
        Object.defineProperty(target, "__enumValues__", {value: enumValues});
        if (idProperty) {
            Object.defineProperty(target, "__idPropertyName__", {value: idProperty});
        }
        Object.freeze(target);
        return target;
    };
}

/** Type for Meta-Data of Enum */
type EnumStore = {
    name: string,
    __enumMap__: any,
    __enumMapByName__: {[key: string]: any},
    __enumValues__: ReadonlyArray<any>,
    __idPropertyName__?: string
};

/** Interface for IDE: autocomplete syntax and keywords */
export interface IStaticEnum<T> {

    new(): {enumName: string};

    values(): ReadonlyArray<T>;

    valueOf(id: string | number): T;

    valueByName(name: string): T;
}

/** Base class for enum type */
class Enumerable {

    constructor() {
        const clazz = this.constructor as any as EnumStore;
        if (clazz.__enumMap__ || clazz.__enumValues__ || clazz.__enumMapByName__) {
            throw new Error(`It is forbidden to create ${clazz.name} enumeration elements outside the enumeration`);
        }
    }

    /**
     * Get all elements of enum
     * @return {ReadonlyArray<T>} all elements of enum
     */
    static values(): ReadonlyArray<any> {
        const clazz = this as any as EnumStore;
        if (!clazz.__enumValues__) {
            throw new Error(`${clazz.name} enumeration has not been initialized. It is necessary to add the decorator @Enum to the class`);
        }
        return clazz.__enumValues__;
    }

    /**
     * Lookup enum item by id
     * @param {string | number} id - value for lookup
     * @return enum item by id
     */
    static valueOf(id: string | number): any {
        const clazz = this as any as EnumStore;
        if (!clazz.__enumMap__) {
            throw new Error(`${clazz.name} enumeration has not been initialized. It is necessary to add the decorator @Enum to the class`);
        }
        const value = clazz.__enumMap__[id];
        if (!value) {
            throw new Error(`The element with ${id} identifier does not exist in the $ {clazz.name} enumeration`);
        }
        return value;
    }

    /**
     * Lookup enum item by enum name
     * @param {string} name - enum name
     * @return item by enum name
     */
    static valueByName(name: string): any {
        const clazz = this as any as EnumStore;
        if (!clazz.__enumMapByName__) {
            throw new Error(`${clazz.name} enumeration has not been initialized. It is necessary to add the decorator @Enum to the class`);
        }
        const value = clazz.__enumMapByName__[name];
        if (!value) {
            throw new Error(`The element with ${name} name does not exist in the ${clazz.name} enumeration`);
        }
        return value;
    }

    /** Get enum name */
    get enumName(): string {
        return (this as any).__enumName__;
    }

    /** Get enum id value or enum name */
    toString(): string {
        const clazz = this.constructor as any as EnumStore;
        if (clazz.__idPropertyName__) {
            const self = this as any;
            return self[clazz.__idPropertyName__];
        }
        return this.enumName;
    }
}

/** 'Casting' method to make correct Enum Type */
export function EnumType<T>(): IStaticEnum<T> {
    return (<IStaticEnum<T>> Enumerable);
}