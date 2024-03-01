import React from "react";
import Select from "../src/Select";
import { optionsWilayah } from "./shareds";
import { random_string, toStr } from "../src/utils";
import { IAnyEvent } from "../src/types";

type Iprops = {

}

type Istate = {
    values:any
    dinamic_options:any
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
            dinamic_options:[],
        } as any;
    }

    private onCh=(e:IAnyEvent)=>
    {
        const {values}=this.state;
        const old_value=(values[e.target.name]||'').toString().trim();
        let new_value=e.target.value;
        if(e.target.name==='input_hook')
        {            
            if((new_value||'').toString().trim().length<1 && old_value.length>0)
            {
                console.log('hook value to : ',old_value);
                new_value=old_value;
            }
        }
        values[e.target.name]=new_value;
        this.setState({values:{...values}});
    }

    protected onDinamicSet=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        const {dinamic_options}=this.state;
        const dnto=dinamic_options.length>0?[]:optionsWilayah.slice(5);
        console.log('set din to ',dnto);
        this.setState({dinamic_options:dnto});
    }

    protected onConfirmChangeSelect=(from:any,to:any,multiple:boolean):boolean=>
    {
        let ignore=true;
        if(from!==undefined && from!==null && !to)
        {
            ignore=false;
        }
        console.log('confirm change. multiple:',multiple,'from(',from,')','to(',to,') ignore: ',ignore);
        return ignore;
    }

    render()
    {
        const {values,dinamic_options}=this.state;           
        return (
            <div>
                <div className="p-4">
                    <div className="text-2xl border-b border-gray-400 pb-2 mb-2">Hook/Prevent Value</div>

                    <Container>
                        {/*
                        <div>Current Value : <span className="font-semibold">{values.input_hook}</span></div>
                        <div className="flex gap-3 pt-1.5">                            
                            <Select name="input_hook" fieldid="kw" fieldname="label" options={optionsWilayah} onFieldName={onFieldName} value={values.input_hook} onChange={this.onCh} placeholder="Hook" />
                        </div>                       
                        */}

                        <div className="flex gap-1.5 pt-2">
                            <Select name="input_hook" fieldid="kw" fieldname="label" options={dinamic_options} onFieldName={onFieldName} value={values.input_hook} onChange={this.onCh} onConfirmChange={this.onConfirmChangeSelect} placeholder="Hook" />    
                            <button type="button" onClick={this.onDinamicSet} className="border border-gray-400 rounded bg-gray-200 px-2 py-0.5">Dinamic Set</button>
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