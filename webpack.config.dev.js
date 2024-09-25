const path=require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssExtractPlugin = require('mini-css-extract-plugin');

module.exports=function(env,args)
{
    const isProd=args && args.mode && args.mode==="production"?true:false;
    const mode=isProd?"production":"development";
    console.log("wp.mode ",mode," env ",env);

    const conf={
        mode,
        entry:"./test/index.tsx",
        output:{
            chunkFilename: '[name].js',
            filename: '[name].js',
        },
        resolve: { 
            extensions: [".ts",".tsx",".js",".jsx"],
            alias:{
                "react": "preact/compat",
                "react-dom": "preact/compat",
                "react-dom/test-utils": "preact/test-utils",
                "react/jsx-runtime": "preact/jsx-runtime",   
            },
            fallback:{
                "stream":false,
                "buffer":false,
                "crypto": false,
            }
        },
        plugins:[],
        module:{},
        optimization:{},
    };

    const plugins=[];
    // html webpack
    plugins.push(new HtmlWebpackPlugin({
        template: "test/zIndex.html", // to import index.html file inside index.js
        inject:'body',
        title:"Select New",
    }));   

    // plugins extract css
    plugins.push(new CssExtractPlugin({
        filename: `test.[name].css`,
    }));

    // rules
    const rules=[];

    // rules ts,tsx,js,jsx
    rules.push({
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use:{
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
        }
    });

    // rules scss,sass,css
    rules.push({
        test:/\.s[ac]ss$/i,
        use : [
            CssExtractPlugin.loader,
            {
                loader:'css-loader',
                options:{
                    url:false,
                    importLoaders:2,
                    // 0 => no loaders (default);
                    // 1 => postcss-loader;
                    // 2 => postcss-loader, sass-loader
                }
            },
            'postcss-loader',           
            'sass-loader'
        ],
    });

    


    if(!isProd)
    {
        const devServer={
            headers: { 'Access-Control-Allow-Origin': '*' },    
            allowedHosts:'all',// enable for all host
            historyApiFallback: { disableDotRule: true }, 
            open: false,
            compress: true,
            watchFiles:[
                './src/**/*.{ts,tsx}',
                "./test/zIndex.html",
            ],
        };

        conf.devServer=devServer;
    }

    conf.plugins=plugins;
    conf.module.rules=rules;

    return conf;
}