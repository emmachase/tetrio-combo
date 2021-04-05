import { FC } from "react"
import "./layout.scss"

export const TwoPane: FC = (props) => {
    return (
        <div className="two-pane">
            { props.children }
        </div>
    )
}