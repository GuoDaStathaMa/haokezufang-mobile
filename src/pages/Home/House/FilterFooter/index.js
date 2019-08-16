import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import classnames from 'classnames'

class FilterFooter extends React.Component {
  render() {
    const { onSave, onCancel, cancelText, className } = this.props
    return (
      <Flex className={classnames(styles['filter-footer'], className)}>
        {/* 取消按钮 */}
        <span className="btn cancel" onClick={onCancel}>
          {cancelText}
        </span>
        {/* 确定按钮 */}
        <span className="btn ok" onClick={onSave}>
          确定
        </span>
      </Flex>
    )
  }
}

export default FilterFooter
