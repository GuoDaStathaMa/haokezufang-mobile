import React from 'react'
import './index.scss'
import { NavBar } from 'antd-mobile'
const BMap = window.BMap

class Map extends React.Component {
  componentDidMount() {
    let map = new BMap.Map('container')
    let point = new BMap.Point(121.61887341233741, 31.040603951746952)
    var stCtrl = new BMap.PanoramaControl()
    stCtrl.setOffset(new BMap.Size(20, 20))
    map.addControl(stCtrl)
    map.centerAndZoom(point, 16)
    map.addControl(new BMap.NavigationControl())
    var marker = new BMap.Marker(point) // 创建标注
    map.addOverlay(marker)
  }

  renderNavBar() {
    return (
      <NavBar
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onLeftClick={() => this.props.history.go(-1)}
      >
        地图找房
      </NavBar>
    )
  }

  render() {
    return (
      <div className="map">
        <div className="navBar">{this.renderNavBar()}</div>
        <div id="container" />
      </div>
    )
  }
}
export default Map
