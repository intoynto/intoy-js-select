import {ChangeEvent} from "react";

export type IAnyEvent=ChangeEvent<HTMLInputElement>;

export type ISelectBaseProps = {
    id?:string
    name:string    
    
    fieldid:string
    fieldname:string

    multiple?:boolean
    
    value?:string[]|number[]|string|number

    onChange?:(e:IAnyEvent)=>void
    onFieldName?:(e:any)=>string
    onConfirmChange?:(from:any,to:any,multipe:boolean)=>boolean

    placeholder?:string    
}

export type  ISelectProps = ISelectBaseProps & 
{
    options?:any[]
    loading?:boolean
}

export type ISelectState = {
    focus:boolean
    open:boolean
    keyword:string
    label:string
    emit:number
}

export type ISelecListProps = ISelectBaseProps & 
{
    url:string
    params?:any
    useCache?:boolean
    sortField?:string
    loader?:(url:string,params?:any)=>Promise<Response>
    onSort?:(options?:any[],sortField?:string)=>void
    onResponse?:(res:any)=>void
}

export type ISelectListState = {
    loading:boolean
    options:any[]
}

export type Ioption = {
    [p:string]:any
    __id:string
    __label:string
    __html:string
}