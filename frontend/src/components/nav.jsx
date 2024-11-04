import { Link } from "react-router-dom";

const nav = ({ userType, handleLogout }) => {
    return (<>
        <nav>
            <ul>
                <li>
                    <Link to="/blood-donation-management-system">Go to Home</Link>
                </li>
                {userType === 'bloodbank' ? (
                    <li>
                        <Link to="/blood-donation-management-system/blood-request">Request blood</Link>
                    </li>
                ) : (
                    <li>
                        <span style={{ color: 'gray', cursor: 'not-allowed' }}>Request blood</span>
                    </li>
                )}
                <li>
                    <Link to="/blood-donation-management-system/donar-registration">Donar Registration</Link>
                </li>
                <li>
                    <Link to="/blood-donation-management-system/bloodbank-registration">Blood Bank Registration</Link>
                </li>
                {userType ? (
                    <li>
                        <Link onClick={handleLogout}>Logout</Link>
                    </li>
                ) : (
                    <li>
                        <Link to="/blood-donation-management-system/login">Login</Link>
                    </li>
                )}

            </ul>
        </nav>
    </>);
}

export default nav;