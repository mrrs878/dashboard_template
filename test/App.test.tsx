/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-02 18:44:09
 * @LastEditTime: 2021-04-13 19:02:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/test/App.test.tsx
 */
import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/App';

it('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Mr.RS/i);
  expect(linkElement).toBeInTheDocument();
});
