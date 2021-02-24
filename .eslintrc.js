/*
 * @Author: your name
 * @Date: 2021-02-23 11:22:06
 * @LastEditTime: 2021-02-24 14:34:26
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
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
    },
  ],
};
