import React from "react";
import { ISelectProps, ISelectState, Ioption } from "./types";
import {toArrayString, isEqual, generateOptions, random_string, getFocusElement, toStr} from "./utils";
import DropDown from "./DropDown";


class Select<P extends ISelectProps,S extends ISelectState> extends React.Component<P,S>
{
    protected _id:string;
    protected _id_options:string;
    protected ndSelect:HTMLDivElement|null=null;
    protected ndInput:HTMLInputElement|null=null;
    protected ndDrobBox:HTMLDivElement|null=null;
    protected selectedValues:any[]=[];
    protected options:Ioption[]=[];
    protected options_b:string[]=[];
    protected _lsoutside:boolean=false;
    protected _lsenter:boolean=false;

    constructor(props:P)
    {
        super(props);

        this._id=random_string();
        this._id_options=`${this._id}_option`;

        this.athProps(props);
        this.prepValues(props);
        this.state=this.gState(props);
    }

    protected gState=(props:P):S=>
    {
        return {
            focus:false,
            open:false,
            keyword:'',
            label:'',
            emit:0,
        } as S;
    }

    protected athProps=(props?:P)=>
    {
        props=props||this.props;
        const {options,options_b}=generateOptions({
            options:props.options,
            fieldid:props.fieldid,
            fieldname:props.fieldname,
            onFieldName:props.onFieldName,
        });

        this.options=options;
        this.options_b=options_b;
    }

    // prepare array values
    protected prepValues=(props?:P):boolean=>
    {
        props=props||this.props;
        const newValues=toArrayString(props?.value);
        const changed=!isEqual(newValues,this.selectedValues);
        if(!changed) {
            return false;
        }

        this.selectedValues=newValues.filter((n:string)=>{ return this.options_b.indexOf(n)>=0 });
        return true;
    }  

    protected callChange=():boolean=>
    {
        if(typeof this.props.onChange==='function')
        {
            const props=this.props;
            const value=props.multiple?this.selectedValues.slice(0):this.selectedValues[0]||null;
            const target:any={
                name:props.name,
                value,
            };

            //  bind array data
            const datas:any[]=[];
            for(let i=0; i<this.selectedValues.length; i++)
            {
                const iof=this.options_b.indexOf(this.selectedValues[i]);
                const opt={... this.options[iof]};
                datas.push(opt);
                if(!props.multiple) break;
            }

            target.data=props.multiple?datas:datas[0]||null;

            const e:any={
                target,
                currentTarget:{...target},
                preventDefault:function(){},
                stopPropagation:function(){},
            };            

            this.props.onChange(e);  
            return true;
        }
        return false
    }      

    protected callConfirmChange=(value:string,method:"add"|"delete"):boolean=>
    {
        //console.log("calConfirm",method,"value",value,'iof',this.selectedValues.indexOf(value));

        if(method==="add" && this.selectedValues.indexOf(value)>=0) return false;
        if(method==="delete" && this.selectedValues.indexOf(value)<0 ) return false;

        let yes:boolean=true;
        const multiple=this.props.multiple!==undefined && this.props.multiple!==null?this.props.multiple:false;

        if(typeof this.props.onConfirmChange==='function')
        {
            if(multiple)
            {
                const from=this.selectedValues.slice(0);
                let to=[];
                const iof=this.selectedValues.indexOf(value);
                if(method==="add")
                {
                    to=from.slice(0);
                    to.push(value);
                }
                else {
                    to=from.filter((n:any,idx:number)=>{ return idx!==iof; });
                }
                yes=this.props.onConfirmChange(from,to,multiple);
            }
            else 
            {
                const iof=this.selectedValues.indexOf(value);
                let from:any=undefined;
                let to:any=undefined;
                from=method==="add"?this.selectedValues[iof]:value;
                to=method=="add"?value:undefined;                
                yes=this.props.onConfirmChange(from,to,multiple);
            }            
        }

        if(yes)
        {
            if(multiple) {
                if(method==="add")
                {
                    this.selectedValues.push(value);
                }
                else {
                    this.selectedValues.splice(this.selectedValues.indexOf(value),1);
                }
            }
            else 
            {
                this.selectedValues=[]; // reset array
                if(method==="add")
                {
                    this.selectedValues.push(value);
                }
            }
        }

        return yes;
    }

    protected syncCallChange=(cb?:()=>void)=>
    {
        const callCB=()=>{
            if(typeof cb==='function') cb();
        };

        this.forceUpdate(()=>
        {
            if(this.callChange())
            {
                const prep=this.prepValues();
                if(prep){ 
                    this.forceUpdate(callCB);
                    return;
                }
                callCB();
            }
            else {
                callCB();
            }
        });
    }
    

