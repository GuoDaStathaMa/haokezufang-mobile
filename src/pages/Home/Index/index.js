import React from 'react'
import { Carousel, Flex } from 'antd-mobile'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getCityPosition } from 'tools'
import './index.scss'

import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'

class Index extends React.Component {
  state = {
    data: [1, 2, 3],
    imgHeight: 212,
    isLoaded: false,
    groupList: [],
    newsList: [],
    cityPosition: '北京'
  }
  // 获取轮播图信息
  async getSwiper() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    const { body, status } = res.data
    if (status !== 200) return false
    this.setState({
      data: body,
      isLoaded: true
    })
  }
  // 获取小组信息
  async getGroup() {
    const res = await axios.get(
      `http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0`
    )
    const { body, status } = res.data
    if (status !== 200) return false
    this.setState({
      groupList: body
    })
  }
  // 获取资讯列表
  async getNews() {
    const res = await axios.get(
      `http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0`
    )
    const { body, status } = res.data
    if (status !== 200) return false
    this.setState({
      newsList: body
    })
  }
  // 调用axios
  async componentDidMount() {
    this.getSwiper()
    this.getGroup()
    this.getNews()
    const city = await getCityPosition()
    this.setState({
      cityPosition: city.label
    })
  }
  // 渲染轮播图封装
  renderSwiper() {
    if (!this.state.isLoaded) return null
    return (
      <Carousel autoplay infinite>
        {this.state.data.map(val => (
          <a
            key={val.id}
            href="http://www.baidu.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${val.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }
  // 顶部搜索框
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-form">
          <div
            className="location"
            onClick={() => this.props.history.push('/city')}
          >
            <span className="name">{this.state.cityPosition}</span>
            <i className="iconfont icon-arrow"> </i>
          </div>
          <div className="search-input">
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        {/* 地图小图标 */}
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
  // 渲染导航封装
  renderNav() {
    return (
      <Flex>
        <Flex.Item>
          <Link to="/home/house">
            <img src={Nav1} alt="" />
            <p>整租</p>
          </Link>
        </Flex.Item>

        <Flex.Item>
          <Link to="/home/house">
            <img src={Nav2} alt="" />
            <p>合租</p>
          </Link>
        </Flex.Item>

        <Flex.Item>
          <Link to="/map">
            <img src={Nav3} alt="" />
            <p>找房</p>
          </Link>
        </Flex.Item>

        <Flex.Item>
          <Link to="/home/rent">
            <img src={Nav4} alt="" />
            <p>出租</p>
          </Link>
        </Flex.Item>
      </Flex>
    )
  }
  // 渲染出租小组封装
  renderRentGroup() {
    return (
      <div>
        <h3>
          租房小组 <span>更多</span>
        </h3>

        <div className="grouplist">
          <ul>{this.renderGroupList()}</ul>
        </div>
      </div>
    )
  }
  // 渲染小组列表
  renderGroupList() {
    return this.state.groupList.map(v => (
      <li key={v.id}>
        <div className="des fl">
          <p>{v.title}</p>
          <span>{v.desc}</span>
        </div>
        <div className="img fr">
          <img src={`http://localhost:8080${v.imgSrc}`} alt="" />
        </div>
      </li>
    ))
  }
  // 渲染资讯封装
  renderNews() {
    return (
      <div>
        <h3>最新资讯</h3>
        <div className="newlist">
          <ul>{this.renderNewsList()}</ul>
        </div>
      </div>
    )
  }

  // 渲染资讯列表
  renderNewsList() {
    return this.state.newsList.map(v => (
      <li key={v.id}>
        <div className="img fl">
          <img src={`http://localhost:8080${v.imgSrc}`} alt="" />
        </div>
        <div className="content">
          <h3>{v.title}</h3>
          <div className="from">
            <span className="newweb fl">{v.from}</span>
            <span className="time fr">{v.date}</span>
          </div>
        </div>
      </li>
    ))
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {this.renderSearch()}
          {this.renderSwiper()}
        </div>
        {/* 导航 */}
        <div className="nav">{this.renderNav()}</div>
        {/* 租房小组 */}
        <div className="group">{this.renderRentGroup()}</div>
        {/* 最新资讯 */}
        <div className="news">{this.renderNews()}</div>
      </div>
    )
  }
}
export default Index
