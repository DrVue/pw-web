import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function AdminPanel(props) {
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
				if (req.data.response === "ok" && req.data.data.priv === 3) {
					setDataUser(req.data.data);
					setIsLoading(false);
				} else {
					props.history.push("/home");
				}
			})
		}
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
					<h3>Админ-панель</h3>
						<div className="block">
							<Link className="button" to="/adminPanel/regions">Регионы</Link>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(AdminPanel);