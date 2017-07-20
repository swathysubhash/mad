import "./header.less"

import { Link } from 'inferno-router'
import Inferno from 'inferno'
import Component from 'inferno-component'



class Header extends Component {
	render() {
		return (
			<div>
				<div className={"header-sub middle"}>
					<div>
						<Link to={"/"}><div class="logo"><span class="fa fa-archive" aria-hidden="true"></span><span class="brand">Mad</span><span> Writer</span></div></Link>
					</div>
					<div className={"right"}>
						<img height={"28px"} width={"28px"} className={"userimage"} src={window.STATE_FROM_SERVER.userImage.replace("https", "http")}></img>
						<div className={"username"}>{window.STATE_FROM_SERVER.userId}</div>
						<a href="/logout"><button className={"logout"}>Log out</button></a>
					</div>
				</div>
			</div>
		);
	}
}

export default Header