    protected onInputFocus=(e:React.FocusEvent<HTMLInputElement>)=>
    {
        this.setState({focus:true,open:true});
    }

    protected onInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>
    {
        const value=e.target.value;
        this.setState({keyword:value,label:toStr(value).toString().trim()});
    }

    protected onInputBlur=(e:React.FocusEvent<HTMLInputElement>)=>
    {
        if(this._lsoutside) {
            this.setState({focus:false});
            return
        };

        if(this.ndSelect)
        {
            requestAnimationFrame(()=>
            {
                const efocus=getFocusElement();
                const containts=efocus && (this.ndSelect as HTMLElement).contains(efocus);                
                if(!containts)
                {
                    this.setState({open:false});
                }
                else {
                    this.setState({focus:false});
                }
            });
        }
    }

    protected hideOutSideClick=(e:MouseEvent)=>
    {
        if(!this.ndSelect) return;

        if(!(e.target instanceof HTMLElement)) return;

        const target:HTMLElement=e.target as HTMLElement;
        const closest=target.closest(`#${this._id}`);
        const must_close_focus=!closest;
        if(must_close_focus)
        {            
            if(this.state.focus || this.state.open)
            {
                this.setState({focus:false,open:false});
            }
        }
        else {
            this._lsoutside=true;
            requestAnimationFrame(()=>{
                this._lsoutside=false;
            })
        }
    }

    protected onInputKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>
    {
        if(!this.ndDrobBox) return;

        let key=(e.key).toLowerCase().trim();
        const is_enter=key==='enter';
        const is_backspace=key==='backspace';
        const is_down=key==='arrowdown';
        const is_up=key==='arrowup';

        if(is_enter)
        {
            const elsa=this.ndDrobBox.querySelector('.SelectItem.focus');
            if(elsa)
            {
                const id=elsa.getAttribute('data-value')||'';
                if(id.length>0)
                {
                    const iof=this.options_b.indexOf(id);
                    const opt:Ioption|undefined=iof>=0?this.options[iof]:undefined;
                    if(opt && this.selectedValues.indexOf(opt.__id)<0)
                    {   
                        if(this.callConfirmChange(opt.__id,"add"))
                        {
                            this.syncCallChange(()=>
                            {
                                const focus=this.props.multiple!==undefined && this.props.multiple!==null?this.props.multiple:false;
                                this.setState({label:opt.__id,focus},this.callChange);                            
                            });
                        }
                    }
                }
            }           
        }
        else if (is_down || is_up)
        {
            e.preventDefault(); // prevent
            const dropdown =this.ndDrobBox.querySelector('.SelectItems');
            if(dropdown)
            {
                const childs = dropdown.children; // get all dropdown elements
                if(childs.length>0)
                {
                    let i=0, j=0;
                    let focusFirst:boolean=false;
                    let selectFist:boolean=false;
                    let focusIndex=0;
                    let selectedIndex=0;
                    let foundFocus:boolean=false;
                    let foundSelect:boolean=false;
                    const cls='focus';
                    for(let c of childs)
                    {
                        const hfocus=c.classList.contains(cls);
                        const hsel=c.classList.contains('selected');
                        if(hfocus)
                        {
                            if(is_down)
                            {
                                focusIndex=j;
                            }
                            else {
                                if(!focusFirst)
                                {
                                    focusFirst=true;
                                    focusIndex=j;
                                }
                            }
                            foundFocus=true;
                        }

                        if(hsel)
                        {
                            if(is_down)
                            {
                                selectedIndex=j;
                            }
                            else {
                                if(!selectFist)
                                {
                                    selectFist=true;
                                    selectedIndex=j;
                                }
                            }
                            foundSelect=true;
                        }      

                        c.classList.remove(cls);
                        j++;
                    } 
                    if(foundSelect || foundFocus) 
                    { 
                        i=foundFocus?focusIndex:selectedIndex;

                        if(is_down) { i++; } else { i--; } 
                        i=i<0?0:(i>childs.length-1?childs.length-1:i);
                    }                    
                    if(childs[i])
                    {
                        childs[i].classList.add(cls);
                        childs[i].scrollIntoView({
                            block:'center',
                            inline:'center',
                        });
                    }
                }
                
            }
        }
        else if(is_backspace)
        {
            //remove last element selected
            if(this.props.multiple && this.state.keyword==="" && this.selectedValues.length>0)
            {
                if(this.callConfirmChange(this.selectedValues[this.selectedValues.length-1],"delete"))
                {
                    this.setState({label:''},this.syncCallChange);
                }                
            }
        }
    }   

