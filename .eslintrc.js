/*
 * @Author: your name
 * @Date: 2021-02-23 11:22:06
 * @LastEditTime: 2021-02-23 21:54:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/.eslintrc.js
 */
module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
  ],
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
  },
  rules: {
    'linebreak-style': ['off', 'window'],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
    },
  ],
};
