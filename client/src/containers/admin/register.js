import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getUsers, registerUser } from '../../actions';

class Register extends PureComponent {

	state = {
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		error: ''
	}

	handleInputEmail = (event) => {
		this.setState({ email: event.target.value});
	}

	handleInputPassword = (event) => {
		this.setState({ password: event.target.value });
	}

	handleInputFirstname = (event) => {
		this.setState({ firstname: event.target.value });
	}

	handleInputLastname = (event) => {
		this.setState({ lastname: event.target.value });
	}

	showUsers = (users) => (
		users 
			? users.map( (item) => (
				<tr key={item._id}>
					<td>{item.firstname}</td>
					<td>{item.lastname}</td>
					<td>{item.email}</td>
				</tr>
			))
			: null
	)

	submitForm = (event) => {
		event.preventDefault();

		this.setState({ error: '' });

		this.props.dispatch(registerUser({
			email: this.state.email,
			password: this.state.password,
			firstname: this.state.firstname,
			lastname: this.state.lastname
		}, this.props.user.users))
	}


	
	componentWillMount() {
		this.props.dispatch(getUsers())
	}

	componentWillReceiveProps(nextProps) {
		if ( false === nextProps.user.register ) {
			this.setState({ error: 'Error, try again.' });
		} else {
			this.setState({ 
				firstname: '',
				lastname: '',
				email: '',
				password: ''
			});
		}
	}
	
	render() {
		return (
			<div className="rl_container">
				<form onSubmit={this.submitForm}>
					<h2>Add User</h2>
					<div className="form_element">
						<input
							onChange={this.handleInputFirstname}
							placeholder="Enter first name"
							type="text"
							value={this.state.firstname}
						/>
					</div>
					<div className="form_element">
						<input
							onChange={this.handleInputLastname}
							placeholder="Enter last name"
							type="text"
							value={this.state.lastname}
						/>
					</div>
					<div className="form_element">
						<input
							onChange={this.handleInputEmail}
							placeholder="Enter email"
							type="email"
							value={this.state.email}
						/>
					</div>
					<div className="form_element">
						<input
							onChange={this.handleInputPassword}
							placeholder="Enter password"
							type="passwrd"
							value={this.state.password}
						/>
					</div>
					<button type="submit">Add User</button>
					<div className="error">
						{this.state.error
							? <div>{this.state.error}</div>
							: null
						}
					</div>
				</form>
				<div className="current_users">
					<h4>Current Users:</h4>
					<table>
						<thead>
							<tr>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Email</th>
							</tr>
						</thead>
						<tbody>
							{this.showUsers(this.props.user.users)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Register);