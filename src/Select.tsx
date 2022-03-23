import React from "react";
import {ISelectProps,ISelectState, ISelectValueTarget} from "./types";
import {getFocusElement, isEqual, isObjectEmpty, stripHtmlTags, toArrayString, toStr} from "./utils";

function triggerClick(el:any)
{
    if(!el) return;
    const event=new Event("click");
    el.dispatchEvent(event);
}

function classRemove(el:any,className:string)
{
    el?(el as HTMLElement).classList.remove(className):null;
}

function classAdd(el:any,className:string)
{
    el?(el as HTMLElement).classList.add(className):null;
}

function elAttr(el:any,attr:string)
{
    return el?(el as HTMLElement).getAttribute(attr):null;
}

function elAttrSet(el:any,key:string,value:string)
{
    el?(el as HTMLElement).setAttribute(key,value):null;
}

function elAttrDel(el:any,key:string)
{
    el?(el as HTMLElement).removeAttribute(key):null;
}

function hasClass(dom:HTMLElement,className:string)
{
    return dom && dom.classList.contains(className);
}

function elFocus(dom:any)
{
    dom && dom.focus && typeof dom.focus==="function"?dom.focus():null;
}

function elInScrollView(view:HTMLElement,child:HTMLElement)
{
    const docViewBottom=view.scrollTop + view.offsetHeight;
    const childBottom=child.offsetTop + child.offsetHeight;
    const inView=((childBottom<docViewBottom) && (child.offsetTop>=view.scrollTop) );   
    if(!inView)
    {
        view.scrollTop=child.offsetTop;        
    }
}

type IcloseSvgProps = {
    className?:string
}
function CloseSvg(props:IcloseSvgProps)
{
    return (
        <svg className={props.className} height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path className={props.className} d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
    );
}

type Igen = {
    __id_:string
    __label_:string
    __labelOrigin_:string
    [key:string]:any
}

class Select<P extends ISelectProps,S extends ISelectState> extends React.Component<P,S>
{
    static version='1';

    protected options:any[]=[];
    protected valueRef:any[]=[];
    protected selectOptions:any[]=[];
    protected values:any[]=[];
    protected dropItems:any=[];
    protected places:any=[];
    protected ndWrap:any=null;
    protected ndSelBox:any=null;
    protected ndSelCtr:any=null;
    protected nDropDown:any=null;
    protected ndSelect:any=null;
    protected ndInput:any=null;
    protected ndNoInput:any=null;
    protected ndTgDrop:any=null;
    protected ndTgRem:any=null;
    protected search:string='';

    constructor(props:P)
    {
        super(props);        
        this.state=this.gInitState(props);
        this.prepValues(props);
        this.prepOptions(props);
        this.prepPlaces(props);        
    }

    protected gInitState=(props?:P)=>
    {
        const s:S={
            focus:false,
            emit:0,
        } as S;
        return s as S;
    }

    protected isMultiple=(props?:P)=>
    {
        props=props||this.props;
        return props.multiple?true:false;
    }

    protected isDisabled=(props?:P)=>
    {
        props=props||this.props;
        return props.disabled?true:false;
    }

    // prepare array values
    protected prepValues=(props?:P)=>
    {
        props=props||this.props;
        const newValues=toArrayString(props?.value);
        const changed=!isEqual(newValues,this.values);
        if(!changed) return;
        this.values=newValues.slice(0);
    }

    // prepare place holder from array values
    protected prepPlaces=(props?:P)=>
    {
        this.places=[];
        if(this.values.length>0)
        {
            const multiple=this.isMultiple();
            for(let i=0; i<this.values.length; i++)
            {
                const iof=this.valueRef.indexOf(this.values[i]);
                const ops:Igen=this.options[iof];
                this.places.push(this.rdrPlace({dngH:ops.__label_,multiple,dataValue:ops.__id_})); 
                if(!this.isMultiple(props)) break;
            }
        }
    }

