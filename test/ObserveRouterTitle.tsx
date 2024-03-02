import React from "react";
import { TWithRouterProps, withRouter } from "./withRouter";
import {PATH} from "./consts";

const findTitle=function(pathname:string)
{
    for(let p in PATH)        
    {
        const pi=PATH[p];
        const url=(pi.url||"").toString();

        if(pathname===url)
        {
            return pi.title
        }
    }

    return null;
};

function setDocTitle(title:string)
{
    if(!title) return;
    const etitle=document.getElementsByTagName('title')[0];
    if(!etitle) return;
    (etitle as HTMLTitleElement).textContent=title;
}

function makeTitle(props:TWithRouterProps)
{
    const {location}=props;
    const {pathname}=location;
    let title=findTitle(pathname);
    title=title?title:"Pengelola Data";
    title+=" - "+'SelectDev - Intoynto';

    setDocTitle(title);
}

export default withRouter(makeTitle as any);