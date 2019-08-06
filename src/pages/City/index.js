import React from 'react'
import { NavBar } from 'antd-mobile'
import { AutoSizer, List } from 'react-virtualized'
import { getCityPosition } from 'tools'
import './index.scss'
import axios from 'axios'

// // 提供virtualized渲染数据
// const list = Array.from(new Array(10000)).map(
//   (item, index) => `${index}-假数据展示`
// )
// navBar_height
const TITLE_HEIGHT = 36
// city_el_height
const CITI_HIGHT = 50
class City extends React.Component {
  state = {
    shortList: [],
    citiesObj: {},
    currentCityShort: 0
  }

  formatData(list) {
    let citiesObj = {}
    list.forEach(v => {
      const k = v.short.slice(0, 1)
      if (k in citiesObj) {
        citiesObj[k].push(v)
      } else {
        citiesObj[k] = [v]
      }
    })
    const shortList = Object.keys(citiesObj).sort()

    return {
      citiesObj,
      shortList
    }
  }
  // 获取城市列表
  async getcitiesObj() {
    const res = await axios.get(`http://localhost:8080/area/city?level=1`)
    // 处理数据
    const { body, status } = res.data
    if (status !== 200) return false
    let { citiesObj, shortList } = this.formatData(body)
    // 获取热门城市 存入对象
    const hotRes = await axios.get(`http://localhost:8080/area/hot`)
    shortList.unshift('hot')
    citiesObj.hot = hotRes.data.body
    // 获取当前城市 存入shortList citiesObj
    let city = await getCityPosition()
    shortList.unshift('#')
    citiesObj['#'] = [city]

    this.setState({
      shortList,
      citiesObj
    })
    console.log(this.state.citiesObj, this.state.shortList)
  }

  componentDidMount() {
    this.getcitiesObj()
  }

  renderNavBar() {
    return (
      <NavBar
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onLeftClick={() => this.props.history.go(-1)}
      >
        城市列表
      </NavBar>
    )
  }
  // 动态计算每个title内容高度 virtualized
  caclHeight({ index }) {
    const firstWord = this.state.shortList[index]
    const cities = this.state.citiesObj[firstWord]
    return cities.length * CITI_HIGHT + TITLE_HEIGHT
  }
  // 渲染列表 virtualized
  rowRenderer({
    key, // 唯一的key值
    index, // 每一行的索引号
    style // 样式对象
  }) {
    const firstWord = this.state.shortList[index]
    const cities = this.state.citiesObj[firstWord]
    return (
      <div key={key} style={style} className="city-list">
        <div className="title">{this.configTitle(firstWord)}</div>
        {cities.map(v => (
          <div key={v.value} className="name">
            {v.label}
          </div>
        ))}
      </div>
    )
  }

  // 获取当前滚动区域索引值 virtualized
  onRowsRendered({ startIndex }) {
    if (startIndex === this.state.currentCityShort) return false
    this.setState({
      currentCityShort: startIndex
    })
  }

  // 处理城市字母符合标题
  configTitle(title) {
    if (title === '#') {
      return '当前定位'
    } else if (title === 'hot') {
      return '热门城市'
    } else {
      return title.toUpperCase()
    }
  }

  // 右边快捷导航
  renderFastNav() {
    return (
      <ul className="city-index">
        {this.state.shortList.map((v, i) => (
          <li
            className="city-index-item"
            key={v}
            onClick={() => this.moveTo(i)}
          >
            <span
              className={
                i === this.state.currentCityShort ? 'index-active' : ''
              }
            >
              {v === 'hot' ? '热' : v.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  moveTo(i) {
    if (i === this.state.currentCityShort) return false
    this.setState({
      currentCityShort: i
    })
  }

  render() {
    return (
      <div className="city">
        <div className="navBar">{this.renderNavBar()}</div>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.shortList.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
              scrollToIndex={this.state.currentCityShort}
            />
          )}
        </AutoSizer>
        {/* 侧边导航 */}
        <div>{this.renderFastNav()}</div>
      </div>
    )
  }
}
export default City
