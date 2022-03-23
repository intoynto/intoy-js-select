const path=require("path");
const webpack = require("webpack");
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dev=require("./wp.dev");

module.exports=function(env,args)
{
    const isProd=args && args.mode && args.mode==="production"?true:false;
    const mode=isProd?"production":"development";
    console.log("wp.mode ",mode," env ",env);
    const conf={        
        entry:"./test/index.tsx",
        output:{
            //path:path.resolve(__dirname,"dist"),
            chunkFilename: '[name].js',
            filename: '[name].js',
        },
        devtool:'source-map',
        resolve: { 
            extensions: [".ts",".tsx",".js",".jsx"],
            alias:{
                "react": "preact/compat",
                "react-dom": "preact/compat"
            } 
        },
        //externals:{
        //    "react":"react",
        //    "react-dom":"react-dom"
        //},
        plugins:[
            new CleanWebpackPlugin(),    
            new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
                template: "./test/zTemplate.html",
                filename: "index.html",      
                //base: {'href': 'http://localhost:' + dev.PORT + '/',},
                base: {'href': '/',},
                templateParameters:{
                    dev_name:dev.NAME,
                    dev_version:dev.VERSION,
                },
                minify:false,
                //inlineSource: '.(js|css)$' // embed all javascript and css inline
                inlineSource: '.(js)$' // embed all javascript and css inline
            }),
        ],
        //stats:"detailed",
        module:{
            rules: [
                {
                    test: /\.(ts|tsx|js)$/,
                    //exclude: /(node_module|dist)/,
                    exclude: /node_modules/,
                    use:[
                        {
                            loader: 'babel-loader',
                            options: {
                                presets:[
                                    "@babel/preset-env",
                                    "@babel/preset-react",
                                    "@babel/preset-typescript",
                                ],
                                "assumptions": {
                                    "setPublicClassFields": true
                                },
                                plugins: [
                                    "@babel/plugin-syntax-dynamic-import",
                                    "@babel/plugin-transform-runtime",
                                    "@babel/plugin-proposal-class-properties",
                                    "@babel/plugin-proposal-object-rest-spread",
                                    "babel-plugin-transform-react-remove-prop-types"
                                ]
                            },
                        }
                    ],
                }
            ]
        },
        optimization:{
            minimizer:[
                new TerserWebpackPlugin()
            ],
        }
    };    

    //compile s[ac]ss
    conf.module.rules.push({
        test:/\.s[ac]ss$/i,
        use : [
            MiniCssExtractPlugin.loader,
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
            {
                loader:'postcss-loader',
                options:{
                    postcssOptions:{
                        plugins:[
                            //isProd?'tailwindcss':'@tailwindcss/jit',
                            'tailwindcss',
                            'autoprefixer',
                        ],
                    }
                }
            },
            'sass-loader'
        ],
    });

    if(!isProd)
    {
        conf.devServer = {
            headers: { 'Access-Control-Allow-Origin': '*' },           
            historyApiFallback: {
                disableDotRule: true
            },
            open: false,
            compress: true,
            port:9000,
            //writeToDisk: true,           
        };
    }
    return conf;
};