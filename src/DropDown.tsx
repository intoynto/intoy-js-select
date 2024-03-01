import React from "react";
import { Ioption } from "./types";

type IdropDownProps = 
{
    name:string
    id_options:string   
    options:Ioption[]
    keyword:string
    selectedValues?:string[]
    multiple?:boolean
    onBlur?:(e:React.FocusEvent<HTMLInputElement>)=>void

    onClickSelect?:(opt:Ioption)=>void
}

type IdropDownState = {

}

class Comp<P extends IdropDownProps, S extends IdropDownState> extends React.Component<P,S>
{
    protected onClickSelect=(e?:React.MouseEvent,opt?:Ioption)=>
    {
        if(e) e.preventDefault();
        if(!opt) return;

        if(typeof this.props.onClickSelect==='function')
        {
            this.props.onClickSelect(opt);
        }
    }    

    render()
    {
        const props=this.props;

        const keyword=(props.keyword||'').toString().trim().toLowerCase();
        const regexp=new RegExp(keyword);

        const matchReg=(text:string)=>{
            text=(text||'').toString().trim().toLowerCase();
            return regexp.test(text);
        };
        
        type ihtmlSelectProps=React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
        //type IinputProps=React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

        let idx_name:number=0;
        const inputs:any[]=[];
        return (
            <div className={`SelectDropDown`} onBlurCapture={props.onBlur}>
                <div className="SelectItems">
                    {props.options.map((r:Ioption,idx:number)=>
                    {
                        let match=(keyword.length<1) || (matchReg(r.id) || matchReg(r.__label));

                        if(!match) return null;

                        const selected=Array.isArray(props.selectedValues) && props.selectedValues.indexOf(r.__id)>=0;   
                        if(selected)                     
                        {
                            let name=props.name;

                            if(props.multiple)                            
                            {
                                name+=`[${idx_name}]`;                                
                            }
                            inputs.push(<input name={name} value={r.__id} type="hidden" style={{display:"none"}}/>);
                            idx_name++;
                        }

                        return (
                            <div onClick={(e:React.MouseEvent)=>{ this.onClickSelect(e,r); }} className={`SelectItem ${selected?'selected':'' } `} data-value={`${r.__id}`} dangerouslySetInnerHTML={{__html:r.__html}} />
                        );
                    })}
                </div>
                {inputs}
            </div>
        );
    }
}

export default Comp;