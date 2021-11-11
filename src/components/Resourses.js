import React from "react";
import Icon from "@mdi/react";
import {mdiLightningBolt, mdiBarrel, mdiDiamondStone, mdiWall} from "@mdi/js";
import millify from "millify";

const Resources = (props) => {
	const Resource = (props) => {
		return <div style={{ width: "100px", display: "flex", flexDirection: "column", alignItems: "center"}}>
			<span style={{fontSize: "0.8em"}}>{props.name}: </span>
			<Icon style={{padding: "5px 0"}} path={props.icon} size={1.2}/>
			<span>{millify(props.value)} {props.unit}</span>
		</div>
	}

	const styles = {
		display: "flex",
		justifyContent: "space-around"
	}

	return <div className="block" style={styles}>
		<Resource name="Стимулят." icon={mdiLightningBolt} value={props.res.energyBank}/>
		<Resource name="Нефть" icon={mdiBarrel} value={props.res.oil} unit="барр."/>
		<Resource name="Руда" icon={mdiDiamondStone} value={props.res.ore} unit="кг"/>
		<Resource name="Строй.мат." icon={mdiWall} value={props.res.buildingMaterial} unit="кг"/>
	</div>
}

export default Resources;