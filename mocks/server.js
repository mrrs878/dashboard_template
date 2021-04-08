/*
 * @Author: your name
 * @Date: 2021-02-26 10:49:28
 * @LastEditTime: 2021-04-08 13:08:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/mocks/route.js
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const jsonServer = require('json-server');
const path = require('path');
const { getPuzzleImg, verifyPuzzle } = require('./puzzle');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

router.render = (req, res) => {
  res.jsonp({
    success: true,
    return_message: '',
    return_code: 0,
    data: res.locals.data,
  });
};

server.use(middlewares);

server.use(jsonServer.rewriter({
  '/setting/*': '/$1',
}));

server.get('/auth/verifyPuzzle/:session/:left', async (req, res) => {
  const { session, left } = req.params;
  const data = await verifyPuzzle(session, left);
  res.jsonp(data);
});

server.get('/auth/puzzleImg', async (req, res) => {
  const data = await getPuzzleImg();
  res.jsonp(data);
});

server.use(router);

server.listen(3003, () => {
  console.log(`JSON Server is running at ${3003}`);
});
