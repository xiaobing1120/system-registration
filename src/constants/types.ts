import React from 'react';

// any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;




export type RecordString = {
  [key: string]: string;
};

export type RecordStringElement = {
  [key: string]: React.ReactElement;
};

export interface BasePaginationType {
  defaultPageSize: number;
  showSizeChanger: boolean;
  pageSizeOptions: number[];
  showQuickJumper: boolean;
  showTotal: (total: number, range: number[]) => string
}

export interface DictType {
  dicType: string;
  dicTypeLabel: string;
  dicCode: string;
  dicValue: string;
}

export interface DictListType {
  [key: string]: DictType[];
}

export interface DictAllType {
  [key: string]: RecordString;
}


export interface UserType {
  id: number;
  username: string;
  jobNumber: string;
  realname: string;
  password: null,
  email: string;
  mobile: string;
  qq: string;
  lastLoginIp: string;
  lastLoginTime: string;
  createTime: string;
  lastChgDt: boolean;
  status: boolean;
  isLeader: boolean;
  isTrainAdmin: boolean;
  modifyPassword: number;
  staff: boolean
}
