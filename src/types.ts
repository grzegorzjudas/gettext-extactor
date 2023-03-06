export type Translation = {
    id: string;
    value: string;
    file: string;
    line: number;
    column: number;
    comments: string[];
    context: {
        plural?: string;
    }
};
