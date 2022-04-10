import '../public/css/bootstrap.min.css'
import '../public/css/style.css'
import React from 'react'
import axios from 'axios'

class Form extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			form: "reg",
			values: {
				reg: { name: "", email: "", pass: "", repass: "", error: "" },
				log: { name: "", pass: "", error: "" }
			}
		}
	}
	changeValue(e) {
		this.setState((state) => {
			state.values[state.form][e.target.id] = e.target.value
		})
		this.forceUpdate()
	}
	validate() {
		if (this.state.values.reg.pass === "" || this.state.values.reg.name === "" 
			|| this.state.values.reg.email === "" || this.state.values.reg.repass === "") {
			this.state.values.reg.error = <span>Не все поля заполнены</span>
			this.forceUpdate()
			return false
		}
		if (this.state.values.reg.name.length > 16) {
			this.state.values.reg.error = <span>Имя не должно превышать длинну в 16 символов.</span>
			this.forceUpdate()
			return false
		}
		if (this.state.values.reg.pass !== this.state.values.reg.repass) {
			this.state.values.reg.error = <span>Пароли не совпадают.</span>
			this.forceUpdate()
			return false
		}
		return true
	}
	send() {
		if (this.state.form === "reg") {
			if (!this.validate()) return
			axios.post('/user', {
				name: this.state.values.reg.name,
				email: this.state.values.reg.email,
				Regdate: new Date(),
				Logdate: 0,
				pass: this.state.values.reg.pass,
				blocked: false
			})
			.then((res) => {
				if (res.data == true) {
					this.state.form = "log"
					this.state.values.reg.name = ""
					this.state.values.reg.email = ""
					this.state.values.reg.pass = ""
					this.state.values.reg.repass = ""
					this.forceUpdate()
				}
			})
			.catch((err) => {
				console.log(err)
			})
		}
		else {
			axios.post('/find', {
				name: this.state.values.log.name,
				pass: this.state.values.log.pass
			})
			.then((res) => {
				if (res.data.length == 0) {
					this.state.values.log.error = <span>Неверное имя пользователя или пароль.</span>
					this.forceUpdate()
				}
				else if (!res.data[0].blocked) {
					axios.post('/updateUser', { name: this.state.values.log.name })
					window.location.href = "/"
				} 
				else alert("Ваш аккаунт заблокирован!")
			})
			.catch((err) => {
				console.log(err)
			})
		}
	}
	changeForm(e) {
		if (e.target.innerText == "Sing Up") this.setState({ form: 'reg'})
		else this.setState({ form: 'log'})
	}
	render() {
		if(this.state.form === "reg") {
			return (
				<form>
					<div className="forms">
						<span className="active" onClick={this.changeForm.bind(this)}>Sing Up</span>
						<span onClick={this.changeForm.bind(this)}>Sing In</span>
					</div>
					<div className="mb-3">
				    	<label className="form-label">Username</label>
				    	<input type="text" className="form-control" id="name" value={this.state.values.reg.name} onInput={this.changeValue.bind(this)} />
				  	</div>
					<div className="mb-3">
				    	<label className="form-label">Email address</label>
				    	<input type="email" className="form-control" id="email" value={this.state.values.reg.email} onInput={this.changeValue.bind(this)} />
				    	<div className="form-text">We'll never share your email with anyone else.</div>
				  	</div>
				  	<div className="mb-3">
				    	<label className="form-label">Password</label>
				    	<input type="password" className="form-control" id="pass" value={this.state.values.reg.pass} onInput={this.changeValue.bind(this)} />
				  	</div>
				  	<div className="mb-3">
				    	<label className="form-label">Repeat Password</label>
				    	<input type="password" className="form-control" id="repass" value={this.state.values.reg.repass} onInput={this.changeValue.bind(this)} />
				  	</div>
				  	<div className="error">{this.state.values.reg.error}</div>
				  	<div onClick={this.send.bind(this)} className="btn btn-primary">Register</div>
				</form>
			)
		}
		else {
			return(
				<form>
					<div className="forms">
						<span onClick={this.changeForm.bind(this)}>Sing Up</span>
						<span className="active" onClick={this.changeForm.bind(this)}>Sing In</span>
					</div>
					<div className="mb-3">
					    <label className="form-label">Username</label>
					    <input type="text" className="form-control" id="name" value={this.state.values.log.name} onInput={this.changeValue.bind(this)} />
					</div>
					<div className="mb-3">
					    <label className="form-label">Password</label>
					    <input type="password" className="form-control" id="pass" value={this.state.values.log.pass} onInput={this.changeValue.bind(this)} />
					</div>
					<div className="error">{this.state.values.log.error}</div>
					<div onClick={this.send.bind(this)} className="btn btn-primary">Log In</div>
				</form>
			)	
		}
	}
}

export default Form