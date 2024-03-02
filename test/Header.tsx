import React from "react";
import { pathIsMatch, TWithRouterProps, withRouter } from "./withRouter";
import { NavLink } from "react-router-dom";
import { PATH } from "./consts";

type Iprops = TWithRouterProps & {

}

type Istate = {
}

class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    render()
    {
        return (
            <header>
                <div className="">
                    <nav>
                        <ul>
                            <li><NavLink to={PATH.input_select_single.url} end>Single</NavLink></li>
                            <li><NavLink to={PATH.input_select_multi.url}>Multiple</NavLink></li>
                            <li><NavLink to={PATH.input_select_list.url}>SelectList (XHR)</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default withRouter(Comp as any);