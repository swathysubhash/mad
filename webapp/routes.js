import Page from './components/layout/page';
import Pages from './pages/index';
import Inferno from 'inferno'
import { Router, Route, IndexRoute } from 'inferno-router'

export const routes = (
	<Route component={Page}>
		<IndexRoute component={Pages.ApiList}/>
		<Route path="/documents" component={Pages.ApiList} />
		<Route path="/account" component={Pages.UserProfile} />
		<Route path="/documents/:documentId" component={Pages.Documents} >
			<Route title="Editor" path="/editor" component={Pages.DocumentsEditor}>
				<IndexRoute component={Pages.DocumentsEditorOverview}/>
				<Route path="/group/:groupId" component={Pages.DocumentsGroupCreate} />
				<Route path="/endpoint/:endpointId" component={Pages.DocumentsEndpointCreate} />	
			</Route>
			<Route title="Style" path="/style" component={Pages.DocumentsStyle} />
			<Route title="Access" path="/access" component={Pages.DocumentsAccess} />
			<Route title="Revision" path="/revision" component={Pages.DocumentsRevision} />
			<Route title="Settings" path="/settings" component={Pages.DocumentsSettings} />
		</Route>
	</Route>
)
