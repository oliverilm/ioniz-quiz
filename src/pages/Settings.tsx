import React from "react"

interface RouteInfo { match: {params: {id: string} }}


const Settings: React.FC<RouteInfo> = ({match}) => {

    const { id } = match.params;


    return (
        <div>
            settings {id}
        </div>
    )
}

export default Settings;