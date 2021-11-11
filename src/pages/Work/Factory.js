import React, {useState, useEffect} from "react";
import {withRouter, Link} from "react-router-dom";
import axios from "axios";
import Resources from "../../components/Resourses";
import socket from "../../socket.io";
import moment from "moment";

function Factory(props) {
	const [dataUser, setDataUser] = useState({});
	const [factory, setFactory] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [response, setResponse] = useState(null);
	const [responseCashOut, setResponseCashOut] = useState(null);
	const [err, setErr] = useState(null);
	const [msg, setMsg] = useState(null);

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

	const get = () => {
		axios.post("/api/factory/getOne", {
			id: props.match.params.id,
		}).then(req => {
			if (req.data.response === "ok") {
				setFactory(req.data.data);
				setIsLoading(false);
				// console.log(dataUser._id === factory.userId);
			}
		}).catch(() => setIsLoading(false))
	}

	const work = (e = 10) => {
		setMsg("Working...")
		const token = localStorage.getItem("token");
		axios.post("/api/factory/work", {
			id: props.match.params.id,
			token: token,
			energy: 10,
		}).then(req => {
			if (req.data.response === "ok") {
				setMsg("OK")
				// socket.emit("updateUserInfo", token);
			} else {
				setResponse("err");
				setMsg("Энергия кончилась")
				// socket.emit("updateUserInfo", token);
			}
		})
	}

	function getTypeName(type) {
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

	const cashOut = (type) => {
		const token = localStorage.getItem("token");
		axios.post("/api/factory/cashOut", {
			id: props.match.params.id,
			token: token,
			type: type,
		}).then(req => {
			if (req.data.response === "ok") {
				setResponseCashOut("ok")
			}
		})
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
					? <div>
						<div className="block left">
							<b>{factory.name} LVL: {factory.lvl}</b>
							<br/>
							<div>{getTypeName(factory.type)}</div>
						</div>
						<div className="block left">
							<div className="textField">
								<div className="textLeft">Доход:</div>
								<div className="textRight">{factory.profitMoney}$ +
									{
										factory.type === "gold" ? " " + factory.profitGold + " kg.G" : " " + factory.profitResources + " ед."
									}</div>
							</div>
							<div className="textField">
								<div className="textLeft">Зарплата:</div>
								<div className="textRight">{factory.salary * 100}%</div>
							</div>
						</div>
						<Resources res={dataUser}/>
						<div className="block">
							<p>Работать</p>
							{
								response === "err"
									? <p>{msg}</p>
									: <p>{msg}</p>
							}
							<div style={{display: "flex"}}>
								<button className="button green" onClick={work}>(-10 E)</button>
								<button className="button green" onClick={() => work(50)}>(-50 E)</button>
								<button className="button green" onClick={() => work(100)}>(-100 E)</button>
								<button className="button green" onClick={() => work(200)}>(-200 E)</button>
							</div>

						</div>
						{
							dataUser._id === factory.userId
								? <div className="block left">
									<b>Средств на счету: </b>
									<br/>
									<div className="textBig">{factory.moneyBank}$</div>
									<div className="textBig">{factory.goldBank}kg.G</div>
									<br/>
									{
										responseCashOut === "ok"
											? <p>Готово!</p>
											: null
									}
									<button className="button" onClick={() => cashOut("money")}>Обналичить $</button>
									<button className="button" onClick={() => cashOut("gold")}>Обналичить G</button>
								</div>
								: null
						}
						{
							dataUser._id === factory.userId && factory.type !== "gold"
								? <div className="block left">
									<b>Материалов на складе</b>
									<div className="textBig">
										{factory.resourcesBank} ед
									</div>
									{
										responseCashOut === "ok"
											? <p>Готово!</p>
											: null
									}
									<button className="button" onClick={() => cashOut("resources")}>Вывезти
										материалы</button>
								</div>
								: null
						}
					</div>
					: <h3>Loading...</h3>
			}
		</div>
	</div>
}

export default withRouter(Factory);