import React from 'react'
import Index from './Index/index.js'
import House from './House'
import News from './News'
import Mine from './Mine'
import { TabBar } from 'antd-mobile'
import { Route, Switch, Redirect } from 'react-router-dom'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: true
    }
  }

  render() {
    return (
      <div className="home">
        <Switch>
          <Route
            path="/home"
            exact
            render={() => <Redirect to="/home/index" />}
          />
          <Route path="/home/index" component={Index} />
          <Route path="/home/house" component={House} />
          <Route path="/home/news" component={News} />
          <Route path="/home/mine" component={Mine} />
        </Switch>
        <hr />
        <div
          style={
            this.state.fullScreen
              ? { position: 'fixed', height: '100%', width: '100%', top: 0 }
              : { height: 400 }
          }
        >
          <TabBar
            unselectedTintColor="#949494"
            tintColor="green"
            barTintColor="white"
          >
            <TabBar.Item
              title="首页"
              key="首页"
              icon={<i className="iconfont icon-ind" />}
              selectedIcon={<i className="iconfont icon-ind" />}
              selected={this.state.selectedTab === 'blueTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'blueTab'
                })
                this.props.history.push('/home/index')
              }}
            />
            <TabBar.Item
              icon={<i className="iconfont icon-findHouse" />}
              selectedIcon={<i className="iconfont icon-findHouse" />}
              title="找房"
              key="找房"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'redTab'
                })
                this.props.history.push('/home/house')
              }}
            />
            <TabBar.Item
              icon={<i className="iconfont icon-infom" />}
              selectedIcon={<i className="iconfont icon-infom" />}
              title="咨询"
              key="咨询"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'greenTab'
                })
                this.props.history.push('/home/news')
              }}
            />
            <TabBar.Item
              icon={<i className="iconfont icon-my" />}
              selectedIcon={<i className="iconfont icon-my" />}
              title="我的"
              key="我的"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'yellowTab'
                })
                this.props.history.push('/home/mine')
              }}
            />
          </TabBar>
        </div>
      </div>
    )
  }
}
export default Home
