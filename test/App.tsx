import React from "react";
import {BrowserRouter} from "react-router-dom";
import {getBaseName} from "./preload";
import Header from "./Header";
import Main from "./Main";
import ObserveTitle from "./ObserveRouterTitle";

export default ()=>
{
    let loca=getBaseName();

    if(loca.substring(loca.length-1,1)==='/')
    {
        loca=loca.substring(0,loca.length-1);
    }
    if(loca==="") loca="/";

    console.log("basename: ",loca);
    return (
        <BrowserRouter basename={loca}>
            <Header />
            <Main />   
            <ObserveTitle />         
        </BrowserRouter>
    );
}