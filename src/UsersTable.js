import '../public/css/bootstrap.min.css'
import '../public/css/style.css'
import React from 'react'
import axios from 'axios'

class UsersTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			usersData: [],
			users: []
		}
	}
	componentDidMount() {
		this.updateUsers()
	}
	updateUsers() {
		axios.post('/findAll', {})
		.then(users => {
			this.state.usersData = users.data
			this.setUsers()
		})
	}
	setUsers() {
		this.state.users = []
		for (let i = 0; i < this.state.usersData.length; i++) {
			this.state.users.push(<User name={this.state.usersData[i].name} email={this.state.usersData[i].email}
			regDate={this.state.usersData[i].regdate} logDate={this.state.usersData[i].logdate}
			checked={this.state.usersData[i].checked} number={i + 1} toggle={this.select.bind(this)}
			status={this.state.usersData[i].blocked} />)
		}
		this.forceUpdate()
	}
	selectAll(e) {
		if (e.target.checked) {
			for (let i = 0; i < this.state.usersData.length; i++) {
				this.state.usersData[i].checked = true;
			}
		}
		else {
			for (let i = 0; i < this.state.usersData.length; i++) {
				this.state.usersData[i].checked = false;
			}
		}
		this.setUsers()
	}
	deleteUsers() {
		for (let i = 0; i < this.state.usersData.length; i++) {
			if (this.state.usersData[i].checked) {
				if (this.state.usersData[i].name === document.cookie.split("=")[1]) this.logout()
				axios.post('/getUser', { name: document.cookie.split("=")[1] })
				.then(users => {
					if(users.data.length > 0 && !users.data[0].blocked) {
						axios.post('/deleteUser', { name: this.state.usersData[i].name })
						.then(e => this.updateUsers())
					}
					else this.logout()
				})
			}
		}
	}
	blockUsers() {
		for (let i = 0; i < this.state.usersData.length; i++) {
			if (this.state.usersData[i].checked) {
				if (this.state.usersData[i].name === document.cookie.split("=")[1]) this.logout()
				axios.post('/getUser', { name: document.cookie.split("=")[1] })
				.then(users => {
					console.log(users)
					if(users.data.length > 0 && !users.data[0].blocked) {
						axios.post('/blockUser', { name: this.state.usersData[i].name })
						.then(e => this.updateUsers())
					}
					else this.logout()
				})
			}
		}
		this.updateUsers()
	}
	unblockUsers() {
		for (let i = 0; i < this.state.usersData.length; i++) {
			if (this.state.usersData[i].checked) {
				axios.post('/getUser', { name: document.cookie.split("=")[1] })
				.then(users => {
					if(users.data.length > 0 && !users.data[0].blocked) {
						axios.post('/unblockUser', { name: this.state.usersData[i].name })
						.then(e => this.updateUsers())
					}
					else this.logout()
				})
			}
		}
		this.updateUsers()
	}
	select(i, value) {
		this.state.usersData[i].checked = value
		this.setUsers()
	}
	logout() {
		axios.get('/logout')
		.then((res) => {
			window.location.href = "/"
		})
	}
	render() {
		return (
			<React.Fragment>
					<button type="button" class="btn btn-secondary" onClick={this.logout}>
						Logout
					</button>
				<div className="toolbar">
					<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" onClick={this.deleteUsers.bind(this)}>
					  Delete
					</button>
					<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" id="block" onClick={this.blockUsers.bind(this)}>
					  Block
					</button>
					<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" onClick={this.unblockUsers.bind(this)}>
					  Unblock
					</button>
				</div>
				<table className="table">
				  <thead>
				    <tr>
				      <th scope="col">#</th>
				      <th scope="col">Username</th>
				      <th scope="col">Email</th>
				      <th scope="col">Registration Date</th>
				      <th scope="col">Login Date</th>
				      <th scope="col">Status</th>
				      <th scope="col"><input type="checkbox" onClick={this.selectAll.bind(this)}/> Select All</th>
				    </tr>
				  </thead>
				  <tbody>
				    {this.state.users}
				  </tbody>
				</table>
			</React.Fragment>
		)
	}
}

class User extends React.Component {
	constructor(props) {
		super(props)
	}
	toggle(e) {
		this.props.toggle(this.props.number - 1, e.target.checked)
	}
	render() {
		return (
      <tr>
        <th scope="row">{this.props.number}</th>
        <td>{this.props.name}</td>
        <td>{this.props.email}</td>
        <td>{this.props.regDate}</td>
        <td>
          {this.props.logDate == "0"
            ? "hasn't logged in yet"
            : this.props.logDate}
        </td>
        <td>{this.props.status ? "blocked" : "not blocked"}</td>
        <td>
          <input
            type="checkbox"
            checked={this.props.checked}
            onClick={this.toggle.bind(this)}
          />
        </td>
      </tr>
    );
		
	}
}

export default UsersTable