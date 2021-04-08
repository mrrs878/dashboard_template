<!--
 * @Author: your name
 * @Date: 2021-02-23 10:19:55
 * @LastEditTime: 2021-04-08 13:11:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/README.md
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

useModel: `<T extends keyof IState>(modelName: T): [IState[T], (newModel: IState[T]) => void]`

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

