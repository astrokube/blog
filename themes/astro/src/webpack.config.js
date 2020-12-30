const path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        app: './js/main.js'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    // translates CSS into CommonJS modules
                    loader: 'css-loader'
                }, {
                    // Run postcss actions
                    loader: 'postcss-loader',
                    options: {
                        // `postcssOptions` is needed for postcss 8.x;
                        // if you use postcss 7.x skip the key
                        postcssOptions: {
                            // postcss plugins, can be exported to postcss.config.js
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                }, {
                    // compiles Sass to CSS
                    loader: 'sass-loader'
                }]
            },
            // Font files
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
		new AssetsPlugin({
			filename: 'webpack_assets.json',
			path: path.join(__dirname, '../data'),
            prettyPrint: true,
            removeFullPathAutoPrefix: true,
        }),        
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
        })
    ],
    output: {
		path: path.join(__dirname, './../static/dist'),
        filename: 'js/[name].[chunkhash].js',
        assetModuleFilename: '[hash][ext][query]'
	},
    // watchOptions: {
    //     watch: true
    // }
}


// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var webpack = require('webpack');
// var AssetsPlugin = require('assets-webpack-plugin');

// module.exports = {
// 	entry: {
// 		app: './js/main.js'
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.js$/,
// 				exclude: /node_modules/,
// 				use: {
// 					loader: 'babel-loader',
// 					options: {
// 						presets: ['env']
// 					}
// 				}
// 			},
// 			{
// 				test: /\.css$/,
// 				use: ExtractTextPlugin.extract({
// 					fallback: 'style-loader',
// 					use: 'css-loader?importLoaders=1!postcss-loader'
// 				})
// 			}
// 		]
// 	},

// 	output: {
// 		path: path.join(__dirname, './../static/dist'),
// 		filename: 'js/[name].[chunkhash].js'
// 	},

// 	resolve: {
// 		modules: [path.resolve(__dirname, 'src'), 'node_modules']
// 	},

// 	plugins: [
// 		new AssetsPlugin({
// 			filename: 'webpack_assets.json',
// 			path: path.join(__dirname, '../data'),
// 			prettyPrint: true
// 		}),
// 		new ExtractTextPlugin({
// 			filename: getPath => {
// 				return getPath('css/[name].[contenthash].css');
// 			},
// 			allChunks: true
// 		})
// 	],
// 	watchOptions: {
// 		watch: true
// 	}
// };



// // ...
// {
//     test: /\.(scss)$/,
//     use: [{
//       // inject CSS to page
//       loader: 'style-loader'
//     }, {
//       // translates CSS into CommonJS modules
//       loader: 'css-loader'
//     }, {
//       // Run postcss actions
//       loader: 'postcss-loader',
//       options: {
//         // `postcssOptions` is needed for postcss 8.x;
//         // if you use postcss 7.x skip the key
//         postcssOptions: {
//           // postcss plugins, can be exported to postcss.config.js
//           plugins: function () {
//             return [
//               require('autoprefixer')
//             ];
//           }
//         }
//       }
//     }, {
//       // compiles Sass to CSS
//       loader: 'sass-loader'
//     }]
//   }
//   // ...
