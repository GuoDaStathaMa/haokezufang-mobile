import React from 'react'
import { Toast } from 'antd-mobile'
import { AutoSizer, List } from 'react-virtualized'
import { getCityPosition, setCity } from 'tools'
import NavHeader from 'common/NavHeader'
import './index.scss'
import axios from 'axios'
// 北上广深
const includeCities = ['北京', '上海', '广州', '深圳']
// navBar_height
const TITLE_HEIGHT = 36
// city_el_height
const CITI_HIGHT = 50
class City extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shortList: [],
      citiesObj: {},
      currentCityShort: 0
    }
    this.listRef = React.createRef()
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
  }

  async componentDidMount() {
    await this.getcitiesObj()
    // 解决为完全加载问题 virtualized
    // this.listRef.current.measureAllRows()
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
          <div
            key={v.value}
            className="name"
            onClick={this.selectCity.bind(this, v)}
          >
            {v.label}
          </div>
        ))}
      </div>
    )
  }

  // 点击切换城市定位
  selectCity(v) {
    if (includeCities.includes(v.label)) {
      setCity(v)
      this.props.history.push('/')
    } else {
      Toast.info('该城市暂无房源信息', 1, null, true)
    }
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
    this.listRef.current.scrollToRow(i)
  }

  render() {
    return (
      <div className="city">
        {/* 头部导航组件 */}
        <NavHeader>城市列表</NavHeader>
        {/* 长列表滚动组件 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.listRef}
              width={width}
              height={height}
              rowCount={this.state.shortList.length}
              rowHeight={this.caclHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
              scrollToAlignment="start"
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
