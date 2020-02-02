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
type EnumMap = {[key: string]: Enumerable};

/** Type for Meta-Data of Enum */
type EnumClass = {
    __store__: EnumStore
};

/** Store Type. Keep meta data for enum */
type EnumStore = {
    name: string,
    enumMap: EnumMap,
    enumMapByName: EnumMap,
    enumValues: Enumerable[],
    idPropertyName?: any
};

/** Enum Item Type */
type EnumItemType = {
    __enumName__: string;
};

export type SearchPredicate<T> = (value: T, index?: number, obj?: ReadonlyArray<T>) => boolean;

/** Interface for IDE: autocomplete syntax and keywords */
export interface IStaticEnum<T> extends EnumClass {

    new(): {enumName: string};

    /** @returns all elements of enum */
    values(): ReadonlyArray<T>;

    /** 
     * Get all names of enum.
     * It's shortcut for 'values().map(value => value.enumName)'
     * @returns all names of enum */
    keys(): string[];

    /**
     * Lookup enum item by id
     * @param id value for lookup or throw error
     * @throws enum item not found
     */
    valueOf(id: string | number): T;

    /**
     * Lookup enum item by enum name
     * @param name enum name
     * @return item by enum name or throw error
     * @throws enum item not found
     */
    valueByName(name: string): T;

    /**
     * Lookup enum item by id or search by predicate
     * @param idOrPredicate id or predicate
     * @return item ot `null`
     */
    find(idOrPredicate: string | number | SearchPredicate<T>): T | null;

    /**
     * Filter enum items by predicate
     * @param predicate function to filtering
     * @return items ot `[]`
     */
    filter(predicate: SearchPredicate<T>): ReadonlyArray<T>;
}

/** Base class for enum type */
class Enumerable implements EnumItemType {
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
     * @return all elements of enum
     */
    static values(): ReadonlyArray<any> {
        return this.__store__.enumValues;
    }

    /**
     * Get all enum names
     * @return all enum names
     */
    static keys(): string[] {
        return this.values().map(value => value.enumName);
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
     * @param name enum name
     * @return item by enum name
     */
    static valueByName(name: string): any {
        const value = this.__store__.enumMapByName[name];
        if (!value) {
            throw new Error(`The element with ${name} name does not exist in the ${this.__store__.name} enumeration`);
        }
        return value;
    }

    static find(idOrPredicate: string | number | SearchPredicate<any>): any | null {
        if (typeof idOrPredicate === "number" || typeof idOrPredicate === "string") {
            return this.__store__.enumMap[idOrPredicate] || null;
        }
        return this.values().find(idOrPredicate) || null;
    }

    static filter(predicate: SearchPredicate<any>): ReadonlyArray<any> {
        return this.values().filter(predicate);
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

/**
 * Powerful tool to comfortable work with plain json struct like enum 
 */
export class EnumTools {

    /**
     * Get all properties key as string
     * @param struct that to be scanned
     * @returns all properties name as string
     */
    static keys<T>(struct: T): string[] {
        return Object.keys(struct);
    }

    /**
     * Get all values
     * @param struct that to be scanned
     * @returns all properties name as string
     */
    static values<T>(struct: T): Array<T[keyof T]> {
        return Object.keys(struct).map(key => struct[key as keyof T]);
    }

    /**
     * Reverse key and value
     * @param struct that to be scanned
     * @returns reversed struct
     */
    static reverse<T extends {[key: string]: string | number}>(struct: T): {[key: string]: string} {
        const reversedStruct: {[key: string]: string} =  {};
        for (const key in struct) {
            reversedStruct[struct[key]] = key;
        }
        return reversedStruct;
    }

    /**
     * Get array of pair with `{key: string, value: string | number}` struct
     * @param struct that to be scanned
     * @returns array of pair with `{key: string, value: string | number}` struct
     */
    static pairs<T extends {[key: string]: string | number}>(struct: T): Array<{key: string, value: string | number}> {
        const pairs = [];
        for (const key in struct) {
            pairs.push({
                key: key,
                value: struct[key as keyof T]
            });
        }
        return pairs;
    }

    /**
     * Creating class that extends from EnumType and has all static functionality
     * @param struct that to be scanned
     * @returns class that extends from EnumType and has all static functionality
     */
    static toClass<T extends {[key: string]: string | number}>(struct: T) {
        // declare class of enum
        const KeyValueEnum = class InnerEnum extends EnumType<InnerEnum>() {
            constructor(readonly key: string, readonly value: string | number) {
                super();
            }
        }
        // Dirty hack. Needs to be getting correct type of KeyValueEnum instance
        const IgnoredEnum = new KeyValueEnum("", ""); 
        // add static constant
        for (const key of Object.keys(struct)) {
            (<any> KeyValueEnum)[key] = new KeyValueEnum(key, struct[key as keyof T]);
        }
        // wrap by Enum decorator
        const WrappedEnum = Enum("key")(KeyValueEnum);
        // complete correct type
        return <typeof WrappedEnum & Record<keyof T, typeof IgnoredEnum>> WrappedEnum;
    }
}
