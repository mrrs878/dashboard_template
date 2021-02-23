/*
 * @Author: your name
 * @Date: 2021-02-23 11:22:06
 * @LastEditTime: 2021-02-23 14:33:32
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
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
      },
    },
  ],
};
