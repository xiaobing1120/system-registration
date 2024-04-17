import React from 'react';
import {
  BasePaginationType,
  DictAllType,
  UserType,
} from '@/constants/types';

interface BaseContextOption {
  userInfo: Partial<UserType>; // 用户信息
  basePagination: Partial<BasePaginationType>; // paoTable 分页页码设置
  dictAll: DictAllType;
}

const BaseContext = React.createContext({} as BaseContextOption);

export default BaseContext;
