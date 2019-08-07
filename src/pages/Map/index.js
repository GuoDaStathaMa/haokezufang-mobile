import React from 'react'
import { getCity } from 'tools'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import NavHeader from 'common/NavHeader'
import './index.scss'
const BMap = window.BMap

class Map extends React.Component {
  async componentDidMount() {
    await this.getCityArea()
    // 把map存在组件
    this.map = new BMap.Map('container')
  }

  async getCityArea() {
    Toast.loading('加载中', 60, null, true)
    let nowCity = await getCity()
    let myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      nowCity.label,
      point => {
        if (point) {
          this.map.centerAndZoom(point, 11)
          this.map.addControl(new BMap.NavigationControl())
          this.map.addControl(new BMap.ScaleControl())

          this.getHouseSourse(nowCity.value)
        }
      },
      nowCity.label
    )
  }

  async getHouseSourse(id) {
    const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    const { status, body } = res.data
    if (status !== 200) return false
    const allHouses = body
    this.renderCircle(allHouses)
  }

  renderCircle(body) {
    body.forEach(v => {
      const point = new BMap.Point(v.coord.longitude, v.coord.latitude)
      let opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-35, -35) //设置文本偏移量
      }
      let label = new BMap.Label(
        `<div class="circleBtn">
          <p class="name">${v.label}</p>
          <p>${v.count}套</p>
        </div>`,
        opts
      )

      label.setStyle({
        cursor: 'pointer',
        border: '0px solid rgb(255, 0, 0)',
        padding: '0px',
        whiteSpace: 'nowrap',
        fontSize: '12px',
        color: 'rgb(255, 255, 255)',
        textAlign: 'center'
      })
      // 创建文本标注对象
      this.map.addOverlay(label)
      Toast.hide()

      label.addEventListener('click', function() {
        console.log(v.label)
      })
    })
  }

  // async getMapInfo(map) {
  //   let { value } = await getCity()
  //   const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
  //   const { status, body } = res.data
  //   if (status !== 200) return false

  //   body.forEach(v => {
  //     const point = new BMap.Point(v.coord.longitude, v.coord.latitude)
  //     let opts = {
  //       position: point, // 指定文本标注所在的地理位置
  //       offset: new BMap.Size(-35, -35) //设置文本偏移量
  //     }
  //     let label = new BMap.Label(
  //       `<div class="circleBtn">
  //         <p class="name">${v.label}</p>
  //         <p>${v.count}套</p>
  //       </div>`,
  //       opts
  //     )

  //     label.setStyle({
  //       cursor: 'pointer',
  //       border: '0px solid rgb(255, 0, 0)',
  //       padding: '0px',
  //       whiteSpace: 'nowrap',
  //       fontSize: '12px',
  //       color: 'rgb(255, 255, 255)',
  //       textAlign: 'center'
  //     })
  //     // 创建文本标注对象
  //     map.addOverlay(label)
  //     Toast.hide()

  //     label.addEventListener('click', function() {
  //       console.log(v.label)
  //     })
  //   })
  // }

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
