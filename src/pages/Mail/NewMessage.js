import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function MailAddMessage(props) {
	const [dataUser, setDataUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);

	const [text, setText] = useState("");

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					setIsLoading(false);
				} else {
					props.history.push("/");
				}
			})
		}
	};

	const send = () => {
		axios.post("/api/mail/newMessage", {
			token: localStorage.getItem("token"),
			id: props.match.params.id,
			text: text,
		}).then(req => {
			if (req.data.response === "ok") {
				props.history.push("/home");
			} else {
				setResponse("err");
			}
		})
	};

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	return <div className="page">
		<div className="content">
			{
				!isLoading
					? <div>
						<h3>Отправка сообщения</h3>
						<div className="block">
							<div className="form">
								<label htmlFor="regionName">Текст сообщения</label>
								<input type="text" id="regionName" className="input"
								       onChange={e => setText(e.target.value)}/>
								<button className="button" onClick={send}>Отправить</button>
							</div>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(MailAddMessage);