    protected valuesAdd=(idValue:string)=>
    {
        if(idValue){
            this.values.push(idValue);
            const iof=this.valueRef.indexOf(idValue);
            const ops:Igen=this.options[iof];
            this.places.push(this.rdrPlace({dngH:ops.__label_,multiple:this.isMultiple(),dataValue:ops.__id_}));
        }
    }

    protected rdrPlace=(
        {dngH,multiple,dataValue}:{dngH:string,multiple:boolean,dataValue:string})=>
    {
        return (<div className={`SelectLabel SLRem`} data-value={dataValue}><div className="SelectLabelVal SLRem" dangerouslySetInnerHTML={{__html:dngH}}></div>{multiple && <div className="SelectLabelRem SLRem SLRemDo" role={"button"}><CloseSvg className="SLRem SLRemDo" /></div>}</div>)
    }

    protected valuesRem=(idValue?:string)=>
    {
        if(idValue)
        {
            //remove by value
            let iof=this.values.indexOf(idValue);
            if(iof>=0)
            {
                this.values.splice(iof,1);
                this.places.splice(iof,1);
                return true;
            }
            return false;
        }
        const nol=this.values[0];        
        if(nol)
        {
            const iof=this.valueRef.indexOf(nol);
            this.values.splice(0,1);
            this.places.splice(0,1);
            return true;
        }
    }

    protected itemsPush=(gen:Igen,props?:P)=>
    {
        gen=gen||{};
        const {focus}=this.state;
        const search:string=toStr(this.search).trim().toLowerCase();
        const matchReg=function(text:string)
        {
            text=toStr(text).toString().toLowerCase().trim();
            const mreg=new RegExp(search);
            return mreg.test(text);
        };
        let like:boolean=true;        
        if(focus && search.length>0)
        {
            like=(matchReg(gen.__id_) || matchReg(gen.__label_));
        }
        //console.log({search,id:gen.__id_,_lab:gen.__label_,like});
        if(!like) return;

        const iof=this.values.indexOf(gen.__id_);
        const trueSelected=this.isMultiple(props)?iof>=0:gen.__id_===this.values[0];
        const itemProps:any={
            'data-value':gen.__id_,
            className:`SelectItem ${trueSelected?'selected disabled':''}`,
        };
        //console.log('itemPush focus:',this.state.focus,'from',this.values);
        this.dropItems.push(<li onClick={this.onItemClick} {...itemProps} dangerouslySetInnerHTML={{__html:gen.__label_}}></li>)
    }

    protected prepItems=()=>
    {
        this.dropItems=[];
        this.options.forEach((gen:any)=>{
            this.itemsPush(gen);
        });
    }

    protected prepOptions=(props?:P)=>
    {
        props=props||this.props;
        this.options=[];
        this.valueRef=[];
        this.selectOptions=[]; //clear select options
        this.dropItems=[];
        const multi=this.isMultiple(props);
        if(Array.isArray(props.options) && props.options.length>0)
        {
            let fieldid=toStr(props.fieldid).toString().trim();
            let fieldname=toStr(props.fieldname).toString().trim();
            fieldid=fieldid.length<1?"id":fieldid;
            fieldname=fieldname.length<1?fieldid:fieldname;
            const dataKeys:any=[];
            let selectedCount:number=0;
            for(let i=0; i<props.options.length; i++)
            {
                const o:any=props.options[i];
                if(isObjectEmpty(o)) continue;
                let valueId=toStr(o[fieldid]).toString().trim();
                if(dataKeys.indexOf(valueId)>=0) continue;
                let label=toStr(o[fieldname]);
                label=label.length<1?valueId:label;
                const labelOrigin=label;
                if(typeof props.onFieldName==='function')
                {
                    try {
                        const test=props.onFieldName(o);
                        if(typeof test==="string" && toStr(test).length>0)
                        {
                            label=toStr(test).toString().trim();
                        }
                    }
                    catch(e)
                    {

                    }
                }
                dataKeys.push(valueId);
                this.valueRef.push(valueId);
                const gen:Igen= {
                    ...o,
                    __id_: valueId,
                    __label_:label,
                    __labelOrigin_:labelOrigin
                }

                this.options.push(gen);
                let ops:any={
                    value:gen.__id_,
                    selected:this.values.indexOf(gen.__id_)>=0,
                };         
                selectedCount+=ops.selected?1:0;
                if(!multi && selectedCount>0)
                {
                    ops.selected=false;
                }
                this.selectOptions.push(<option {...ops}>{stripHtmlTags(gen.__label_)}</option>);    
                this.itemsPush(gen,props);
            }
        }
    }

