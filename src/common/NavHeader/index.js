import React from 'react'
// 处理组件props对象内无history属性问题
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import styler from './index.module.scss'
class NavHeader extends React.Component {
  render() {
    return (
      <NavBar
        className={styler.navBar}
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onLeftClick={() => this.props.history.go(-1)}
      >
        {this.props.children}
      </NavBar>
    )
  }
}

export default withRouter(NavHeader)
