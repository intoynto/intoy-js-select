import React from "react";
import Select from "../../src/Select";
import { optionsWilayah } from "../shareds";
import { random_string, toStr } from "../../src/utils";
import { IAnyEvent } from "../../src/types";
import { Headsub } from "../any/Headsub";

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
        values[e.target.name]=e.target.value;
        this.setState({values:{...values}});
    }

    protected onDinamicSet=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        const {dinamic_options}=this.state;
        const dnto=dinamic_options.length>0?[]:optionsWilayah.slice(5);
        this.setState({dinamic_options:dnto});
    }

    protected onConfirmChangeSelect=(from:any,to:any,multiple:boolean):boolean=>
    {
        let ignore=true;
        const yes_to=to!==undefined && to!==null && Array.isArray(to) && to.length>0;
        if(from!==undefined && from!==null && !yes_to)
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
                <Headsub title="Konfirmasi Nilai">
                    Hampir sama dengan prevent value. Akan tetapi ditambahkan method untuk konfirmasi nilai akah disetujui atau tidak (ignore). Klik dinamic set untuk mengeset options. Buka dropdown pilih salah satu nilai. Kemudian klik tanda silang, maka nilai tetap bertahan dengan nilai sebelumnya.
                </Headsub>
                <Container>
                    <div className="flex gap-1.5 pt-2">
                        <Select name="input_hook" fieldid="kw" fieldname="label" multiple options={dinamic_options} onFieldName={onFieldName} value={values.input_hook} onChange={this.onCh} onConfirmChange={this.onConfirmChangeSelect} placeholder="Hook" />    
                        <button type="button" onClick={this.onDinamicSet} className="border border-gray-400 rounded bg-gray-200 px-2 py-0.5">Dinamic Set</button>
                    </div>
                </Container>
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