import React from "react";
import Test00 from "./Test.00";

type IAItemProps = {
    tabIndex:number
    index:number
    children:React.ReactNode
    onTab?:(tabIndex:number)=>void
}

function Aitem(props:IAItemProps)
{
    const active=props.tabIndex===props.index;
    const onClick=(e?:React.MouseEvent)=>{
        if(e) e.preventDefault();
        if(active) return;
        if(typeof props.onTab==='function') props.onTab(props.index);
    };

    return (
        <a onClick={onClick} className={`px-5 py-[3px] border-l border-t border-r rounded-tl-lg rounded-tr-lg relative -bottom-[0.075em] select-none ${active?'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-600':'bg-gray-200 text-gray-400 hover:text-gray-500'}`}>
            <span>
                {props.children}
            </span>
        </a>
    );
}

type Iprops = {

}

type Istate = {
    tabIndex:number
}

class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    constructor(props:P)
    {
        super(props);
        this.state=this.gState(props);
    }

    protected gState=(props?:P):S=>
    {
        return {
            tabIndex:0
        } as S;
    }

    protected onTab=(tabIndex:number)=>
    {
        if(this.state.tabIndex!==tabIndex)
        {
            this.setState({tabIndex:tabIndex});
        }
    }

    protected rdTbHdr=():any=>
    {
        const {tabIndex}=this.state;
        return (
            <div>
                <div className="px-3">
                    <div className="relative -bottom-[0.5em">
                        <div className="px-6">
                            <div className="flex gap-2">
                                <Aitem tabIndex={tabIndex} onTab={this.onTab} index={0}>Component</Aitem>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected rdTbCnt=():any=>
    {
        const {tabIndex}=this.state;
        return (
            <div className="border rounded-tl-lg rounded-tr-lg border-gray-300">
                <div className="p-6 min-h-[200px]">
                    {(tabIndex===0) && <Test00 />}
                </div>
            </div>
        );
    }

    render()
    {
        return (
            <div className="p-6">
                <div className="container mx-auto">
                    <div className="mb-4">
                        <div className="text-lg leading-4">SelectList</div>
                        <div className="text-sm text-gray-500">Select dimana optionnya diambil melalui ajax/XHR</div>
                    </div>
                    {this.rdTbHdr()}
                    {this.rdTbCnt()}
                </div>
            </div>
        );
    }
}

export default (props:Iprops)=><Comp {...props} />