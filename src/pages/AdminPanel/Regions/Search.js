import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import Icon from "@mdi/react";
import {mdiMagnify} from "@mdi/js";

function AdminRegionsSearch(props) {
	const [dataUser, setDataUser] = useState({});
	const [regions, setRegions] = useState([]);
	const [name, setName] = useState("");
	const [isSearching, setIsSearching] = useState(false);
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
					props.history.push("/home");
				}
			})
		}
	};

	const searchRegions = () => {
		setIsSearching(true);
		axios.post("/api/regions/search", {
			name: name,
		}).then(req => {
			if (req.data.response === "ok") {
				setRegions(req.data.data);
				setIsSearching(false);
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
						<h3>Поиск региона</h3>
						<div className="block">
							<div className="formChat">
								<input type="text" name="search" className="input" onChange={e => setName(e.target.value)}/>
								<button className="button blue" onClick={searchRegions}><Icon path={mdiMagnify} size={1}/></button>
							</div>
						</div>
						{
							regions.length !== 0
								? !isSearching
									? <div className="block">
										{
											regions.map((e, i) => {
												return <Link className="button" to={`/region/get/${e._id}`} key={i}>{e.name} ({e.nameLat})</Link>
											})
										}
									</div>
									: <p>Поиск...</p>
								: null
						}
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(AdminRegionsSearch);