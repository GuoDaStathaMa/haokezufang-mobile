import React from 'react'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
import { NavLink, Route, Switch, Redirect } from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <div className="app">
        {/* <ul>
          <li>
            <NavLink to="/home">home</NavLink>
          </li>
          <li>
            <NavLink to="/map">map</NavLink>
          </li>
          <li>
            <NavLink to="city">city</NavLink>
          </li>
        </ul>
        <hr /> */}
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/city" component={City} />
          <Route path="/map" component={Map} />
        </Switch>
      </div>
    )
  }
}

export default App
