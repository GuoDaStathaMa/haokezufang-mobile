import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import SearchHeader from 'common/SearchHeader'
import Filter from './Filter'

class House extends React.Component {
  render() {
    return (
      <div className={styles.house}>
        <Flex className="search-wrapper">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName="上海" className="search" />
        </Flex>
        <Filter />
      </div>
    )
  }
}
export default House
