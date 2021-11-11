import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import socket from "../../socket.io";
import moment from "moment";
import Icon from "@mdi/react";
import {mdiSend} from "@mdi/js";

function MailGetMessages(props) {
	const [dataUser, setDataUser] = useState({});
	const [mails, setMails] = useState([]);
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
					socket.connect();
					socket.on("mailMessages", data => {
						setMails(data)
					});
					socket.emit("subscribeToMailMessages", props.match.params.id);
					setIsLoading(false)
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
	};


	const send = () => {
		axios.post("/api/mail/newMessage", {
			token: localStorage.getItem("token"),
			id: props.match.params.id,
			text: text,
		}).then(req => {
			if (req.data.response === "ok") {
				setText("");
			}
		})
	};

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	useEffect(() => {
		return () => {
			socket.disconnect();
		}
	}, [])

	return <div className="page">
		<div className="content">
			{
				!isLoading
					? <div className="block">
						<div className="block chat">
							{
								mails.map((e, i) => {
									return <div className="msg">
										<div className="name">{e.userFromName} {moment(e.time).format("DD/MM HH:mm")}</div>
										<div className="text">{e.text}</div>
									</div>
								})
							}
						</div>
					</div>
					: <h3>Loading...</h3>
			}
			<div className="block">
				<div className="formChat">
					<input type="text" className="input" onChange={e => setText(e.target.value)} value={text}/>
					<button className="button blue" onClick={send}><Icon path={mdiSend} size={1}/></button>
				</div>
			</div>
		</div>
	</div>
}

export default withRouter(MailGetMessages);