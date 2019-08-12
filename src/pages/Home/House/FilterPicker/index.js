import React from 'react'
import { PickerView } from 'antd-mobile'
import FilterFooter from '../FilterFooter'
import styles from './index.module.scss'

class FilterPicker extends React.Component {
  state = {
    value: this.props.defaultSelect
  }

  componentDidUpdate(prevprops) {
    if (this.props.defaultSelect !== prevprops.defaultSelect) {
      this.setState({
        value: this.props.defaultSelect
      })
    }
  }

  handleChange = value => {
    this.setState({
      value
    })
  }

  render() {
    const { onSave, onCancel, data, cols } = this.props
    return (
      <div className={styles['filter-picker']}>
        {/* 三级联动 */}
        <PickerView
          data={data}
          cols={cols}
          value={this.state.value}
          onChange={this.handleChange}
        />
        {/* Footer组件 */}
        <FilterFooter
          onSave={() => onSave(this.state.value)}
          onCancel={onCancel}
        />
      </div>
    )
  }
}
export default FilterPicker
