import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'antd-mobile/dist/antd-mobile.css'
import './assets/fonts/iconfont.css'
import './index.scss'
import App from './App'

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)
