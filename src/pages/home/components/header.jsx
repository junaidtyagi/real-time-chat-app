import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
function Header({socket}) {
    const { user } = useSelector((state) => state.userReducer);
    const navigate = useNavigate();
    function getFullName() {
        let fname = user.firstName.at(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
        let lname = user.lastName.at(0).toUpperCase() + user.lastName.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }
    function getInitials() {
        const f = user?.firstName.toUpperCase()[0];
        const l = user?.lastName.toUpperCase()[0];
        return f + l;
    }
    function logout (){
        localStorage.removeItem('token');
        navigate('/login');
        socket.emit('user-offline',user._id);
    }
    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                Quick Chat
            </div>
            <div className="app-user-profile">
                {user?.profilePic && <img src={user?.profilePic} alt="profile pic" className="logged-user-profile-pic" onClick={() => navigate('/profile')} />}
                {!user?.profilePic && <div className="logged-user-profile-pic" onClick={() => navigate('/profile')}>{getInitials()}</div>}
                <div className="logged-user-name">{getFullName()}</div>
                <button className="logout-button" onClick={logout}>
                    <i className="fa fa-power-off"></i>
                </button>
            </div>
        </div>
    )
}

export default Header;