import React, { Component } from 'react';
import { auth } from '../actions';
import { connect } from 'react-redux';

/**
 * Returns the passed component based on the props.
 * 
 * Checks if user is logged in using isAuth prop.
 * 
 * If isAuth = true (they are logged in):
 * 		checks if the page should reload
 * 			if true, stay on page, do not reload.
 * 			if false, send user to /user
 * 			if null, load page
 * 
 * if isAuth = false (they are not logged in):
 * 		checks if the page should reload
 * 			if true, send user to /login
 * 			if false, stay on page, do not reload.
 * 			if null, load page
 * 			
 * @param 		Component 		ComposedClass 		A component
 * @param 		bool 			reload 				true || false || null
 * @return 		mixed 						 		A Component || loading message
 */
export default function(ComposedClass,reload){
	class AuthenticationCheck extends Component {

		state = {
			loading: true,
		}

		componentWillMount(){
			this.props.dispatch( auth() )
		}

		componentWillReceiveProps(nextProps){

			this.setState({loading:false});

			// Only checks for true or false. Null does nothing.
			if ( ! nextProps.user.login.isAuth ) {
				if (reload) {
					this.props.history.push('/login');
				}
			} else {
				if (false === reload) {
					this.props.history.push('/user');
				}

			}
		}

		render() {
			if ( this.state.loading ) {
				return <div className="loader">Loading...</div>
			} 

			return (
				<ComposedClass {...this.props} user={this.props.user} />
			);
		}
	}

	const mapStateToProps = (state) => {
		return {
			user: state.user
		}
	}

	return connect(mapStateToProps)(AuthenticationCheck)
};