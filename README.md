<!--
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-23 10:19:55
 * @LastEditTime: 2021-04-25 17:28:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /dashboard_template/README.md
-->
# 简单后台模版

[![Node.js CI](https://github.com/mrrs878/dashboard_template/actions/workflows/node.js.yml/badge.svg)](https://github.com/mrrs878/dashboard_template/actions/workflows/node.js.yml)

React@17 + typescript@4 + antd@4 + less

husky + commitlint/eslint 保证git message/代码规范

## 环境变量

项目内后端接口地址从.env文件读取

## 菜单

从接口拉取数据动态渲染

## 状态管理

使用 useContext + useReducer 构建简单的store

`type g<T extends keyof IState> = (value: IState[T]) => IState[T];`

`useModel<T extends keyof IState>(modelName: T): [IState[T], (newModel: IState[T]|g<T>) => void]`

```tsx
const UserInfo = () => {
  const [user, updateUser] = useModel('user');
  return (
    <div style={{ color: '#f00' }}>
      hello &emsp;
      { user.age }
      <Button onClick={() => updateUser({ ...user, age: 32 })}>set user</Button>
    </div>
  );
};
```


## 滑动🧩验证

后端生成带有缺口的图片/缺口图片，缺口位置随机，保存在后端。前端拖动释放后调用接口校验滑动位置

## 权限校验

url + RBAC

role: 0-超级管理员, 1-管理员, 2-普通用户, 3-游客

登录成功后auth_token存储在localStorage中

打开应用时`useAutoLogin`执行（使用`auth_token`换取用户信息），更新`store.user`信息

在`Route.render`函数里(`src/route/index.tsx`)进行拦截，某一url具有相关角色的用户才能访问

``` tsx
const GuardComponent = (props: GuardComponentPropsI) => {
  const [permissionUrls] = useModel('permissionUrls');
  const [user] = useModel('user');

  // ...

  const Component = (props.component) as any;
  const urlRole = permissionUrls.find((item) => item.url === props.path)?.role || 0;

  return cond([
    [() => and(equals(user.role, -1), props.auth), () => <Redirect to="/auth/login" />],
    [() => and(equals(user.role, -1), not(props.auth)), () => <Component />],
    [() => gt(user.role, urlRole), () => <ForbiddenPage />],
    [() => lte(user.role, urlRole), () => <Component />],
  ])(user);
};

<Route
  key={route.path}
  path={route.path}
  exact={route.exact || true}
  render={() => (
    <GuardComponent
      // component对应的path
      path={route.path}
      // path对应的component
      component={route.component}
      // 该页面是否需要登录
      auth={route.auth || false}
    />
  )}
/>
```

1. `user.role === -1`，表示未登录
  对于`auth === true`的页面，重定向到`/auth/login`；对于`auth === false`的页面，正常返回页面
2. `user.role !== -1`，表示已登录
  判断要前往的`url`的`role`，如果`user.role > url.role` --> 权限不够，返回`ForbiddenPage`；反之正常返回

## 一些必需api请求统一在`src/layout/index.tsx`中调用

- 登录(检测auth_token可用性)
- 获取菜单数据
- 获取url权限

## 异常信息捕获

捕获信息分类：

- Promise异常
- 资源加载错误
- JSRuntime异常
- ajax请求异常
