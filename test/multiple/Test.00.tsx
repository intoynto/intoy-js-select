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

    render()
    {
        return (
            <div>
                <Headsub title="Tanpa Event">
                    <div>Coba untuk berpindah-pindah focus. Atau membuka dropdown</div>
                </Headsub>
                <Container>                       
                    <div className="flex gap-1.5 pt-2">
                        <div><input type="text" className="border border-gray-400 rounded" placeholder="Another Input" /></div>
                        <Select name="input_hook" fieldid="kw" fieldname="label" multiple options={optionsWilayah} onFieldName={onFieldName} placeholder="Debug Lifcircle" />    
                        <div><input type="text" className="border border-gray-400 rounded" placeholder="Another Input" /></div>
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