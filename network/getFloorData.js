import {request} from './request';
export function getFloorData() {
  return request({
    url: '/home/floordata'
  })
}