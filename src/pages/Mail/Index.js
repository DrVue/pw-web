import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import socket from "../../socket.io";
import moment from "moment";

function Mail(props) {
	const [dataUser, setDataUser] = useState({});
	const [mails, setMails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const checkToken = () => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.post("/api/users/auth/get", {
				token: token,
			}).then(req => {
				if (req.data.response === "ok") {
					setDataUser(req.data.data);
					socket.connect();
					socket.on("mail", data => {
						setMails(data)
					});
					socket.emit("subscribeToMail", token);
					setIsLoading(false)
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
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
						{
							mails.map((e, i) => {
								return <Link className="button left"
								             to={`/mail/get/${e._id}`}>
									{e.userFromName} -> {e.userToName} {moment(e.time).format("DD/MM HH:mm")}
									<br/>
									{e.text}
								</Link>
							})
						}
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Mail);