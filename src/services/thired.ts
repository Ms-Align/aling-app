import { Toast } from "antd-mobile"
import { jsonp } from "vue-jsonp"
import axios from "axios"

const request = axios.create()

const urls = {
  location:
    "http://api.map.baidu.com/location/ip?ak=lPkhT59op9Ao4YIbUiRrQT2R5YjLtBMr&ip=&coor=bd09ll",
}

export function getLocation() {
  return jsonp(urls.location)
}
export const getWeather = async (location: string): Promise<any> => {
  return request({
    url: `https://devapi.qweather.com/v7/weather/now?location=${location}&key=b77b34b08cdc400d8e745e5474d4e5f9`,
    method: "GET",
    withCredentials: false,
  })
}
export const getCityInfo = async ({ location, adm }: any): Promise<any> => {
  return request({
    url: `https://geoapi.qweather.com/v2/city/lookup?location=${location}&adm=${adm}&key=b77b34b08cdc400d8e745e5474d4e5f9`,
    method: "GET",
    withCredentials: false,
  })
}
