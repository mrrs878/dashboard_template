/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-26 10:49:28
 * @LastEditTime: 2021-04-13 18:31:05
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
server.use(jsonServer.bodyParser);

server.use(jsonServer.rewriter({
  '/setting/*': '/$1',
  '/auth/permissionUrl': '/permissionUrl',
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
server.post('/auth/login', (req, res) => {
  res.jsonp({
    success: true,
    return_message: '登录成功',
    return_code: 0,
    data: router.db.get('user').value()[0],
  });
});
server.get('/auth/autoLogin', (req, res) => {
  res.jsonp({
    success: true,
    return_message: '登录信息失效，请重新登录',
    return_code: 0,
    data: router.db.get('user').value()[0],
  });
});
server.put('/menu', async (req, res) => {
  try {
    await router.db.set('menu', req.body).write();
    res.jsonp({
      success: true,
      return_message: '更新成功',
      return_code: 0,
    });
  } catch (e) {
    console.log(e);
  }
});

server.use(router);

server.listen(3003, () => {
  console.log(`JSON Server is running at ${3003}`);
});
