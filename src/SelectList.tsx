import React from "react";
import {ISelecListProps,ISelectListState} from "./types";
import { isEqual } from "./utils";
import Select from "./Select";

class SelectList<P extends ISelecListProps,S extends ISelectListState> extends React.Component<P,S>
{
    constructor(props:P)
    {
        super(props);
        this.state={
            loading:false,
            options:[] as any[],
        } as S;
    }

    protected onLoad=async(e?:React.MouseEvent)=>
    {
        if(this.state.loading)
        {
            this.doLoad();
            return;
        }
        this.setState({loading:true},this.doLoad);
    }

    protected doLoad=async()=>
    {
        const props=this.props;
        const closeLoad=()=>{
            if(this.state.loading)
            {
                this.setState({loading:false});
            }
        };

        let url=normalizeUrl(props.url);
        if(url.length<1)
        {
            closeLoad();
            return;
        }

        let promise:Promise<Response>|undefined=undefined;
        if(typeof props.loader==='function')
        {
            promise=props.loader(url,props.params);
        }

        if((!promise) || !(promise instanceof Promise))
        {
            promise=fetch(url,{
                headers:{
                    'accent':'text/json, application/json',
                },
            });
        }
       
        promise
        .then((res:Response)=>{ return res.json() })
        .then((res:any)=>
        {
            // callable on response
            if(typeof props.onResponse==='function')
            {
                props.onResponse(res);
            }

            const options:any[]=Array.isArray(res)?res
                                :typeof res==='object' && Array.isArray(res.records)?res.records
                                :[];
            if(typeof props.onSort==='function')
            {
                // call props on sort
                props.onSort(options,props.sortField);
            }
            else 
            {
                // manual handled sort
                this.prepSort(options);
            }            

            this.setState({loading:false,options});
        })
        .catch((err:any)=>{
            console.error("Catch load from : ",url);
            this.setState({loading:false});
        });
       
    }

    protected prepSort=(options:any[])=>
    {
        if(Array.isArray(options) && options.length>0)
        {
            const props=this.props;
            let sortField=(props.sortField||'').toString().trim();
            if(sortField.length>0)
            {
                options.sort((a:any,b:any)=>{
                    const val_a=a[sortField];
                    const val_b=b[sortField];
                    return val_a>val_b?1:(val_a<val_b?-1:0);
                });
            }
        }
    }

    componentDidMount()
    {
        this.onLoad();        
    }

    componentDidUpdate(prev: Readonly<P>, prevState: Readonly<S>, snapshot?: any)
    {
        const sama_url=prev.url===this.props.url;
        const sama_params=isEqual(prev.params,this.props.params);
        const harus_update=(!sama_url) || (!sama_params);
        if(harus_update)  
        {
            this.onLoad();
        }
    }

    render()
    {
        const props=this.props;
        const {loading,options}=this.state;
        const fwProps:any={...props};
        delete fwProps.url;
        delete fwProps.params;
        return <Select {...fwProps} loading={loading} options={options} />;
    }
}

function normalizeUrl(url:string,params?:any):string
{
    const s=new URLSearchParams();
    let use_params:boolean=false;
    if(params && typeof params==='object')
    {
        for(let p in params)
        {
            const val=(params[p]||'').toString().trim();
            if(val.length>0)
            {
                use_params=true;
                s.append(p,val);
            }
        }
    }
    url=(url||'').toString().trim();
    if(use_params && url.length>0)
    {
        url+=url.endsWith('?')?'':'?';
        url+=s.toString();
    }
    return url;
}

export default SelectList;