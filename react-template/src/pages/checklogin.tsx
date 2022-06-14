import { AuthContext } from "../App";
import { useContext } from "react";

export default function CheckLogin() {
    const { state, dispatch } = useContext(AuthContext);
    return (
        <div>
            <h1>CheckLogin</h1>
            <p>ISLOGGEDIN:{state.isLoggedIn.toString()}</p>
            <div>
                {JSON.stringify(state.user)}
            </div>
        </div>
    );
}