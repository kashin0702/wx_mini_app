import {request} from './request'
export function getRecommend() {
  return request({
    url: '/home/catitems'
  })
}