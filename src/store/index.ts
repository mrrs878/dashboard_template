/*
 * @Author: your name
 * @Date: 2021-02-23 18:24:16
 * @LastEditTime: 2021-02-25 16:25:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /components_library/src/store/index.ts
 */
import { createContext, useContext } from 'react';

enum Actions {
  UPDATE_MODEL,
  UPDATE_USER,
  UPDATE_ADDRESSES,
  UPDATE_FULLSCREEN,
  UPDATE_MENU,
  UPDATE_MENU_ROUTES,
  UPDATE_MENU_TITLES,
}

type UpdateModel<T extends keyof IState> =
IActions<Actions.UPDATE_MODEL, { modelName: T, modelValue: IState[T] }>;
type UpdateUser = IActions<Actions.UPDATE_USER, IUser>;
type UpdateAddresses = IActions<Actions.UPDATE_ADDRESSES, Array<string>>;
type UpdateFullScreen = IActions<Actions.UPDATE_FULLSCREEN, boolean>;
type UpdateMenu = IActions<Actions.UPDATE_MENU, Array<IMenuItem>>;
type UpdateMenuRoutes = IActions<Actions.UPDATE_MENU_ROUTES, Record<string, string>>;
type UpdateMenuTitles = IActions<Actions.UPDATE_MENU_TITLES, Record<string, string>>;

type Action = UpdateModel<keyof IState>|UpdateUser|UpdateAddresses|UpdateFullScreen|UpdateMenu|
UpdateMenuRoutes|UpdateMenuTitles;

const defaultState: IState = {
  user: { name: '', age: -1 },
  addresses: [],
  fullScreen: false,
  menu: [],
  menuRoutes: {},
  menuTitles: {},
};

const StoreContext = createContext<{ state: IState, dispatch: React.Dispatch<Action> }>(
  {
    state: defaultState,
    dispatch: () => null,
  },
);

function useModel<T extends keyof IState>(modelName: T)
  : [IState[T], (newModel: IState[T]) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state[modelName],
    (modelValue: IState[T]) => dispatch(
      { type: Actions.UPDATE_MODEL, data: { modelName, modelValue } },
    ),
  ];
}

function useUser(): [IUser, (data: IUser) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.user,
    (data) => dispatch({ type: Actions.UPDATE_USER, data }),
  ];
}

function useMenu(): [Array<IMenuItem>, (data: Array<IMenuItem>) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.menu,
    (data) => dispatch({ type: Actions.UPDATE_MENU, data }),
  ];
}

function useMenuRoutes(): [Record<string, string>, (data: Record<string, string>) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.menuRoutes,
    (data) => dispatch({ type: Actions.UPDATE_MENU_ROUTES, data }),
  ];
}

function useMenuTitles(): [Record<string, string>, (data: Record<string, string>) => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.menuTitles,
    (data) => dispatch({ type: Actions.UPDATE_MENU_TITLES, data }),
  ];
}

function useFullScreen(): [boolean, () => void, () => void] {
  const { state, dispatch } = useContext(StoreContext);
  return [
    state.fullScreen,
    () => dispatch({ type: Actions.UPDATE_FULLSCREEN, data: true }),
    () => dispatch({ type: Actions.UPDATE_FULLSCREEN, data: false }),
  ];
}

// type Equals<X, Y> =
//     (<T>() => T extends X ? 1 : 2) extends
//     (<T>() => T extends Y ? 1 : 2) ? true : false;

function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case Actions.UPDATE_MODEL: {
      return { ...state, [action.data.modelName]: action.data.modelValue };
    }
    case Actions.UPDATE_USER:
      return { ...state, user: action.data };
    case Actions.UPDATE_ADDRESSES:
      return { ...state, addresses: action.data };
    case Actions.UPDATE_FULLSCREEN:
      return { ...state, fullScreen: action.data };
    default:
      return state;
  }
}

export {
  reducer, StoreContext, defaultState, useUser, useFullScreen, useMenu, useMenuRoutes,
  useMenuTitles, useModel,
};
