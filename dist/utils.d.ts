import { Ioption } from "./types";
export declare function toUtf8String(value: string): string;
export declare function toStr(value: string | number | null | undefined, usingUtf8?: boolean): string;
export declare function toSingleString(value: any): string;
export declare function toArrayString(options: any): any[];
export declare function isEqual(value: any, other: any): boolean;
export declare function isObjectEmpty(obj: object): boolean;
export declare function checkCompare(textContext: string | null | undefined, stringSearch: string | null | undefined): boolean;
export declare function stripHtmlTags(str: string | number | null | undefined): string;
export declare function getFocusElement(): Element | null;
export declare function random_string(): string;
type IgeneratOptionsProps = {
    options?: any[];
    fieldid?: string;
    fieldname: string;
    onFieldName?: (e: any) => string;
};
type IgenerateOptionResult = {
    options: Ioption[];
    options_b: string[];
};
export declare function generateOptions(props: IgeneratOptionsProps): IgenerateOptionResult;
export {};
