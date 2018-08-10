/**
 * Декоратор автоматической инициализации перечисления.
 * TODO: После реализации запроса https://github.com/Microsoft/TypeScript/issues/4881 можно будет сделать так,
 * TODO: что для создания перечисления будет достаточно указать этот декоратор без наследования от Enumerable.
 * @param {string} idProperty название свойства в элементах перечисления, которое нужно использовать как идентификатор
 * @return конструктор перечисления
 * @constructor
 */
export function Enum(idProperty?: string) {
    // tslint:disable-next-line
    return function <T extends Function, V>(target: T): T {
        if ((target as any).__enumMap__ || (target as any).__enumValues__) {
            const enumName = (target as any).prototype.constructor.name;
            throw new Error(`Перечисление ${enumName} уже инициализировано`);
        }
        const enumMap: any = {};
        const enumMapByName: any = {};
        const enumValues = [];
        // Перебор всех статических свойств класса
        for (const key of Object.keys(target)) {
            const value: any = (target as any)[key];
            // Если значением свойства является экземпляр класса, то это значение является одним из элементов перечисления
            if (value instanceof target) {
                let id;
                if (idProperty) {
                    id = (value as any)[idProperty];
                    if (typeof id !== "string" && typeof id !== "number") {
                        const enumName = (target as any).prototype.constructor.name;
                        throw new Error(`Значение свойства ${idProperty} в элементе перечисления ${enumName}. ${key} не является строкой или числом: ${id}`);
                    }
                } else {
                    id = key;
                }
                if (enumMap[id]) {
                    const enumName = (target as any).prototype.constructor.name;
                    throw new Error(`В перечислении ${enumName} уже существует элемент с идентификатором ${id}: ${enumName}.${enumMap[id].__enumName__}`);
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

/** Тип для мета-данных Enum */
type EnumStore = {
    name: string,
    __enumMap__: any,
    __enumMapByName__: {[key: string]: any},
    __enumValues__: ReadonlyArray<any>,
    __idPropertyName__?: string
};

/** Интерфейс типа перечисления. Нужен для корректного определения типов элементов перечисления */
export interface IStaticEnum<T> {

    new(): {enumName: string};

    values(): ReadonlyArray<T>;

    valueOf(id: string | number): T;

    valueByName(name: string): T;
}

/** Базовый класс для создания перечисления */
class Enumerable {

    /** Создает элемент перечисления */
    constructor() {
        const clazz = this.constructor as any as EnumStore;
        if (clazz.__enumMap__ || clazz.__enumValues__ || clazz.__enumMapByName__) {
            throw new Error(`Запрещено создавать элементы перечисления ${clazz.name} вне самого перечисления`);
        }
    }

    /**
     * Возвращает все элементы перечисления.
     * Параметр this нужен для корректного определения типов элементов перечисления.
     * @return {ReadonlyArray<T>} все элементы перечисления
     */
    static values(): ReadonlyArray<any> {
        const clazz = this as any as EnumStore;
        if (!clazz.__enumValues__) {
            throw new Error(`Перечисление ${clazz.name} не инициализировано. Необходимо добавить к классу декоратор @Enum`);
        }
        return clazz.__enumValues__;
    }

    /**
     * Возвращает элемент перечисления по его идентификатору.
     * Если при инициализации было указан параметр idProperty, то использует его, иначе - название элемента в перечислении.
     * Кидает ошибку если в перечислении нет элемента с указанным идентификатором.
     * Параметр this нужен для корректного определения типов элементов перечисления.
     * @param {string | number} id идентификатор элемента
     * @return {T} элемент перечисления с указанным идентификатором
     */
    static valueOf(id: string | number): any {
        const clazz = this as any as EnumStore;
        if (!clazz.__enumMap__) {
            throw new Error(`Перечисление ${clazz.name} не инициализировано. Необходимо добавить к классу декоратор @Enum`);
        }
        const value = clazz.__enumMap__[id];
        if (!value) {
            throw new Error(`В перечислении ${clazz.name} не существует элемента с идентификатором ${id}`);
        }
        return value;
    }

    /**
     * Возвращает элемент перечисления по его наименованию.
     * Кидает ошибку если в перечислении нет элемента с указанным наименованием.
     * Параметр this нужен для корректного определения типов элементов перечисления.
     * @param {string} name наименование элемента в перечислении
     * @return {T} элемент перечисления с указанным наименованием
     */
    static valueByName(name: string): any {
        const clazz = this as any as EnumStore;
        if (!clazz.__enumMapByName__) {
            throw new Error(`Перечисление ${clazz.name} не инициализировано. Необходимо добавить к классу декоратор @Enum`);
        }
        const value = clazz.__enumMapByName__[name];
        if (!value) {
            throw new Error(`В перечислении ${clazz.name} не существует элемента с наименованием ${name}`);
        }
        return value;
    }

    /** Возвращает наименование элемента в перечислении */
    get enumName(): string {
        return (this as any).__enumName__;
    }

    /** Возвращает строковое значение элемента перечисления */
    toString(): string {
        const clazz = this.constructor as any as EnumStore;
        if (clazz.__idPropertyName__) {
            const self = this as any;
            return self[clazz.__idPropertyName__];
        }
        return this.enumName;
    }
}

export function EnumType<T>(): IStaticEnum<T> {
    return (<IStaticEnum<T>> Enumerable);
}