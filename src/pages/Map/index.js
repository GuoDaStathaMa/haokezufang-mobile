import React from 'react'
import { getCity } from 'tools'
import axios from 'axios'
import NavHeader from 'common/NavHeader'
import './index.scss'
const BMap = window.BMap

class Map extends React.Component {
  async componentDidMount() {
    await this.getCityArea()
    this.getMapInfo()
  }

  async getMapInfo() {
    let { value } = await getCity()
    const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
    const { status, body } = res.data
    if (status !== 200) return false
    body.forEach(v => {})
  }

  async getCityArea() {
    let nowCity = await getCity()
    let map = new BMap.Map('container')
    let myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      nowCity.label,
      point => {
        if (point) {
          map.centerAndZoom(point, 11)
          map.addControl(new BMap.NavigationControl())
          map.addControl(new BMap.ScaleControl())

          let opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-100, -30) //设置文本偏移量
          }
          let label = new BMap.Label(
            `<div class="circleBtn">
              <p class="name">浦东新区</p>
              <p>2套</p>
            </div>`,
            opts
          ) // 创建文本标注对象
          map.addOverlay(label)
        }
      },
      nowCity.label
    )
  }

  render() {
    return (
      <div className="map">
        <NavHeader />
        <div id="container" />
      </div>
    )
  }
}
export default Map
