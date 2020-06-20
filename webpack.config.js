const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const path= require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const mode='production';//production development

const webpackConfig= {
    entry: {
        "js/root": ["./src/js/root.js"]
    },
    output: {
        path: path.resolve(__dirname,'./.prod/'),
        filename: "[name].js",
        publicPath: mode=='development' ? "http://192.168.199.12:8080/" : ''
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename:'[name].css',
            moduleFilename: ({ name }) => `./css/${name.replace(/^(.*[\\\/])/,'')}.css`,
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/*.html',
                    to: '',
                    flatten:true,
                    force:true
                }
            ],
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    outputPath:'./fonts/',
                    publicPath:'../fonts/',
                    name:'[name].[ext]'
                }
            },
            {
                test: /\.(png|jpeg|webp|ico|jpg)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    outputPath:'./img/',
                    publicPath:'../img/',
                    name:'[name].[ext]'
                }
            }

        ]
    },
    mode,
/*
    devtool: "source-map",
    devServer: {
        host:'192.168.199.12',
        port:8080,
        disableHostCheck:true,
        historyApiFallback: true
    }
 */
};


module.exports=webpackConfig;