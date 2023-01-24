export enum Dropdown {
    Option1,
    Option2,
    Option3,
    Option4,
}

export interface ItemProps {
    id?: number;
    stringValue: string;
    date: Date;
    booleanValue: boolean;
    dropdownValue: Dropdown;
    arrayValue: Array<string>;
    numberValue: number;
}
