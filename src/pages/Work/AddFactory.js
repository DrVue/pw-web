import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";

function FactoryAdd(props) {
	const [dataUser, setDataUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [err, setErr] = useState(null);

	const [name, setName] = useState("");
	const [type, setType] = useState("gold");

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
		axios.post("/api/factory/add", {
			token: localStorage.getItem("token"),
			name: name,
			type: type,
		}).then(req => {
			if (req.data.response === "ok") {
				props.history.push("/regions/get/" + req.data._id);
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
						<h3>Создание завода</h3>
						<div className="block">
							<div className="form">
								<label htmlFor="regionName">Имя</label>
								<input type="text" id="regionName" className="input"
								       onChange={e => setName(e.target.value)}/>
								<select name="type" id="type" onChange={e => setType(e.target.value)}>
									<option selected value="gold">Золотая шахта</option>
									<option value="oil">Нефтяная скважина</option>
									<option value="ore">Железная шахта</option>
									<option value="buildingMaterial">Глинянная шахта</option>
								</select>
								{
									response === "err"
										? <p>Недостаточно средст или имя занято</p>
										: null
								}
								<button className="button" onClick={send}>Создать (-1000000$)</button>
							</div>
						</div>
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(FactoryAdd);