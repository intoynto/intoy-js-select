import React from "react";

type IHeadsubprops = {
    title:React.ReactNode
    children?:React.ReactNode
}

export const Headsub=(props:IHeadsubprops)=>{
    return (
        <div>
            <div className="border-b pb-3 mb-3">
                <div className="text-lg font-semibold">{props.title}</div>
                {props.children && <div className="text-sm text-gray-500">{props.children}</div>}
            </div>
        </div>
    );
}