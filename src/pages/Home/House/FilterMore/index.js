import React from 'react'
import FilterFooter from '../FilterFooter'
import styles from './index.module.scss'
import classnames from 'classnames'

class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultSelect
  }

  handleClick(value) {
    let newselectedValues = this.state.selectedValues.slice()

    if (newselectedValues.includes(value)) {
      newselectedValues = newselectedValues.filter(v => v !== value)
    } else {
      newselectedValues.push(value)
    }

    this.setState({
      selectedValues: newselectedValues
    })
  }

  renderMoreList = data => {
    const { selectedValues } = this.state
    return data.map(v => (
      <span
        className={classnames('tag', {
          'tag-active': selectedValues.includes(v.value)
        })}
        key={v.value}
        onClick={this.handleClick.bind(this, v.value)}
      >
        {v.label}
      </span>
    ))
  }

  render() {
    const {
      characteristic,
      floor,
      oriented,
      roomType,
      onSave,
      onCancel
    } = this.props
    return (
      <div className={styles['filter-more']}>
        {/* 遮罩层 */}
        <div className="mask" onClick={onCancel} />
        {/* 条件内容 */}
        <div className="tags">
          <dl className="dl">
            <dt className="dt">户型</dt>
            <dd className="dd">{this.renderMoreList(roomType)}</dd>

            <dt className="dt">朝向</dt>
            <dd className="dd">{this.renderMoreList(oriented)}</dd>

            <dt className="dt">楼层</dt>
            <dd className="dd">{this.renderMoreList(floor)}</dd>

            <dt className="dt">房屋亮点</dt>
            <dd className="dd">{this.renderMoreList(characteristic)}</dd>
          </dl>
        </div>
        <FilterFooter
          className="footer"
          cancelText="清除"
          onCancel={() => {
            this.setState({
              selectedValues: []
            })
          }}
          onSave={() => onSave(this.state.selectedValues)}
        />
      </div>
    )
  }
}
export default FilterMore
