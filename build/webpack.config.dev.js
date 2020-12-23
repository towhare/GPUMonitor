'use strict';

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

function resolve (dir) {
	return path.join(__dirname, '..', dir);
}
module.exports = {
	mode: 'development',
	entry: {
		'index':'./src/app.js',
	},
	devServer: {
		//hot: true,
		watchOptions: {
			poll: true,
			ignored: /node_modules/
		},
		disableHostCheck: true
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
			{
				test: /\.js$/,
				use: 'babel-loader'
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096,
							outputPath: 'img/'
						}
					}
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'url-loader'
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'template.html',
			//chunks: ['index'],
			inject: true,
			title: 'GPU监控'
		}),
		new CopyWebpackPlugin([{
			from: resolve('static/img'),
			to: resolve('dist/static/img'),
			toType: 'dir'
		}])
	]
};
