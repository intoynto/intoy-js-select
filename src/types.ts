import {ChangeEvent} from "react";

export type IAnyEvent=ChangeEvent<HTMLInputElement>;

export type ISelectProps = 
{
    id?:string
    name:string
    fieldid:string
    fieldname:string
    options:any[]
    multiple?:boolean
    disabled?:boolean
    value?:string[]|number[]|string|number
    onChange?:(e:IAnyEvent)=>void
    onFieldName?:(e:any)=>any
    placeholder?:string
    loading?:boolean
}

export type ISelectState = {
    focus:boolean
    emit:number
}


export type ISelectValueTarget = {
    target:{
        name:string
        value:string|string[]
    },
}