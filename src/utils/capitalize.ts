export const capitalize = <T extends string>(value: T): Capitalize<T> => {
    const newString = value.toLocaleLowerCase();
    return (value.charAt(0).toUpperCase() + newString.slice(1)) as Capitalize<T>;
};
