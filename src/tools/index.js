// 封装定位工具
import axios from 'axios'

function getCity() {
  return JSON.parse(localStorage.getItem('Positions'))
}

function setCity(city) {
  localStorage.setItem('Positions', JSON.stringify(city))
}

export function getCityPosition() {
  let city = getCity()
  if (!city) {
    return new Promise((resolve, reject) => {
      var myCity = new window.BMap.LocalCity()
      myCity.get(result => {
        axios
          .get(`http://localhost:8080/area/info`, {
            params: { name: result.name }
          })
          .then(res => {
            const { body } = res.data
            // 存储值到缓存
            setCity(body)
            // 返回promise借故偶
            resolve(body)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  } else {
    return Promise.resolve(city)
  }
}
