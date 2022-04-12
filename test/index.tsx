import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Plot } from "./Plot";
import {Select} from "../src/Select";
import {Iajax,ajax} from "intoy-xhr";
import {IAnyEvent} from "../src/types";
import { ChosenOrg } from "./ChosenOrg";

type IappProps = {

}

type IappState = {
    multiple:boolean
}

function onFieldName(dt:any)
{
    return `<b>${dt.value}</b> ${dt.label}`;
}

class App<P extends IappProps,S extends IappState> extends React.Component<P,S>
{
    protected ndForm:any=null;
    protected value:any="";
    protected value2:string[]=[];

    constructor(props:P)
    {
        super(props);
        this.state={
            multiple:false
        } as S;
    }

    protected onSubmit=(e:React.FormEvent<HTMLFormElement>)=>
    {
        e.preventDefault();
        
        
        const se:Iajax={
            url:'http://localhost/1050-sshkota/api/test',
            method:'POST',
            formElement:this.ndForm
        };
        ajax(se)
        .then(()=>{});
    }

    private onCh=(e:IAnyEvent)=>
    {
        if(!e.target.value && this.value)
        {
            this.forceUpdate();
            return;
        }

        this.value=e.target.value;
        this.forceUpdate();
    }

    private onCh2=(e:IAnyEvent)=>
    {
        const {value}:{value:any}=e.target;
        this.value2=Array.isArray(value)?value.slice(0):[];
        this.forceUpdate();
        //console.log("change 2",e.target.value);
    }

    render() 
    {
        const {multiple}=this.state;
        const ops1:any[]=[
            {value:1,label:'Molosipat'},
            {value:2,label:'Buladu'},
            {value:3,label:'Pilolodaa'},
            {value:4,label:'Lekobalo'},
            {value:5,label:'Dembe'},
            {value:6,label:'Iluta'},
            
            {value:7,label:'Bua'},
            {value:8,label:'Huntu'},
            {value:9,label:'Payunga'},
            {value:10,label:'Tabongo Timur'},
            {value:11,label:'Tabongo Barat'},
            {value:12,label:'Limehe Timur'},
            {value:13,label:'Limehe Barat'},
            {value:14,label:'Sombari'},
            {value:15,label:'Bongomeme'},
            {value:16,label:'Isimu'},
            {value:17,label:'Buhu'},
            {value:18,label:'Labanu'},
            {value:19,label:'Pontolo'},
            {value:20,label:'Molinggapoto'},
            {value:21,label:'Titidu'},
            {value:22,label:'Bulalo'},
            {value:23,label:'Moluo'},
            {value:24,label:'Gentuma'},
            {value:25,label:'Antinggola'},
            {value:26,label:'Pinogaluman'},
            {value:27,label:'Buko'},
            {value:28,label:'Boroko'},
            {value:29,label:'Sangkub'},
            {value:30,label:'Lolak'},
            {value:31,label:'Poigar'},
            {value:32,label:'Amurang'},
            {value:33,label:'Malalayang'},
            {value:34,label:'Manado'},
            {value:35,label:'Kalimat yang panjang digunakan untuk wrapper bagaimana model tampilan'},            
            
        ];
        return (
            <form ref={fn=>this.ndForm=fn} onSubmit={this.onSubmit}>
            
                <div className="relative h-full bg-gray-100">
                    <div className="grid gap-4 p-4">
                        <Plot title="Input Native">
                            <input type="text" name="VelueTest" value={"test value submit"}/>
                        </Plot>
                        
                        <Plot title="Select Chosen Single">
                            <div className="pt-8">
                                <div>Plakabe Value {this.value}</div>
                                <div className="w-[250px]">
                                    <Select onChange={this.onCh} value={this.value} name="ops1" fieldid="value" fieldname="label" options={ops1} onFieldName={onFieldName} />
                                </div>
                                <div className="pt-2">
                                    <button type="button" onClick={e=>{ e.preventDefault(); console.log("button clicked"); this.setState({multiple:!this.state.multiple}) }}>To {this.state.multiple?"Single":"Multiple"}</button>
                                    <div>Value {this.value}</div>
                                </div>
                            </div>
                        </Plot>
                        

                        {/*
                        <Plot title="Select Chosen Multile">
                            <div className="pt-8">
                                <div className="w-250px">
                                    <Select onChange={this.onCh2} multiple value={this.value2} name="ops2" fieldid="value" fieldname="label" options={ops1} onFieldName={onFieldName} />
                                </div>
                                <div className="pt-2">
                                    <button type="button" onClick={e => { e.preventDefault(); this.setState({ multiple: !this.state.multiple }) }}>To {this.state.multiple ? "Single" : "Multiple"}</button>
                                    <div>Value {this.value2.join(",")}</div>
                                </div>
                            </div>
                        </Plot>


                        <Plot title="Select Chosen Ajax">
                            <div className="pt-8">
                                <div className="w-250px">
                                    <ChosenOrg onChange={this.onCh2} value={this.value2} />
                                </div>
                                <div className="pt-2">
                                    <button type="button" onClick={e => { e.preventDefault(); this.setState({ multiple: !this.state.multiple }) }}>To {this.state.multiple ? "Single" : "Multiple"}</button>
                                    <div>Value {this.value2.join(",")}</div>
                                </div>
                            </div>
                        </Plot>
                        */}
                        

                        <Plot title="Input Native Others">
                            <button type="button">Dua</button>
                        </Plot>

                        <Plot title="Action Test">
                            <button type="submit">Submit</button>
                        </Plot>
                    </div>
                </div>

            </form>
        );
    }
}

function render()
{
    const div=document.getElementById("root");
    if(!div) return;
    ReactDOM.render(<App />,div);
}

render();