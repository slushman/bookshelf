import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addBook, clearNewBook } from '../../actions';

class AddBook extends Component {

	state = {
		formdata: {
			title: '',
			author: '',
			pages: '',
			review: '',
			rating: '',
			price: ''
		}
	}

	handleInput = (event,name) => {
		const newFormData = {
			...this.state.formdata
		}

		newFormData[name] = event.target.value

		this.setState({ formdata: newFormData})
	}

	showNewBook = (book) => (
		book.post 
			? <div className="conf_link">
				Cool! 
				<Link to={`/books/${book.bookID}`}>View the post</Link>
			</div>
			: null
	)

	submitForm = (event) => {
		event.preventDefault();
		this.props.dispatch(addBook({
			...this.state.formdata,
			ownerID: this.props.user.login.id
		}))
	}

	componentWillUnmount() {
		this.props.dispatch(clearNewBook())
	}
	
	render() {
		return (
			<div className="rl_container article">
				<form onSubmit={this.submitForm}>
					<h2>Add a review</h2>
					<div className="form_element">
						<input
							onChange={(event) => {this.handleInput(event,'title')}}
							placeholder="Enter book title"
							type="text"
							value={this.state.formdata.title}
						/>
					</div>
					<div className="form_element">
						<input
							onChange={(event) => { this.handleInput(event, 'author') }}
							placeholder="Enter author name"
							type="text"
							value={this.state.formdata.author}
						/>
					</div>
					<textarea
						onChange={(event) => { this.handleInput(event, 'review') }}
						value={this.state.formdata.review}
					>

					</textarea>
					<div className="form_element">
						<input
							onChange={(event) => { this.handleInput(event, 'pages') }}
							placeholder="Enter pages"
							type="number"
							value={this.state.formdata.pages}
						/>
					</div>
					<div className="form_element">
						<select
							onChange={(event) => { this.handleInput(event, 'rating') }}
							value={this.state.formdata.rating}
						>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</select>
					</div>
					<div className="form_element">
						<input
							onChange={(event) => { this.handleInput(event, 'price') }}
							placeholder="Enter price"
							type="number"
							value={this.state.formdata.price}
						/>
					</div>
					<button type="submit">Add review</button>
					{ this.props.books.newbook
						? this.showNewBook(this.props.books.newbook)
						: null
					}
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		books: state.books
	}
}

export default connect(mapStateToProps)(AddBook)