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
        const old_value=values[e.target.name];
        let new_value=e.target.value;
        if(e.target.name==='input_hook')
        {            
            console.log("hook target. ",new_value);            
            const is_old_value=(Array.isArray(old_value) && old_value.length>0) || (old_value && old_value.length>0);
            const is_new_value=(Array.isArray(new_value) && new_value.length>0) || (new_value && new_value.length>0);
            if(is_old_value && !is_new_value)
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
        this.setState({dinamic_options:dnto});
    }   

    render()
    {
        const {values,dinamic_options}=this.state;           
        return (
            <div>
                <Headsub title="Prevent Value">
                  Menahan nilai  / value. Klik Dinamic Set, lalu pilih salah 1 value, Kemudian klik tanda silang setelah value terpilih, maka value tetap bertahan di nilai sebelumnya
                </Headsub>
                <Container>
                    <div className="flex gap-1.5 pt-2">
                        <Select name="input_hook" fieldid="kw" fieldname="label" multiple options={dinamic_options} onFieldName={onFieldName} value={values.input_hook} onChange={this.onCh} placeholder="Hook" />    
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