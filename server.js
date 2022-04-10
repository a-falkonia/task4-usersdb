const express = require('express')
const config = require('config')

const app = express()

const PORT = (process.env.PORT || 3000);

const server = require('http').createServer(app)
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

let db = require("./src/mongoose.js")

app.use('/public', express.static('public'))
app.use('/build', express.static('build'))
app.use('/src', express.static('src'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser('cookies'))

server.listen(PORT, (err) => {
	if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${PORT}`)
})

app.get('/sign', (req, res) => {
	res.sendFile('/public/sign.html', { root: __dirname })
})

app.get('/', (req, res) => {
	res.sendFile('/public/index.html', { root: __dirname })
})

app.post('/user', (req, res) => {
	db.User.find({ name: req.body.name })
	.then(users => {
		if(users.length == 0) {
			let user = new db.User(req.body)
			user.save(() => console.log("user saved"))
			res.send(true)
		}
		else {
			res.send(false)
		}
	})	
})
app.post('/find', (req, res) => {
	db.User.find({ name: req.body.name, pass: req.body.pass })
	.then(users => {
		if (users.length > 0) {
			res.cookie("name", req.body.name)
		}
		res.send(users)
	})
})
app.post('/getUser', (req, res) => {
	db.User.find({ name: req.body.name })
	.then(users => {
		res.send(users)
		return
	})
})
app.post('/deleteUser', (req, res) => {
	try {
		db.User.deleteMany({ name: req.body.name })
		.then(e => res.send(e))
	}
	catch(err) {
		throw err
	}
	
})
app.post('/blockUser', (req, res) => {
	db.User.find({ name: req.body.name })
	.then(users => {
		users[0].blocked = true
		users[0].save()
		res.send(true)
	})
})
app.post('/unblockUser', (req, res) => {
	db.User.find({ name: req.body.name })
	.then(users => {
		users[0].blocked = false
		users[0].save()
		res.send(true)
	})
})
app.get('/logout', (req, res) => {
	res.clearCookie("name")
	res.send(true)
})
app.post('/updateUser', (req, res) => {
	db.User.find({ name: req.body.name })
	.then(users => {
		if (users.length > 0) {
			users[0].Logdate = new Date()
			users[0].save()
			res.send(true)
			return
		}
		res.send(false)
	})
})
app.post('/findAll', (req, res) => {
	db.User.find()
	.then(users => {
		res.send(users)
	})
})

