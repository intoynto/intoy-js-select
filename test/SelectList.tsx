import React from "react";
import {isEqual, toStr} from "intoy-utils";
import {ajax, Iajax, ajaxCache } from "intoy-xhr";
import {Select} from "../src/Select";

export type ISelectListProps = {
    url:string
    params?:any
    method?:string
    name:string
    value:string | number | null | undefined
    fieldid:string
    fieldname:string
    placeholder?:string
    multiple?:boolean
    sortField?:string
    useCache?:boolean
    cacheExpire?:number
    onFieldName?:(data:any)=>void    
    onChange:(e:any)=>void
}

export type ISelectListState = {
    loading:boolean
}

export class SelectList<P extends ISelectListProps, S extends ISelectListState> extends React.Component<P,S>
{
    protected options:Array<any>;
    protected chosenOptions:Array<any> | any;

    constructor(props:P){
        super(props);            

        this.options=[];
        this.chosenOptions=[];
        this.onReload=this.onReload.bind(this); 
        this.doLoad=this.doLoad.bind(this);
        this.state=this.getInitialState();
    }
    
    getInitialState():S 
    {
        return {loading:false} as S
    }

    applyAftRes=()=>{
        this.chosenOptions=[];           
        if(this.options.length>0 && this.props.sortField)
        {            
            this.options.sort((a:any,b:any)=>{
                const val_a=a[this.props.sortField];
                const val_b=b[this.props.sortField];
                return val_a>val_b?1:(val_a<val_b?-1:0);
            });           
        }

        if(this.options.length>0 && typeof this.props.onFieldName==="function"){            
            let fieldname=toStr(this.props.fieldname).toString().trim();
            let fieldid=toStr(this.props.fieldid).toString().trim();        
            fieldid=fieldid.length<1?fieldname:fieldid;
            const dataKeys=[];
            for(let i=0; i<this.options.length; i++){
                const o=this.options[i];                
                if(typeof o!=="object") continue;
                // copy to origin
                for(let p in o)
                {
                    o[p+'_origin_']=o[p];
                }
                let valueId=toStr(o[fieldid]).toString().trim();               
                if (dataKeys.indexOf(valueId)>=0) continue;

                let label=toStr(o[fieldname]);
                label = label.length < 1 ? valueId : label;
                try{
                    const test:any=this.props.onFieldName(o);
                    if(typeof test==="string" && toStr(test).length>0){
                        label=toStr(test).toString().trim();
                    }                    
                }
                catch(e){
                    
                }
                dataKeys.push(valueId);
                const ops={...o};
                // mixing name and value id
                ops[this.props.name]=valueId;
                ops[fieldid]=valueId;
                ops[fieldname]=label;                  
                this.chosenOptions.push(ops);
            }
        }
        else {
            this.chosenOptions=this.options;
        }
    }
    
    doLoad(){
        let url=toStr(this.props.url).toString().trim();        

        if(url.length<1) return;

        const se:Iajax={
            url:url,
            method:this.props.method?this.props.method:"GET",
            params:{...this.props.params}
        };
        //const headers=getConfigHeader();
        //if(Headers){
        //    se.headers={...headers};
        //}

        const useCache=this.props.useCache!==undefined && this.props.useCache!==null?this.props.useCache:true;

        if(useCache)
        {         
            console.log("cachening");
            ajaxCache(se,this.props.cacheExpire)
            .then((n:any)=>{
                console.log("dende ",n);
                this.options=Array.isArray(n) && n.length>0?n.slice(0)
                            :typeof n==='object' && n.records && Array.isArray(n.records)?n.records.slice(0)
                            :[];
                console.log("machints",this.options);
                this.applyAftRes();
                this.setState({loading:false});
            })
            .catch((e)=>{
                console.log("cathing",e);
                this.setState({loading:false});
            });
            return;
        }
        
        ajax(se)
        .then((n:any)=>{    
            this.options=Array.isArray(n) && n.length>0?n.slice(0)
                            :typeof n==='object' && n.records && Array.isArray(n.records)?n.records.slice(0)
                            :[];
            this.applyAftRes();
            this.setState({loading:false});
        })
        .catch(()=>{
            this.setState({loading:false});
        });
    }

    onReload(){
        let url=toStr(this.props.url).toString().trim(); 
        if(url.length<1) return;
        this.setState({loading:true},this.doLoad);
    }

    componentDidMount(){        
        this.onReload();
    }

    componentDidUpdate(prev:P){
        const satu=!isEqual(this.props.params,prev.params);
        const harus=satu;        
        if(harus)
        {           
            this.onReload();
        }
    }

    render()
    {
        const props=this.props;
        const forward:any={            
            name:props.name,    
            loading:this.state.loading,   
            onChange:this.props.onChange,    
            value:this.props.value, 
            fieldid:this.props.fieldid,
            fieldname:this.props.fieldname,
            placeholder:this.props.placeholder,                     
        };       

        const p=this.props as any;
        
        if(p.multiple===true){
            forward.multiple=true; 
        }
        
        console.log("passProps to chosen");
        console.log(p);
        console.log(this.chosenOptions);
        return (
            <Select {...forward as any} options={this.chosenOptions} />
        )
    }
}