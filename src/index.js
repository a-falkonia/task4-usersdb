import ReactDOM from 'react-dom'
import React from 'react'
import UsersTable from './UsersTable.js'

function App () {
	let logged = document.cookie.length > 0 ? true : false
	if (!logged) window.location.href = '/sign'
	return <UsersTable />
}
let root = document.createElement("div")
root.setAttribute("id", "root2")
document.body.append(root)
ReactDOM.render(<App />, root)