export type Translation = {
    id: string;
    value: string;
    file: string;
    line: number;
    column: number;
    pluralForm?: boolean;
};
