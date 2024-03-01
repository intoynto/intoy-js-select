const path=require("path");
const TerserWebpackPlugin=require("terser-webpack-plugin");

module.exports=function(env,args)
{
    const dev={
        MODUL_NAME:'select',
        DECLARE_MODUL_NAME:"intoy-select",
    };

    const entry={};
    entry[`${dev.MODUL_NAME}`]=path.resolve(__dirname,"src/index.tsx");

    console.log('======= ENTRY =========');
    console.log(entry);

    const conf={
        mode:"production",
        entry,
        output:{
            chunkFilename: '[name].js',
            filename: '[name].js',
            libraryTarget: 'umd',
            library: `${dev.MODUL_NAME}`,
            umdNamedDefine: true,

            clean: true, // dir
        },
        devtool:'source-map',
        resolve: { 
            extensions: [".ts",".tsx",".js",".jsx"],
            alias:{
                "react": "preact/compat",
                "react-dom": "preact/compat"
            } 
        },
        externals:{
            "react":"react",
            "react-dom":"react-dom",
        },    
        module:{},
        optimization:{
            minimize:true,
            minimizer:[],
        },        
    };

    const rules=[];

    // rules ts,tsx,js,jsx
    rules.push({
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /(node_module|dist)/,
        use:[
                {
                    loader:"babel-loader",
                    options:{
                        presets:[
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ],
                        plugins:[
                            "@babel/plugin-syntax-dynamic-import", // already include in @babel/preset-env work without yarn add

                            "@babel/plugin-transform-class-properties",
                            "@babel/plugin-transform-object-rest-spread", // already include in @babel/preset-env work without yarn add

                            "@babel/plugin-transform-runtime", // use tarnsform runtime (async  / await) work without yarn add
                            "babel-plugin-transform-react-remove-prop-types" 
                        ],
                    },
                },
                {
                    loader: 'ts-loader',
                },
        ]
    });   

    conf.module.rules=rules;
    
    conf.optimization.minimizer.push(
        new TerserWebpackPlugin({    
            terserOptions:{
                format:{
                    comments:false,
                }
            },            
            extractComments:false,                
        })
    );

    return conf;
}