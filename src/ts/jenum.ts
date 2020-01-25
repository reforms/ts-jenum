/**
 * Decorator for Enum.
 * @param {string} idPropertyName - property name to find enum value by property value. Usage in valueOf method
 * @return constructor of enum type
 */
export function Enum<T = any>(idPropertyName?: keyof T) {
    // tslint:disable-next-line
    return function <T extends (Function & EnumClass)>(target: T): T {
        const store: EnumStore = {
            name: target.prototype.constructor.name,
            enumMap: {},
            enumMapByName: {},
            enumValues: [],
            idPropertyName: idPropertyName
        };
        // Lookup static fields
        for (const fieldName of Object.keys(target)) {
            const value: any = (target as any)[fieldName];
            // Check static field: to be instance of enum type
            if (value instanceof target) {
                const enumItem: Enumerable = value;
                let id = fieldName;
                if (idPropertyName) {
                    id = (value as any)[idPropertyName];
                    if (typeof id !== "string" && typeof id !== "number") {
                        const enumName = store.name;
                        throw new Error(`The value of the ${idPropertyName} property in the enumeration element ${enumName}.${fieldName} is not a string or a number: ${id}`);
                    }
                }
                if (store.enumMap[id]) {
                    const enumName = store.name;
                    throw new Error(`An element with the identifier ${id}: ${enumName}.${store.enumMap[id].enumName} already exists in the enumeration ${enumName}`);
                }
                store.enumMap[id] = enumItem;
                store.enumMapByName[fieldName] = enumItem;
                store.enumValues.push(enumItem);
                enumItem.__enumName__ = fieldName;
                Object.freeze(enumItem);
            }
        }
        target.__store__ = store;
        Object.freeze(target.__store__);
        Object.freeze(target);
        return target;
    };
}

/** Key->Value type */
export type EnumMap = {[key: string]: Enumerable};

/** Type for Meta-Data of Enum */
export type EnumClass = {
    __store__: EnumStore
};

/** Store Type. Keep meta data for enum */
export type EnumStore = {
    name: string,
    enumMap: EnumMap,
    enumMapByName: EnumMap,
    enumValues: Enumerable[],
    idPropertyName?: any
};

/** Enum Item Type */
export type EnumItemType = {
    __enumName__: string;
};

/** Interface for IDE: autocomplete syntax and keywords */
export interface IStaticEnum<T> extends EnumClass {

    new(): {enumName: string};

    values(): ReadonlyArray<T>;

    valueOf(id: string | number): T;

    valueByName(name: string): T;
}

/** Base class for enum type */
export class Enumerable implements EnumItemType {
    // tslint:disable:variable-name
    // stub. need for type safety
    static readonly __store__ = {} as EnumStore;
    // Initialize inside @Enum decorator
    __enumName__ = "";
    // tslint:enable:variable-name

    constructor() {
    }

    /**
     * Get all elements of enum
     * @return {ReadonlyArray<T>} all elements of enum
     */
    static values(): ReadonlyArray<any> {
        return this.__store__.enumValues;
    }

    /**
     * Lookup enum item by id
     * @param {string | number} id - value for lookup
     * @return enum item by id
     */
    static valueOf(id: string | number): any {
        const value = this.__store__.enumMap[id];
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
        const value = this.__store__.enumMapByName[name];
        if (!value) {
            throw new Error(`The element with ${name} name does not exist in the ${this.__store__.name} enumeration`);
        }
        return value;
    }

    /** Get enum name */
    get enumName(): string {
        return this.__enumName__;
    }

    /** Get enum id value or enum name */
    toString(): string {
        const clazz = this.topClass;
        if (clazz.__store__.idPropertyName) {
            const self = this as any;
            return self[clazz.__store__.idPropertyName];
        }
        return this.enumName;
    }

    private get topClass(): EnumClass {
        return this.constructor as any;
    }
}

/** 'Casting' method to make correct Enum Type */
export function EnumType<T>(): IStaticEnum<T> {
    return (<IStaticEnum<T>> Enumerable);
}

/** Get Names Of Enums */
export type EnumConstNames<T extends {prototype: K}, K = T["prototype"]> = Exclude<GetNames<T, K>, "prototype">;

type GetNames<FromType, KeepType = any, Include = true> = {
    [K in keyof FromType]: 
        FromType[K] extends KeepType ? 
            Include extends true ? K : 
            never : Include extends true ? 
            never : K
}[keyof FromType];