    protected ckInpFocused=()=>{
        if(!this.ndInput) return;

        const focusObj=getFocusElement();        
        if(focusObj && focusObj!==this.ndInput)
        {
            elFocus(this.ndInput);
        }
    }

    protected emit=(cb?:()=>void)=>
    {
        this.setState({emit:this.state.emit+1},cb);
    }

    protected onECh=(e:any)=>
    {
        const {target}:{target:HTMLInputElement}=e;
        this.search=target.value;
        this.prepItems();
        this.emit();
    }

    protected hSWKeyDown=(e:React.KeyboardEvent<HTMLDivElement>)=>
    {
        const key=toStr(e.key).toLowerCase().trim();
        const {focus}=this.state;
        
        const findFocusOrSelect=()=>{
            let elems:any=this.nDropDown.querySelector('.focus');
            if(!elems || elems.length<1) {
                elems=this.nDropDown.querySelector('.selected');
            }
            return elems;
        };

        const findNext=(el:any)=>{
            if (el) {
                el = el.nextElementSibling;
            } else {
                el = this.nDropDown.querySelector(".SelectItems .SelectItem");
            }

            while (el) {
                if (!hasClass(el, "disabled") && el.style.display != "none") {
                    return el;
                }
                el = el.nextElementSibling;
            }
            return null;
        }

        const findPrev=(el:any)=>
        {
            if (el) {
                el = el.previousElementSibling;
            } else {
                el = this.nDropDown.querySelector(".SelectItems .SelectItem");
            }

            while (el) {
                if (!hasClass(el, "disabled") && el.style.display != "none") {
                    return el;
                }
                el = el.previousElementSibling;
            }
            return null;
        }
        
        if(key==='enter')
        {
            if(focus)
            {
                const pop=findFocusOrSelect();
                triggerClick(pop);
            }
            else {
                triggerClick(this.ndWrap);
            }
        }
        else if(key==='backspace')
        {
            if(this.search==="" && this.values.length>0 && this.isMultiple())
            {
                const dataValue=this.values[this.values.length-1];
                if(this.valuesRem(dataValue))
                {
                    this.updSelectValues();
                    this.prepItems();
                    this.emit(this.callPropsChange);
                }
            }
        }
        else if(key==='arrowdown' || key==='arrowup')
        {
            let next=findFocusOrSelect();
            classRemove(next,'focus');
            next=key==='arrowdown'?findNext(next):findPrev(next);
            if(next){
                let t=this.ndTgDrop.querySelector('.focus');
                classRemove(t,'focus');
                classAdd(next,'focus');
                elInScrollView(this.nDropDown,next);
            }
            e.preventDefault();            
        }
        else if(['esc','escape'].indexOf(key)>=0 && focus)
        {
            triggerClick(this.ndWrap);
        }
        else if(!focus) {
            triggerClick(this.ndWrap);
        }
        return false;
    }    

    protected onItemClick=(e:React.MouseEvent)=>
    {
        const optionEl:HTMLElement=e.target as HTMLElement;
        if(!hasClass(optionEl,'disabled'))
        {
            if(this.isMultiple())
            {
                const dataValue=optionEl.getAttribute("data-value")||"";
                if(this.values.indexOf(dataValue)<=-1)
                {                  
                    this.valuesAdd(dataValue);
                    this.updSelectValues();
                    this.search=""; //clear search
                    this.prepItems();
                    this.emit(this.callPropsChange);
                }
            }
            else {
                const dataValue=optionEl.getAttribute("data-value")||"";
                if(this.values.indexOf(dataValue)<=-1)
                {
                    this.values=[]; 
                    this.places=[];
                    this.valuesAdd(dataValue);
                    this.updSelectValues();
                    this.search=""; //clear search
                    this.prepItems();
                    this.emit(this.callPropsChange);
                }
            }
        }
    }

