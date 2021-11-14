import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import Icon from "@mdi/react";
import {mdiHome, mdiAccount, mdiNewspaperVariant} from "@mdi/js";

function NavBottom(props) {
	const [dataUser, setDataUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

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

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	return <div className="navBottom">
		{
			!isLoading
				? <div className="menu">
					<Link className="link" to="/home">
						<Icon path={mdiHome} size={2}/>
						<div className="title">Домой</div>
					</Link>

					<Link className="link" to="/articles">
						<Icon path={mdiNewspaperVariant} size={2}/>
						<div className="title">Статьи</div>
					</Link>

					<Link className="link" to={"/users/get/" + dataUser._id}>
						<Icon path={mdiAccount} size={2}/>
						<div className="title">Профиль</div>
					</Link>
				</div>
				: <div/>
		}
	</div>
}

export default withRouter(NavBottom);