import {
  Any,
} from '@/constants/types';
import service from '@/utils/request';
import APIs from '../constants/APIs';


const baseData = (d: Any): Any => {
  const data = d || {}
  return {
    apiCd: '100000',
    channelNo: '',
    current: data.current !== undefined ? data.current : '',
    data: {
      ...data,
    },
    flowId: 'dfdfd9392770191c95ee01276523d68f',
    pageSize: data.pageSize !== undefined ? data.pageSize : '',
    timestamp: new Date().getTime(),
    version: __VERSION__,
  };
};

const APIHelper = {
  logout(): void {
    window.location.href = APIs.logout
  },


  // tips
  /*

  logout(): void {
    window.location.href = APIs.logout
  },
  getUser(): Promise<{user: UserType, staff: boolean}> {
    return service.get(APIs.getUser);
  },

  querySupList(): Promise<QuerySupListResType[]> {
    return service.post(APIs.querySupList, baseData({  }));
  },

  deptStaticsExport(data: { year: string }): Promise<Blob> {
    return service.post(APIs.deptStaticsExport, baseData(data), {
      responseType: 'blob'
    });
  },


  downReportFile(id: string): Promise<Blob> {
    return service.get(`${APIs.downReportFile}${id}`, {
      params: {},
      responseType: 'blob',
    });
  }, */


};

export default APIHelper;
