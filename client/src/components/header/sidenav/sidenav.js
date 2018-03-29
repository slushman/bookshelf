import React from 'react';
import SideNav from 'react-simple-sidenav';
import SideNavItems from './sidenav_items.js';

const Nav = (props) => {
	return (
		<SideNav
			showNav={props.showNav}
			onHideNav={props.onHideNav}
			navStyle={{
				backgroundColor:'#242424',
				maxWidth: '220px'
			}}
		>
			<SideNavItems />
		</SideNav>
	);
};

export default Nav;