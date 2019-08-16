import React from 'react'
import { getCityPosition, API } from 'tools'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
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
    this.setState({
      filtersData: res.body
    })
  }

  changeSelected = type => {
    const { titleSelected, selectedValues } = this.state
    const newTitleSelected = { ...titleSelected }
    Object.keys(selectedValues).forEach(v => {
      if (v === type) {
        newTitleSelected[v] = true
      } else {
        const result = this.getTitleSelected(v, selectedValues[v])
        Object.assign(newTitleSelected, result)
      }
    })
    this.setState({
      titleSelected: newTitleSelected,
      openType: type
    })
  }

  getTitleSelected(title, value) {
    const obj = {}
    const selectedVal = value.toString()
    if (title === 'area' && selectedVal !== 'area,null') {
      obj[title] = true
    } else if (title === 'mode' && selectedVal !== 'null') {
      obj[title] = true
    } else if (title === 'price' && selectedVal !== 'null') {
      obj[title] = true
    } else if (title === 'more' && value.length > 0) {
      obj[title] = true
    } else {
      obj[title] = false
    }
    return obj
  }

  onSave = value => {
    const { openType, selectedValues, titleSelected } = this.state
    // 处理高亮
    const result = this.getTitleSelected(openType, value)

    this.setState({
      openType: '',
      selectedValues: {
        ...selectedValues,
        [openType]: value
      },
      titleSelected: {
        ...titleSelected,
        ...result
      }
    })
  }

  onCancel = () => {
    const { openType, selectedValues, titleSelected } = this.state
    const result = this.getTitleSelected(openType, selectedValues[openType])

    this.setState({
      openType: '',
      titleSelected: {
        ...titleSelected,
        ...result
      }
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
        key={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        data={data}
        cols={cols}
        defaultSelect={defaultSelect}
      />
    )
  }
  // 渲染more组件
  renderMore() {
    const {
      openType,
      selectedValues,
      filtersData: { characteristic, floor, oriented, roomType }
    } = this.state
    const data = { characteristic, floor, oriented, roomType }
    if (openType === 'more') {
      return (
        <FilterMore
          {...data}
          onSave={this.onSave}
          onCancel={this.onCancel}
          defaultSelect={selectedValues['more']}
        />
      )
    } else {
      return null
    }
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
          {this.renderMore()}
        </div>
      </div>
    )
  }
}

export default Filter
