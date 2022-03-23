import React from "react";

type IplotProps = {
    title:React.ReactNode
    children:React.ReactNode
}

export function Plot(props:IplotProps)
{
    return (
        <div className="p-4 bg-white">
            <div className="text-2xl border-b pb-2 mb-2">{props.title}</div>
            {props.children}
        </div>
    );
}