/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-02-24 11:22:31
 * @LastEditTime: 2021-07-29 15:10:53
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 */
import { useEffect, useState, useCallback } from 'react';

function useRequest<P, T>(api: (params: P) => Promise<T>, visible = true, params?: P)
  :[boolean, T|undefined, (params?: P) => void, () => void] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visible);

  const fetch = useCallback(async () => {
    if (autoFetch) {
      try {
        const param = (newParams || {}) as P;
        setLoading(true);
        const tmp = await api(param);
        setRes(tmp);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setRes(e);
      }
    }
  }, [api, autoFetch, newParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest = null) => {
    setNewParams(rest);
    setAutoFetch(true);
  }, []);

  return [loading, res, doFetch, fetch];
}

export default useRequest;
