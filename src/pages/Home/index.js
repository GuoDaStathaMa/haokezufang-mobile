import React from 'react'
import Index from './Index/index.js'
import House from './House'
import News from './News'
import Mine from './Mine'
import NotFoundSec from './404'
import './index.scss'
import { TabBar } from 'antd-mobile'
import { Route, Switch } from 'react-router-dom'

const list = [
  { title: '首页', icon: 'iconfont icon-ind', path: '/home' },
  { title: '找房', icon: 'iconfont icon-findHouse', path: '/home/house' },
  { title: '资讯', icon: 'iconfont icon-infom', path: '/home/news' },
  { title: '我的', icon: 'iconfont icon-my', path: '/home/mine' }
]

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: props.location.pathname
    }
  }
  // index组件跳转页面 修改home组件默认高亮
  componentDidUpdate(preProps, preState) {
    if (preProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  renderMainNav() {
    return list.map(v => (
      <TabBar.Item
        title={v.title}
        key={v.title}
        icon={<i className={v.icon} />}
        selectedIcon={<i className={v.icon} />}
        selected={this.state.selectedTab === v.path}
        onPress={() => {
          this.props.history.push(v.path)
        }}
      />
    ))
  }

  render() {
    return (
      <div className="home">
        {/* 路由 */}
        <Switch>
          <Route exact path="/home" component={Index} />
          <Route path="/home/house" component={House} />
          <Route path="/home/news" component={News} />
          <Route path="/home/mine" component={Mine} />
          <Route component={NotFoundSec} />
        </Switch>

        <div className="tabbar">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="red"
            barTintColor="white"
            noRenderContent={true}
          >
            {this.renderMainNav()}
          </TabBar>
        </div>
      </div>
    )
  }
}
export default Home
