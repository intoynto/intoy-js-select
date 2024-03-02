type IPathInfo = {
    url:string
    title:string
}

type IPath = {
    [p:string]:IPathInfo
}

export const PATH:IPath= {
    input_select_single:{ url:"/", title: "Select Single" },
    input_select_multi:{ url:"/select-multiple", title: "Select Multiple" },
    input_select_list:{ url:"/select-list", title: "Selectlist with XHR Loader" },
}