const path = require('path')
const HtmlebpackPligin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require("glob");
let htmlData = [];
let pattern = './src/*/*.html';
glob.sync(pattern).forEach(val =>{
    htmlData.push(
        new HtmlebpackPligin({
            template: val,
            filename: 'src/' + val.split('/')[3],
            minify: {
                // 移除空格
                collapseWhitespace: false,
                // 去掉注释
                removeComments: false,
            }
        }));
});
module.exports = {
    entry: './src/main.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        ...htmlData,
        new MiniCssExtractPlugin({
            filename: 'src/style.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        // 处理css兼容性
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require("postcss-preset-env")(),
                                    require('postcss-pxtorem')({
                                        rootValue: 37.5,
                                        propList: ['*'],
                                        unitPrecision: 2,
                                        mediaQuery: true
                                    })
                                ]
                            }
                        }
                    },
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                // url-loader默认使用es6模块化解析
                loader: "url-loader",
                options: {
                    // 图片大于8kb，就会被base64处理
                    limit: 8 * 1024,
                    esModule: false,
                    name: 'img/[name].[ext]',
                    publicPath: "../"
                }
            },
            {
                // html-loader默认使用commonjs模块化解析
                test: /\.html$/,
                loader: "html-withimg-loader",
            },
            {
                exclude: /\.(css|js|html|less|png|jpg|svg|gif)/,
                loader: "file-loader",
                options: {
                    name: '[name].[ext]',
                    outputPath: 'font'
                }
            },
        ]
    },
    devServer: {
        compress: true,
        port: 8080,
        host: '0.0.0.0',
        hot: true,
    },
}