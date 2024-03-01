import React from "react";
import Select from "../src/Select";
import { optionsWilayah } from "./shareds";
import { random_string, toStr } from "../src/utils";
import { IAnyEvent } from "../src/types";
import SelectList from "../src/SelectList";

type Iprops = {

}

type Istate = {
    values:any
    url:string
    params:any
}

function onFieldName(r:any):string
{
    return `${toStr(r.label)} - ${toStr(r.kw)}`;
}

class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    constructor(props:P)
    {
        super(props);
        this.state={
            values:{},
            url:'',
            params:'',
        } as any;
    }

    protected onDinamicSet=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        this.setState({
            url:'http://localhost/1071-monep5/api/sub-organisasi/data',
        })       
    }

    render()
    {
        const {values,url}=this.state;           
        return (
            <div>
                <div className="p-4">
                    <div className="text-2xl border-b border-gray-400 pb-2 mb-2">Select List</div>

                    <Container>
                        Options from url : <span className="font-semibold">{url}</span>
                        <div className="flex gap-1.5 pt-2">
                            <SelectList name="select_list" fieldid="kode_sub_organisasi" fieldname="sub_organisasi" placeholder="Options from Fetch" url={url} />    
                            <button type="button" onClick={this.onDinamicSet} className="border border-gray-400 rounded bg-gray-200 px-2 py-0.5">Start</button>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

type IcontainerProps={
    asForm?:boolean
    children:React.ReactNode
};

function Container(props:IcontainerProps)
{
    if(props.asForm)
    {
        return (<form>{props.children}</form>);
    }
    return <div>{props.children}</div>
}

export default Comp;