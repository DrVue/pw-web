import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import openSocket from "socket.io-client";
const socket = openSocket("http://192.168.1.40:30011")

function subscribeToChat (cb) {
	socket.on("message", data => cb(data));
	socket.emit("subscribeToChat", "globalRU");
}

function GlobalChat(props) {
	const [dataUser, setDataUser] = useState({});
	const [msgs, setMsgs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [text, setText] = useState("");
	// const [interval] = useState(setInterval(() => get(), 1000))

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					socket.on("message", data => {setMsgs(data); console.log(data)});
					socket.emit("subscribeToChat", "globalRU");
					setIsLoading(false);
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
	};

	const get = () => {
		// axios.post("/api/chats/getMessagesByTag", {
		// 	// id: props.match.params.id,
		// 	tag: props.tag,
		// }).then(req => {
		// 	if (req.data.response === "ok") {
		// 		setMsgs(req.data.data);
		// 		setIsLoading(false);
		// 	}
		// })

	}

	const send = () => {
		axios.post("/api/chats/newMessageByTag", {
			token: localStorage.getItem("token"),
			text: text,
			tag: props.tag,
		}).then(req => {
			if (req.data.response === "ok") {
				// get();
			}
			setText("");
		})
	}

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	useEffect(() => {
		if (!isLoading) {
			socket.disconnect();
		}
	}, [])

	return <div className="">
		<div className="block">
			<p>Глобальный RU чат</p>
			{
				!isLoading
					? <div className="block chat">
						{
							msgs.map((e, i) => {
								return <div className="msg">
									<div className="name">{e.userName}</div>
									<div className="text">{e.text}</div>
								</div>
							})
						}
					</div>
					: <h3>Loading...</h3>
			}
			<div className="formChat">
				<input type="text" className="input" onChange={e => setText(e.target.value)} value={text}/>
				<button className="button" onClick={send}>SEND</button>
			</div>
		</div>
	</div>
}

export default withRouter(GlobalChat);