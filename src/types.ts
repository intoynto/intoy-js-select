import {ChangeEvent} from "react";

export type IAnyEvent=ChangeEvent<HTMLInputElement>;

export type  ISelectProps = 
{
    id?:string
    name:string

    options?:any[]
    
    fieldid:string
    fieldname:string

    multiple?:boolean
    
    value?:string[]|number[]|string|number

    onChange?:(e:IAnyEvent)=>void
    onFieldName?:(e:any)=>string
    onConfirmChange?:(from:any,to:any,multipe:boolean)=>boolean

    placeholder?:string
    loading?:boolean
}

export type ISelectState = {
    focus:boolean
    open:boolean
    keyword:string
    label:string
    emit:number
}

export type Ioption = {
    [p:string]:any
    __id:string
    __label:string
    __html:string
}