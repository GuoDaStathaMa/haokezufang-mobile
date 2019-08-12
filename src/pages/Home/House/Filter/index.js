import React from 'react'
import { getCityPosition, API } from 'tools'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'
import styles from './index.module.scss'

class Filter extends React.Component {
  state = {
    // 控制title选中高亮
    titleSelected: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    // 控制FilterPicker组件显示隐藏
    openType: '',
    // 同意存储房屋查询条件
    filtersData: {},
    // 存储选择状态 回显
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  componentDidMount() {
    this.getFiltersData()
  }

  // 发送ajax请求 获取数据
  async getFiltersData() {
    const city = await getCityPosition()
    const res = await API.get(`/houses/condition?id=${city.value}`)
    const { status, body } = res
    if (status !== 200) return false
    this.setState({
      filtersData: body
    })
  }

  changeSelected = type => {
    const { titleSelected } = this.state
    this.setState({
      titleSelected: {
        ...titleSelected,
        [type]: true
      },
      openType: type
    })
  }

  onSave = value => {
    const { openType, selectedValues } = this.state
    this.setState({
      openType: '',
      selectedValues: {
        ...selectedValues,
        [openType]: value
      }
    })
  }

  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  // 渲染picker组件
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    let data, cols
    const defaultSelect = selectedValues[openType]
    // openType等于空或者more 返回
    if (openType === '' || openType === 'more') return

    if (openType === 'area') {
      data = [area, subway]
      cols = 3
    } else if (openType === 'mode') {
      data = rentType
      cols = 1
    } else if (openType === 'price') {
      data = price
      cols = 1
    }
    return (
      <FilterPicker
        onSave={this.onSave}
        onCancel={this.onCancel}
        data={data}
        cols={cols}
        defaultSelect={defaultSelect}
      />
    )
  }

  // 渲染遮罩
  renderMask() {
    const { openType } = this.state
    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return <div className="mask" onClick={() => this.onCancel()} />
    }
  }

  render() {
    const { titleSelected } = this.state
    return (
      <div className={styles['filter']}>
        {this.renderMask()}
        <div className="content">
          {/* filter组件的内容 */}
          {/* FilterTitle组件 */}
          <FilterTitle
            titleSelected={titleSelected}
            changeSelected={this.changeSelected}
          />
          {/* FilterPicker组件 */}
          {this.renderFilterPicker()}

          {/* FilterMore组件 */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}

export default Filter
