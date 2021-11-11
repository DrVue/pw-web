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

	function getTypeName (type) {
		// eslint-disable-next-line default-case
		switch (type) {
			case "gold":
				return "Золотоносная шахта";
			case "oil":
				return "Нефтяная скважина";
			case "ore":
				return "Минеральная шахта";
			case "buildingMaterial":
				return "Завод строй.материалов";
		}
	}

	useEffect(() => {
		if (isLoading) {
			checkToken();
		}
	})

	return <div className="page">
		<div className="content">
			<div className="block">
				<Link className="button green" to="/factory/add">Создать завод</Link>
			</div>
			{
				!isLoading
					? <div className="block">
						{
							factors.map((e, i) => {
								return <Link className="button" to={`/factory/get/${e._id}`}>{e.name} (LVL: {e.lvl}) <br/> {getTypeName(e.type)}</Link>
							})
						}
						{
							factors.length === 0
								? <p>Заводов в этом регионе пока нет</p>
								: null
						}
					</div>
					: <p>Loading...</p>
			}
		</div>
	</div>
}

export default withRouter(Factors);