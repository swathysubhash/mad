import Page from './components/layout/page';
import Pages from './pages/index';
import Inferno from 'inferno'
import { Router, Route, IndexRoute } from 'inferno-router'

export const routes = (
	<Route path="/" component={Page}>
		<IndexRoute component={Pages.ApiList}/>
		<Route path="/apilist" component={Pages.ApiList} />
		<Route path="/editor" component={Pages.Editor} />
		<Route path="/account" component={Pages.UserProfile} />
	</Route>
)