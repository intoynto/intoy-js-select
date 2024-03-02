import React,{Suspense} from "react";
import { Routes, Route } from "react-router";
import { TWithRouterProps, withRouter } from "./withRouter";
import {Loading} from "./any/Loading";
import {PATH} from "./consts";

import {
    PSelectSingle,
    PSelectMultiple,
    PSelectlist,
} from "./lazy";

type IgoProps = {
    children:React.ReactNode
}

function Go(props:IgoProps):JSX.Element
{
    return <Suspense fallback={<Loading />}>{props.children}</Suspense>
}


function NotFound()
{
    return (
        <div className="relative h-full flex items-center justify-center">
            <div className="p-4 mb-20 pt-8 text-center">
                <div className="text-8xl font-semibold">404</div>
                <div>The page you are looking for might have been removed</div>
                <div>had its name changed or is temporarily unavailable</div>
            </div>
        </div>
    );
}


type Iprops = TWithRouterProps & {

}

type Istate = {
}

class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    private ndh:HTMLElement | null | undefined;

    render()
    {
        return (
            <main ref={fn=>this.ndh=fn} id="main" className="print:pt-0">
                <Routes>
                    <Route path={PATH.input_select_single.url} element={<Go><PSelectSingle /></Go>} />
                    <Route path={PATH.input_select_multi.url} element={<Go><PSelectMultiple /></Go>} />
                    <Route path={PATH.input_select_list.url} element={<Go><PSelectlist /></Go>} />
                </Routes>
            </main>
        );
    }
}

export default withRouter(Comp as any);