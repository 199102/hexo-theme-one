import getMuiTheme from 'material-ui/styles/getMuiTheme';
import color2Theme from '../../lib/color2Theme';
import Menu from '../Menu/Menu';
import AppState from '../../stateI';
import * as React from 'react';
import { connect } from 'react-redux'
import zh_CN from '../../locale/zh_CN';
import en_US from '../../locale/en_US';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { Router, Route, hashHistory, IndexRoute, applyRouterMiddleware } from 'react-router';
import Home from '../home/home'
import Post from '../post/post';
import * as zh from 'react-intl/locale-data/zh';
import * as en from 'react-intl/locale-data/en';
import { IntlProvider, addLocaleData } from 'react-intl'
import Drawer from '../Drawer/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Background from '../background/background'
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SearchX from '../search/search'
let useScroll = require('react-router-scroll/lib/useScroll');
addLocaleData(zh);
addLocaleData(en);
var style = require('./app.less')

const TransitionGroup = ({ children, location }: any) => (
  <ReactCSSTransitionGroup
    component="div"
    transitionName="route-page"
    transitionEnterTimeout={450}
    transitionLeaveTimeout={450}
    className={style.TransitionGroup}
  >
    {React.cloneElement(children, {
      key: location.pathname
    })}
  </ReactCSSTransitionGroup>
)

interface AppProps {
  color?: {
    primaryColor?: string,
    accentColor?: string
  }
  children?: React.ReactElement<any>
  fullModel?: boolean
}

function chooseLocale() {
  switch (navigator.language.split('_')[0]) {
    case 'en':
      return en_US;
    case 'zh':
      return zh_CN;
    default:
      return zh_CN;
  }
}

interface AppComponentState {
  sidebar?: boolean
}

export class App extends React.Component<AppProps, AppComponentState>{
  constructor(props: any) {
    super(props);
    this.state = {
      sidebar: false
    }
  }

  MenuToggle() {
    this.setState((state) => ({
      ...state,
      sidebar: !this.state.sidebar
    }))
  }

  render() {
    let {color = {}, fullModel = false} = this.props;
    let {primaryColor, accentColor} = color;
    let t = color2Theme(primaryColor, accentColor);
    t.fontFamily = '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
    let Theme = getMuiTheme(t);
    return (
      <IntlProvider
        locale={navigator.language}
        messages={chooseLocale()}>
        <MuiThemeProvider muiTheme={Theme}>
          <div style={{
            fontFamily: Theme.fontFamily
          }} className={style.body}>
            <Menu onclickLeft={this.MenuToggle.bind(this)} />
            <Background />
            <Drawer
              open={this.state.sidebar}
              onRequestChange={this.MenuToggle.bind(this)}
            />
            <div id={style.container} className={fullModel ? style.fullModel : undefined}>
              <main id={style.main}>
                <Router history={hashHistory} render={applyRouterMiddleware(useScroll())}>
                  <Route path="/" component={TransitionGroup}>
                    <IndexRoute component={Home} />
                    <Route path="/post/:slug" component={Post} />
                    <Route path="/search" component={SearchX} />
                  </Route>
                </Router>
              </main>
            </div>
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    color: state.theme.color || {
      primaryColor: 'cyan',
      pccentColor: 'pink'
    },
    fullModel: state.nav.fullModel
  }
}

let AppX = connect(mapStateToProps)(App as any)

export default AppX