import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import socket from "../socket.io";
import moment from "moment";
import {mdiSend} from "@mdi/js";
import Icon from "@mdi/react";

function GlobalChat(props) {
	const [dataUser, setDataUser] = useState({});
	const [msgs, setMsgs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [text, setText] = useState("");

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					// if (!socket.connected) {
					socket.connect();
						socket.on("message", data => {setMsgs(data);});
						socket.emit("subscribeToChat", "globalRU");
					// }
					setIsLoading(false);
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
	};

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
		// return () => {
		// 	socket.disconnect();
		// }
	})

	useEffect(() => {
		return () => {
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
									<Link className="name" to={`/users/get/${e.userId}`} style={{color: "white"}}>{e.userName} {moment(e.time).format("HH:mm")}</Link>
									<div className="text">{e.text}</div>
								</div>
							})
						}
					</div>
					: <h3>Loading...</h3>
			}
			<div className="formChat">
				<input type="text" className="input" onChange={e => setText(e.target.value)} value={text}/>
				<button className="button blue" onClick={send}><Icon path={mdiSend} size={1}/></button>
			</div>
		</div>
	</div>
}

export default withRouter(GlobalChat);