    protected callPropsChange=()=>
    {
        if(!this.ndSelect) return;

        const multi=this.isMultiple();
        let data:any=[];
        if(multi)
        {
            for(let i=0; i<this.values.length; i++)
            {
                const idValue=this.values[i];
                const iof=this.valueRef.indexOf(idValue);
                data.push({...this.options[iof]});
            }
        }
        else {
            const idValue=this.values[0];
            const iof=this.valueRef.indexOf(idValue);
            data.push({...this.options[iof]});
        }
        const e:ISelectValueTarget={
            target:{
                name:this.ndSelect.name,
                value:this.isMultiple()?this.values:this.values[0]
            }
        };
        (e as any).target.data=multi?data:data[0];
        (e as any).currentTarget={...e.target};
        (e as any).preventDefault=function(){};
        typeof this.props.onChange==="function"?this.props.onChange(e as any):null;
    }

    protected updSelectValues=()=>
    {
        if(!this.ndSelect) return;

        if(this.isMultiple())
        {
            this.values.forEach((value:string)=>{
                const selector=`option[value='${value}']`;
                const el=this.ndSelect.querySelector(`option[value='${value}']`);
                elAttrSet(el,'selected','true');
            });
        }
        else {
            this.ndSelect.value=this.values[0];            
        }
    }

    protected hSWClick=(e:React.MouseEvent)=>
    {
        let toFocus:boolean=false;          
        const findNdCtrl=()=>
        {
            const target:HTMLElement=e.target as any;            
            const clickSelCtr=(this.ndSelCtr && this.ndSelCtr.contains(target));
            let t:boolean=clickSelCtr &&
                 (
                     hasClass(target,'SLRem')
                     || hasClass(target,'SLRemDo')
                 )
                ;            
            return t;
        };
        const findParenNode=function(el:HTMLElement,targetClass:string,sibling:number,maxSibling:number):HTMLElement|null
        {
            const tagName=el.tagName.toString().toLowerCase();
            if(tagName==='body') return null;

            if(hasClass(el,targetClass)) return el;

            if(el.parentNode) 
            {                
                sibling++;
                if(maxSibling>0 && sibling>=maxSibling) return null;

                return findParenNode(el.parentNode as HTMLElement,targetClass,sibling,maxSibling);
            }
            return null;
        }
        
        toFocus=!this.state.focus;
        const clickTgRem=(this.ndTgRem && this.ndTgRem.contains(e.target));
        let clickSelCtr=findNdCtrl();            
        const prefend=clickTgRem || clickSelCtr;
        const isRmDo=hasClass(e.target as HTMLElement,'SLRemDo');
        if(isRmDo)
        {
            const node=findParenNode(e.target as HTMLElement,'SelectLabel',0,4);
            const dataValue=elAttr(node,'data-value');                
            if(node && dataValue && this.valuesRem(dataValue))
            {
                this.updSelectValues();
                this.prepItems();
                this.emit(this.callPropsChange);
            }
        }
        if(prefend)
        {
            e.preventDefault();                
            return;
        }
        this.setState({focus:!this.state.focus},toFocus?this.ckInpFocused:undefined); //toggle focus
               
    }

    protected onClickOutside=(e:MouseEvent)=>
    {
        const clickWrap=(this.ndWrap && this.ndWrap.contains(e.target));
        const clickTgRem=(this.ndTgRem && this.ndTgRem.contains(e.target));
        const clickDropDown=(this.nDropDown && this.nDropDown.contains(e.target));
        const clickSelCtr=(this.ndSelCtr && this.ndSelCtr.contains(e.target));
        //console.log('clickOutside ',this.props.name,{clickWrap,clickTgRem,clickDropDown,clickSelCtr});
        if(clickDropDown)
        {
        }
        else if(clickTgRem)
        {
            if(this.valuesRem())
            {
                this.updSelectValues();
                this.prepItems();
                this.emit(this.callPropsChange);
            }
            return;
        }
        if(!clickWrap)
        {
            this.setState({focus:false});
        }      
    }

