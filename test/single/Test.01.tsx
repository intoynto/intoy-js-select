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
        } as any;
    }   

    private onCh=(e:IAnyEvent)=>
    {
        const {values}=this.state;
        values[e.target.name]=e.target.value;
        this.setState({values:{...values}});
    }

    private onApplyValue=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        const {values}=this.state;
        values.set_apply_value=values.apply_value;
        console.log('appy value to :',values.set_apply_value);
        this.setState({values:{...values}});
    }

    render()
    {
        const {values}=this.state;
        const {apply_value,set_apply_value}=values;
        const multiValue:string[]|number[]=[];//[5,10];
        const singleValue:string|number='';
        return (
            <div>
                <Headsub title="Set Value">
                    Pemberian nilai / value
                </Headsub>                   
                <Container asForm>

                    <div className="flex gap-3">
                        <div><input type="text" className="border border-gray-400 rounded" placeholder="Another Input" /></div>
                        <Select name="kw" fieldid="kw" fieldname="label" options={optionsWilayah} onFieldName={onFieldName} value={set_apply_value?set_apply_value:values.kw} onChange={this.onCh} placeholder="Input Single P?" />
                        <div><input type="text" className="border border-gray-400 rounded" placeholder="Another Input" /></div>
                    </div>

                    <div className="pt-2">
                        <div className="flex gap-2">
                            <div>Test Set Value</div>
                            <div><input name="apply_value" value={values.apply_value} onChange={this.onCh} className="border border-gray-400 rounded" type="text" /></div>
                            <div><button onClick={this.onApplyValue} className="border px-2 bg-gray-200 rounded">Apply Value</button></div>
                        </div>
                    </div>                       

                    <div className="flex gap-1.5 pt-2">
                        <button type="submit" className="border border-gray-400 rounded bg-gray-200 px-2 py-0.5">For Test Is Submited Keydown Enter</button>
                        <a href="/">Home Url</a>
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

type IasHtmlOptionProps = {
    multiple?:boolean
}

let _select_names:number=0;

function AsHtmlOption(props:IasHtmlOptionProps)
{
    _select_names++;
    let name=props.multiple?'input_multi':'input_single';
    name+='_'+_select_names.toString();

    const onChange=(e:React.ChangeEvent<HTMLSelectElement>)=>
    {
        console.log('change. ',e.target.name,':',e.target.value);
    };

    return (
        <div>
            <div className="flex gap-2 pt-4">
                <div>{props.multiple?"Multiple":"Single"} HTML Option</div>
                <select id={name} name={name}  className="border border-gray-400" onChange={onChange} multiple={props.multiple}>{optionsWilayah.map((r:any)=>{ return <option value={r.kw}>{r.label}</option>})}</select>
            </div>                                    
        </div>
    );
}

export default Comp;