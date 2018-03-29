import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './hoc/layout';
import Home from './components/home/home';
import BookView from './components/books';
import Login from './containers/admin/login';
import Auth from './hoc/auth';
import User from './components/admin';
import AddReview from './containers/admin/add';
import UserPosts from './components/admin/userPosts';
import EditReview from './containers/admin/edit';
import Register from './containers/admin/register';
import Logout from './components/admin/logout';

const Routes = () => {
	return (
		<Layout>
			<Switch>
				<Route path="/" exact component={Auth(Home,null)}/>
				<Route path="/login" exact component={Auth(Login,false)} />
				<Route path="/books/:id" exact component={Auth(BookView,null)} />
				<Route path="/user" exact component={Auth(User,true)} />
				<Route path="/user/add" exact component={Auth(AddReview, true)} />
				<Route path="/user/user-reviews" exact component={Auth(UserPosts, true)} />
				<Route path="/user/edit-post/:id" exact component={Auth(EditReview, true)} />
				<Route path="/user/register" exact component={Auth(Register, true)} />
				<Route path="/user/logout" exact component={Auth(Logout, true)} />
			</Switch>
		</Layout>
	);
};

export default Routes;