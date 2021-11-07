import React, {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import axios from "axios";

function Login(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

	const login = () => {
		axios.post("/api/users/auth/login", {
			email: email,
			pass: password,
		}).then(req => {
			if (req.data.response === "ok") {
				localStorage.setItem("token", req.data.data.token);
				props.history.push("/home?reload=true");
			} else {
				setResponse("err");
			}
		})
	};

	return <div className="page">
		<div className="content">
			<h3>Вход</h3>
			<div className="form">
				<label htmlFor="email">EMail</label>
				<input type="text" id="email" className="input" onChange={e => setEmail(e.target.value)}/>
				<label htmlFor="password">Пароль</label>
				<input type="password" id="password" className="input" onChange={e => setPassword(e.target.value)}/>
				<button className="button" onClick={login}>Вход</button>
			</div>
		</div>
	</div>
}

export default withRouter(Login);