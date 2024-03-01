import React from "react";
import Test01 from "./Test.01";
import Test02 from "./Test.02";
import Test03 from "./Test.03";

type Iprops = {

}

type Istate = {

}

class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    render()
    {
        return (
            <div>               
                <Test01 />
                <Test02 />
                <Test03 />
            </div>
        );
    }
}

export default Comp;