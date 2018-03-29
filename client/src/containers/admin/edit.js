import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBook, updateBook, clearBook, deletePost } from '../../actions';

class EditBook extends PureComponent {

	state = {
		formdata: {
			_id: this.props.match.params.id,
			title: '',
			author: '',
			pages: '',
			review: '',
			rating: '',
			price: ''
		}
	}

	deleteBook = () => {
		this.props.dispatch(deletePost(this.props.match.params.id))
	}

	handleInput = (event, name) => {
		const newFormData = {
			...this.state.formdata
		}

		newFormData[name] = event.target.value

		this.setState({ formdata: newFormData })
	}

	redirectUser = () => {
		setTimeout( () => {
			this.props.history.push('/user/user-reviews')
		}, 1000)
	}

	submitForm = (event) => {
		event.preventDefault();
		this.props.dispatch(updateBook(this.state.formdata))
	}

	
	componentWillMount() {
		this.props.dispatch(getBook(this.props.match.params.id))
	}

	componentWillReceiveProps(nextProps) {
		let book = nextProps.books.book;
		this.setState({
			formdata: {
				_id: book._id,
				title: book.title,
				author: book.author,
				pages: book.pages,
				review: book.review,
				rating: book.rating,
				price: book.price
			}
		})
	}

	componentWillUnmount() {
		this.props.dispatch(clearBook())
	}
	
	render() {
		let books = this.props.books;
		return (
			<div className="rl_container article">
				{
					books.book
						? null
						: <div className="red_tag">Post does not exist {this.redirectUser()}</div>
				}
				{
					books.updateBook 
						? <div className="edit_confirm">
							Post Updated, <Link to={`/books/${books.book._id}`}>View post</Link></div>
						: null
				}
				{
					books.postDeleted
						? <div className="red_tag">Post deleted {this.redirectUser()}</div>	
						: null
				}
				<form onSubmit={this.submitForm}>
					<h2>Edit review</h2>
					<div className="form_element">
						<input
							onChange={(event) => { this.handleInput(event, 'title') }}
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
					<button type="submit">Edit review</button>
					<div className="delete_post">
						<div className="button" onClick={this.deleteBook}>
							Delete Review
						</div>
					</div>
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

export default connect(mapStateToProps)(EditBook)