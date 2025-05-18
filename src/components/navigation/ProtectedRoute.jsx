import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
	const session = Cookies.get("session");
	if (!session) {
		return <Navigate to="/" replace />;
	} else {
		//call endpoint to check if session is valid
	}
	return children;
};

export default ProtectedRoute;