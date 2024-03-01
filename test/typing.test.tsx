import React from "react";
import SelectList, {IselectListProps} from "../src/SelectList";

type IchosenPropsExtend=Omit<IselectListProps,"url">;

type IchosenProps=IchosenPropsExtend & 
{
    params?:any
    name?:string
    useCache?:boolean
}


export const Test=(props:IchosenProps)=><SelectList {...props} useCache={props.useCache!==undefined && props.useCache!==null?props.useCache:true} url="ronal" />