import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function Factors(props) {
	const [dataUser, setDataUser] = useState({});
	const [factors, setFactors] = useState([]);
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
					get(req.data.data.region);
				} else {
					props.history.push("/");
				}
			}).catch(() => setIsLoading(false))
		}
	};

	const get = (region) => {
		axios.post("/api/factory/getAll", {
			region: region,
		}).then(req => {
			if (req.data.response === "ok") {
				setFactors(req.data.data);
				setIsLoading(false);
			}
		}).catch(() => setIsLoading(false))
	}

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	return <div className="page">
		<div className="content">
			{
				!isLoading
					? <div className="block">
						<Link className="button" to="/factory/add">Создать завод</Link>
						{
							factors.map((e, i) => {
								return <Link className="button" to={`/factory/get/${e._id}`}>{e.name} ({e.type})</Link>
							})
						}
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Factors);