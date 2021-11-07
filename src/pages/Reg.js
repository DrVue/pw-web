import React, {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";

function Reg(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

	const reg = () => {
		axios.post("/api/users/reg", {
			email: email,
			pass: password,
			name: name,
		}).then(req => {
			if (req.data.response === "ok") {
				props.history.push("/?reload=true");
			} else {
				setResponse("err");
			}
		})
	};

	return <div className="page">
		<div className="content">
			<h3>Регистрация</h3>
			<div className="form">
				<label htmlFor="email">EMail</label>
				<input type="text" id="email" className="input" onChange={e => setEmail(e.target.value)}/>
				<label htmlFor="password">Пароль</label>
				<input type="password" id="password" className="input" onChange={e => setPassword(e.target.value)}/>
				<label htmlFor="name">Имя</label>
				<input type="text" id="name" className="input" onChange={e => setName(e.target.value)}/>
				<button className="button" onClick={reg}>Регистрация</button>
			</div>
		</div>
	</div>
}

export default withRouter(Reg);