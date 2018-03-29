import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserPosts } from '../../actions';
import moment from 'moment-js';
import { Link } from 'react-router-dom';

class UserPosts extends Component {
	
	componentWillMount() {
		this.props.dispatch(getUserPosts(this.props.user.login.id))	
	}

	showUserPosts = (user) => (
		user.userPosts 
			? user.userPosts.map( (item,i) => (
					<tr key={i}>
						<td><Link to={
							`/user/edit-post/${item._id}`
						}>
							{item.title}
						</Link></td>
						<td>{item.author}</td>
						<td>
							{moment(item.createdAt).format("MM/DD/YY")}
						</td>
					</tr>
				) )
			: null
	)
	
	render() {
		let user = this.props.user;
		console.log(user.userPosts)

		return (
			<div className="user_posts">
				<h4>Your Reviews</h4>
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Author</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{this.showUserPosts(user)}
					</tbody>
				</table>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(UserPosts);