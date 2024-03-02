import React from "react";
import {Location} from "history";
import { NavigateFunction,PathPattern, matchPath} from "react-router";
import { useNavigate, useLocation, useParams } from "react-router-dom";

type Iarg=string|PathPattern;

export function pathIsMatch(pathname:string,args:Iarg[])
{
    let mp:boolean=false;
    
    for(let i=0; i<args.length; i++)
    {
        const p=args[i];
        if(p)
        {
            const k=typeof p==="string"?matchPath({path:p},pathname):matchPath(p as PathPattern,pathname);        
            if(k)
            {
                mp=true;
                break;
            }
        }
    }

    return mp;
}

export type TWithRouterProps = {
    history:NavigateFunction
    location:Location
    match:any
    params:any
}

export const withRouter=(Component:any)=>{
    const Wrapper=(props:any)=>
    {
        const history=useNavigate();
        const location=useLocation();
        const params=useParams();
        const match={params}
        return (
            <Component history={history} location={location} match={match} params={params} {...props} />
        );
    }

    return Wrapper;
}