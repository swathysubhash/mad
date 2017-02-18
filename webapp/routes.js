import Page from './components/layout/page';
import Pages from './pages/index';
import Inferno from 'inferno'
import { Router, Route, IndexRoute } from 'inferno-router'

export const routes = (
	<Route component={Page}>
		<IndexRoute component={Pages.ApiList}/>
		<Route path="/documentlist" component={Pages.ApiList} />
		<Route path="/documentlist/create" component={Pages.ApiForm} />
		<Route path="/account" component={Pages.UserProfile} />
		<Route path="/documents/:documentId" component={Pages.Documents} >
			<Route title="Editor" path="/editor" component={Pages.DocumentsEditor}>
				<IndexRoute path="/" component={Pages.DocumentsEditorOverview}/>
				<Route path="/group/:groupId" name="group" component={Pages.DocumentsGroupCreate} />
				<Route path="/endpoint/:endpointId" subgroupType="endpoint" component={Pages.DocumentsEndpointCreate} />	
				<Route path="/schema/:endpointId" subgroupType="schema" component={Pages.DocumentsEndpointCreate} />
			</Route>
			<Route title="Style" path="/style" component={Pages.DocumentsStyle} />
			<Route title="Access" path="/access" component={Pages.DocumentsAccess} />
			<Route title="Revision" path="/revision" component={Pages.DocumentsRevision} />
			<Route title="Settings" path="/settings" component={Pages.DocumentsSettings} />
		</Route>
	</Route>
)
/*
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
*/