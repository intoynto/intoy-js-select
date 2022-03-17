import {coba} from "./utils";

export class Select {
    static version='1';
    constructor()
    {

    }
    add(a:number,b:number)
    {
        console.log(`Version ${Select.version}`);
        return a+b;
    }
}