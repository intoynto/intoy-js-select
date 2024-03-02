import React from "react";

type IlocalProps = {
    className?:string
}

type IlocalState = {

}

const Loading=(props:IlocalProps)=><div className={props.className?props.className:'loading_bar'} /> 

export {Loading}