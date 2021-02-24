/*
 * @Author: your name
 * @Date: 2021-02-23 14:42:04
 * @LastEditTime: 2021-02-24 11:01:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/craco.config.js
 */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        modifyLessRule() {
          return {
            test: /\.module\.less$/,
            exclude: /node_modules/,
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:6]',
                  },
                },
              },
              { loader: 'less-loader' },
            ],
          };
        },
      },
    },
  ],
};
