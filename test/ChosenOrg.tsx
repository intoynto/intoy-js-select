import React from "react";
import {SelectList} from "./SelectList";

function onFieldName(data:any)
{
    return '<b style="color:orangered">'+data.kode_organisasi+'</b> '+data.organisasi;
}

const ChosenOrg=()=>(
    <SelectList
        name="kode_organisasi"
        fieldid="kode_organisasi"
        fieldname="organisasi"
        url="http://localhost/1050-sshkota/api/organisasi/select"
        onFieldName={onFieldName}
        useCache        
    />
);

export {ChosenOrg}