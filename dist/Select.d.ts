import React from "react";
import { ISelectProps, ISelectState } from "./types";
declare type Igen = {
    __id_: string;
    __label_: string;
    __labelOrigin_: string;
    [key: string]: any;
};
declare class Select<P extends ISelectProps, S extends ISelectState> extends React.Component<P, S> {
    static version: string;
    protected options: any[];
    protected valueRef: any[];
    protected selectOptions: any[];
    protected values: any[];
    protected dropItems: any;
    protected places: any;
    protected ndWrap: any;
    protected ndSelBox: any;
    protected ndSelCtr: any;
    protected nDropDown: any;
    protected ndSelect: any;
    protected ndInput: any;
    protected ndNoInput: any;
    protected ndTgDrop: any;
    protected ndTgRem: any;
    protected search: string;
    protected clBody: boolean;
    private _cselops;
    constructor(props: P);
    protected gInitState: (props?: P | undefined) => S;
    protected isMultiple: (props?: P | undefined) => boolean;
    protected isDisabled: (props?: P | undefined) => boolean;
    protected prepValues: (props?: P | undefined) => void;
    protected prepPlaces: (props?: P | undefined) => void;
    protected valuesAdd: (idValue: string) => void;
    protected rdrPlace: ({ dngH, multiple, dataValue }: {
        dngH: string;
        multiple: boolean;
        dataValue: string;
    }) => JSX.Element;
    protected valuesRem: (idValue?: string | undefined) => boolean | undefined;
    protected itemsPush: (gen: Igen, props?: P | undefined) => void;
    protected optionPush: (gen: Igen, props?: P | undefined) => void;
    protected prepItems: (props?: P | undefined) => void;
    protected prepOptions: (props?: P | undefined) => void;
    protected ckInpFocused: () => void;
    protected emit: (cb?: (() => void) | undefined) => void;
    protected onECh: (e: any) => void;
    protected hSWKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => boolean;
    protected onItemClick: (e: React.MouseEvent) => void;
    protected callPropsChange: () => void;
    protected hSWClick: (e: React.MouseEvent) => void;
    protected onClickOutside: (e: MouseEvent) => void;
    protected updateCtrSize: () => void;
    protected bodyClReg: () => void;
    protected bodyClUnReg: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(props: P): void;
    render(): JSX.Element;
}
export { Select };
