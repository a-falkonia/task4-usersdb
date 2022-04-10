import ReactDOM from 'react-dom'
import React from 'react'
import Form from './Form.js'

function App () {
	return <Form />
}
let root = document.createElement("div")
root.setAttribute("id", "root")
document.body.append(root)
ReactDOM.render(<App />, root)