import React from "react";
import {ISelectProps} from "./types";
import Select from "./Select";
import { isEqual } from "./utils";

type IselectListPropsExtend=Omit<ISelectProps,"options" | "loading">

type IselectListProps = IselectListPropsExtend  & {
    url:string
    params?:any
}

type IselectListState = {
    loading:boolean
    options:any[]
}

class SelectList<P extends IselectListProps,S extends IselectListState> extends React.Component<P,S>
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
        

        fetch(url,{
            headers:{
                'accent':'text/json, application/json',
            },
        })
        .then((res:Response)=>{ return res.json() })
        .then((res:any)=>{
            const options:any[]=Array.isArray(res)?res
                                :typeof res==='object' && Array.isArray(res.records)?res.records
                                :[];
            this.setState({loading:false,options});
        });
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