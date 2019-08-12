import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'

class FilterFooter extends React.Component {
  render() {
    const { onSave, onCancel } = this.props
    return (
      <Flex className={styles['filter-footer']}>
        {/* 取消按钮 */}
        <span className="btn cancel" onClick={onCancel}>
          取消
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
