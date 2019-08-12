import React from 'react'
import { getCityPosition, API } from 'tools'
import { Toast } from 'antd-mobile'
import NavHeader from 'common/NavHeader'
import './index.scss'
const BMap = window.BMap

class Map extends React.Component {
  state = {
    isShow: false,
    housesList: []
  }
  componentDidMount() {
    this.init()
  }
  // 初始化地图
  async init() {
    this.map = new BMap.Map('container')
    let { label, value } = await getCityPosition()
    let myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          this.map.centerAndZoom(point, 11)
          this.map.addControl(new BMap.NavigationControl())
          this.map.addControl(new BMap.ScaleControl())

          this.getHouseSourse(value)
        }
      },
      label
    )
  }
  // 获取数据
  async getHouseSourse(id) {
    Toast.loading('加载中', 0)
    const res = await API.get(`/area/map?id=${id}`)
    const { status, body } = res
    if (status !== 200) return false
    const all = body
    const { type, nextZoom } = this.getTypeAndZoom()
    this.renderCircleOrRect(type, nextZoom, all)
    Toast.hide()
  }
  // 判断渲染类型和缩放等级
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let type, nextZoom
    if (zoom === 11) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom === 13) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
      nextZoom = 15
    }

    return {
      type,
      nextZoom
    }
  }
  // 判断渲染圆圈或方块
  renderCircleOrRect(type, nextZoom, all) {
    if (type === 'circle') {
      this.renderCircle(all, nextZoom)
    } else if (type === 'rect') {
      this.renderRect(all, nextZoom)
    }
  }

  renderCircle(all, nextZoom) {
    all.forEach(v => {
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
        border: '0px solid rgb(255, 0, 0)',
        padding: '0px',
        fontSize: '12px'
      })
      // 创建文本标注对象
      this.map.addOverlay(label)

      label.addEventListener('click', () => {
        // 清除遮盖物 必须放置在timeout内
        setTimeout(() => this.map.clearOverlays(), 0)
        // 发送ajax重新渲染二级circle
        this.getHouseSourse(v.value)
        // 设置中心点
        this.map.centerAndZoom(point, nextZoom)
      })
    })
  }

  renderRect(all) {
    all.forEach(v => {
      const point = new BMap.Point(v.coord.longitude, v.coord.latitude)
      let opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-50, -10) //设置文本偏移量
      }
      let label = new BMap.Label(
        `<div class="rect">
            <span class="housename">${v.label}</span>
            <span class="housenum">${v.count}套</span>
            <i class="arrow"></i>
          </div>`,
        opts
      )

      label.setStyle({
        border: '0px solid rgb(255, 0, 0)',
        padding: '0px',
        fontSize: '12px'
      })
      // 创建文本标注对象
      this.map.addOverlay(label)

      label.addEventListener('click', e => {
        // 设置中心点
        console.log(e)
        const x = window.innerWidth / 2 - e.changedTouches[0].clientX
        const y = (window.innerHeight - 300) / 2 - e.changedTouches[0].clientY
        this.map.panBy(x, y)
        this.getHouseInfo(v.value)
      })
    })

    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })
  }

  async getHouseInfo(id) {
    Toast.loading('加载中', 0)
    const res = await API.get(`/houses?cityId=${id}`)
    const { body } = res
    this.setState({
      housesList: body.list,
      isShow: true
    })
    Toast.hide()
  }

  renderTags(v) {
    return v.tags.map((v, i) => {
      const num = (i % 3) + 1
      const name = `tag tag${num}`
      return (
        <span className={name} key={v}>
          {v}
        </span>
      )
    })
  }

  renderHousesList() {
    return this.state.housesList.map(v => (
      <div className="house" key={v.houseCode}>
        <div className="imgWrap">
          <img
            className="img"
            src={`http://localhost:8080${v.houseImg}`}
            alt=""
          />
        </div>
        <div className="content">
          <h3 className="title">{v.title}</h3>
          <div className="desc">{v.desc}</div>
          <div>{this.renderTags(v)}</div>
          <div className="price">
            <span className="priceNum">{v.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className="map">
        <NavHeader>地图找房</NavHeader>
        <div id="container" />
        <div className={`houseList ${this.state.isShow ? 'show' : ''}`}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">{this.renderHousesList()}</div>
        </div>
      </div>
    )
  }
}
export default Map