    protected onClickSelect=(opt:Ioption)=>
    {
        if(this.selectedValues.indexOf(opt.__id)>=0) return;

        if(this.callConfirmChange(opt.__id,"add"))
        {            
            this.setState({label:opt.__label},this.syncCallChange);
        }    
    }

    // remove by data props.multiple
    protected onClickRem=(opt?:Ioption)=>
    {
       if(!opt) return;

       if(this.callConfirmChange(opt.__id,"delete"))
       {
            this.syncCallChange();
       }
    }

    // onchange element single
    protected onClickRemLast=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        if(this.selectedValues.length>0)
        {
            const iof=this.options_b.indexOf(this.selectedValues[this.selectedValues.length-1]);
            const opt:Ioption=this.options[iof];
            if(this.callConfirmChange(opt.__id,"delete"))
            {
                this.syncCallChange();
            }
        }
    }

    // 
    protected onToggleOpen=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        this.setState({open:!this.state.open});
    }

    componentDidMount()
    {
        window.addEventListener("mousedown",this.hideOutSideClick);
    }

    componentWillUnmount()
    {
        window.removeEventListener("mousedown",this.hideOutSideClick);
    }    
    
    componentDidUpdate(prev: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void 
    {
        const sama_props=isEqual(prev.options,this.props.options);        
        const sama_value=isEqual(prev.value,this.props.value);
        const sama_load=prev.loading===this.props.loading;

        const harus_update1=(!sama_props || !sama_value);        
        const harus_update2=!sama_load;


        if(harus_update1)
        {
            this.athProps(this.props);
            this.prepValues(this.props);
        } 
        
        if(harus_update1 || harus_update2)
        {
            this.forceUpdate();
        }
    }
    

    render()
    {
        const props=this.props;
        const {multiple,loading}=props;
        const {focus,open,keyword}=this.state;
        const single=!multiple;
        const is_selected=this.selectedValues.length>0;
        const empty_keyword=[""," "].indexOf(keyword)>=0;
        
        let show_label=(!is_selected) || (!focus);//;

        type IInputProps=React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        const inputProps:IInputProps={
            className:`SelectInput ${focus?'show':'hide'}`,
            value:keyword,
            onChange:this.onInputChange,
            onFocus:this.onInputFocus,
            onBlur:this.onInputBlur,
            onKeyDown:this.onInputKeyDown,
            spellCheck:"false",
        };       

        return (
            <div ref={fn=>this.ndSelect=fn} id={this._id} className={`Select ${multiple?'multiple':'single'} ${focus?'focus':''} ${open?'open':''}`}>                
                <div className={`SelectWrap`}>
                    <div className={`SelectBox`}>
                        <div className={`SelectControls`}>
                            {(!is_selected && (!focus || (focus && empty_keyword)) && props.placeholder) && <div className="SelectPlaceholder">{props.placeholder}</div>}
                            {(is_selected) && 
                                this.selectedValues.map((fid:string)=>{ 
                                    const iof=this.options_b.indexOf(fid);
                                    let opt:Ioption=this.options[iof];
                                    if(!opt) return null;

                                    return <div className={`SelectLabel ${show_label?'show':'hide'}`}><div className="SelectLabelVal" dangerouslySetInnerHTML={{__html:opt.__html}} />{multiple && <div onClick={(e:React.MouseEvent)=>{ e.preventDefault(); this.onClickRem(opt)}} className="SelectLabelValRem"><CloseSVG /></div>}</div>
                                }) 
                            }
                            <input ref={fn=>this.ndInput=fn} {...inputProps}  />
                        </div>
                        <div className={`SelectArrows`}>
                            {(single && is_selected) && <span className={`SelectArrow SelectArrowRemove`} onClick={this.onClickRemLast}><CloseSVG /></span>}
                            <span onClick={this.onToggleOpen} className={`SelectArrow SelectArrowDropDown`}></span>
                        </div>
                    </div>
                    {loading && <div className="SelectLoading"></div>}
                </div>    
                <div ref={fn=>this.ndDrobBox=fn} className={`SelectDropBox`}>
                    <DropDown 
                        name={props.name}
                        id_options={this._id_options}

                        options={this.options} 
                        keyword={keyword}
                        onBlur={this.onInputBlur}
                        
                        onClickSelect={this.onClickSelect}
                        selectedValues={this.selectedValues}

                        multiple={props.multiple}
                        
                    />
                </div>            
            </div>
        );
    }
}


type IcloseSvgProps = {
    className?:string
}

function CloseSVG(props:IcloseSvgProps)
{
    return (<svg className={props.className} height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path className={props.className} d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>);
}

export default Select;