/*eslint-disable */
import './index.less'
import {routes} from './routes'

import Inferno from 'inferno'
import { Provider } from 'inferno-redux'
import { createStore } from 'redux'
import rootReducer from './reducers/index'
import Component from 'inferno-component'
import { Router, Route, IndexRoute, Redirect } from 'inferno-router'
import createBrowserHistory from 'history/createBrowserHistory'

/*eslint-enable */
let browserHistory = createBrowserHistory()
let store = createStore(rootReducer)

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory}>
					<Redirect from="/" to="/documentlist"/>
					{routes}
				</Router>
			</Provider>
		)
	}
}

Inferno.render(<App/>, document.querySelector("#app"))