    protected applySelect=()=>
    {
        if(!this.ndSelect) return;
        if(this.isMultiple())
        {
            elAttrSet(this.ndSelect,'multiple','multiple');
        }
        else {
            elAttrDel(this.ndSelect,'multiple');
        }
    }

    protected updateCtrSize=()=>
    {
        const view:HTMLElement=this.ndWrap as HTMLElement;
        const child:HTMLElement=this.ndSelBox as HTMLElement;
        if(view && child)
        {
            if(this.isMultiple())
            {
                child.style.maxWidth=`${view.offsetWidth}px`;
            }
            else {
                (child.style as any).maxWidth=null;
            }
        }
    }

    componentDidMount()
    {
        window.addEventListener("click",this.onClickOutside);
        window.addEventListener("resize",this.updateCtrSize);
        this.applySelect();
        if(!this.isMultiple())
        {
            this.updSelectValues();
        }
    }

    componentWillUnmount()
    {
        window.removeEventListener("click",this.onClickOutside);
        window.removeEventListener("resize",this.updateCtrSize);
    }

    componentDidUpdate(props:P)
    {
        const satu=isEqual(props.value,this.props.value);
        const dua=isEqual(props.multiple,this.props.multiple);
        const tiga=isEqual(props.options,this.props.options);
        const empat=props.loading===this.props.loading;
        const sama=satu && dua && tiga && empat;
        if(!sama)
        {
            if(!satu || !dua || !tiga)
            {
                this.prepValues();
                this.prepOptions();
                this.prepPlaces();
            }            
            this.emit();
            return;
        }
        this.updateCtrSize();
    }

    render()
    {
        const {focus}=this.state;
        const {multiple,loading}=this.props;
        const props=this.props;
        const selProps:any={};
        selProps.name=props.name;
        selProps.id=props.id?props.id:selProps.name;
        const inputProps:any={
            className:"SelectInput",
        };
        if(this.values.length<1 && !focus)
        {
            inputProps.placeholder=props.placeholder?props.placeholder:'Pilihan';
            inputProps.className=inputProps.className+" withPlaceholder";
        }
        
        return (
            <div className={`Select ${multiple?'multiple':'single'} ${focus?'focus':''}`}>
                <select ref={fn=>this.ndSelect=fn} {...selProps}>{this.selectOptions}</select>
                <div ref={fn=>this.ndWrap=fn} className="SelectWrap" 
                    onClick={this.hSWClick}
                    onKeyDown={this.hSWKeyDown}
                    >                       
                    <div ref={fn=>this.ndSelBox=fn} className="SelectBox">
                        <div ref={fn=>this.ndSelCtr=fn} className="SelectControls">
                            {this.places}
                            <input ref={fn=>this.ndInput=fn} spellCheck="false" onInput={this.onECh} value={this.search} {...inputProps}/>
                        </div>

                        <div className="SelectArrows">
                            {(!multiple && this.values.length>0) &&
                            <span ref={fn=>this.ndTgRem=fn} className="SelectArrow SelectArrowRemove">
                                <CloseSvg />
                            </span>
                            }
                            <span ref={fn=>this.ndTgDrop=fn} className="SelectArrow SelectArrowDropDown"></span>
                        </div>

                    </div>

                    
                    <div className="SelectDropBox">
                        <div ref={fn=>this.nDropDown=fn} className="SelectDropDown">
                            <ul className="SelectItems">
                                {this.dropItems}
                            </ul>
                        </div>
                    </div>
                
                </div>

                {loading && <div className="SelectLoading"></div>}
            </div>
        );        
    }
}

export {Select}