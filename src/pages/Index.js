import React, {useEffect} from "react"
import {Link} from "react-router-dom";

function Index(props) {
	useEffect(() => {
		if (props.location.search === "?reload=true") {
			document.location.href = "/";
		}
	})

	return <div className="page">
		<div className="content">
			<h3>Political World</h3>
			<div>Перезапуск Political World</div>
			<br/>
			<Link className="button" to="/login">Вход</Link>
			<Link className="button" to="/reg">Регистрация</Link>
		</div>
	</div>
}

export default Index;