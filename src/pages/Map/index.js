import React from 'react'
import NavHeader from 'common/NavHeader'
import './index.scss'
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
