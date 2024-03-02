export function getBaseName()
{
    return document.baseURI.substring(document.baseURI.indexOf(window.location.origin) + window.location.origin.length, document.baseURI.lastIndexOf('/'));
}

export function docReady(fn?:()=>void)
{
    const is_fn=fn!==undefined && fn!==null && typeof fn==='function';

    if(!is_fn) return;

    if(document.readyState==="complete" || document.readyState==="interactive")
    {
        setTimeout(fn,1);
    }
    else 
    {
        document.addEventListener("DOMContentLoaded",fn);
    }
}