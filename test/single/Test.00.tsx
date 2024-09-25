import React from "react";
import Select from "../../src/Select";
import { optionsWilayah } from "../shareds";
import { toStr } from "../../src/utils";
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
    private value1:any;

    private onCh=(e:any)=>
    {
        console.log('onchange',e);        
        this.value1=e.target.value;
        this.forceUpdate();
    }
    render()
    {
        console.log('value ',this.value1);
        return (
            <div>
                <Headsub title="Tanpa Event">
                    <div>Coba untuk berpindah-pindah focus. Atau membuka dropdown</div>
                </Headsub>
                <Container>                       
                    <div className="grid gap-1.5 pt-2">
                        <div><input type="text" className="border border-gray-400 rounded" placeholder="Another Input" /></div>
                        
                        <div>
                            <Select onChange={this.onCh} value={this.value1} name="input_hook" fieldid="kw" fieldname="label" options={optionsWilayah} onFieldName={onFieldName} placeholder="Debug Lifcircle" />    
                        </div>
                        
                        <div><input type="text" className="border border-gray-400 rounded" placeholder="Another Input" /></div>
                        {/*
                        <div>
                            <div>Test popup no value</div>
                            <Select name="input_hook" fieldid="kw" fieldname="label" placeholder="Popup no values" /> 
                        </div>
                        */}
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