import React from "react";

const Resources = (props) => {
	const Resource = (props) => {
		return <div>
			<span>{props.name}: </span>
			<span>{props.value}</span>
		</div>
	}

	return <div className="block">
		<Resource name="Стимуляторы" value={props.res.energyBank}/>
		<Resource name="Нефть" value={props.res.oil}/>
		<Resource name="Руда" value={props.res.ore}/>
		<Resource name="Строй.материалы" value={props.res.buildingMaterial}/>
	</div>
}

export default Resources;