import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, loggedUser } from "../apiCalls/users";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers, setAllChats } from "../redux/usersSlice";
import { getAllChats } from "../apiCalls/chats";

function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Track if the all users are fetched successfully
    const [isAllUsersFetched, setIsAllUsersFetched] = useState(false);
   

    async function getLoggedInuser() {
        let response = null;
        try {
            dispatch(showLoader());
            response = await loggedUser();
            dispatch(hideLoader());
            if (response.status === 'success') {
                dispatch(setUser(response.data));
                
            } else {
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoader());
            navigate('/login');
        }
    }

    async function getAllUsersFromDB() {
        let response = null;
        try {
            dispatch(showLoader());
            response = await getAllUsers();
            dispatch(hideLoader());
            if (response.status === 'success') {
                dispatch(setAllUsers(response.data));
                setIsAllUsersFetched(true);  // Set as fetched once successful
            } else {
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoader());
            navigate('/login');
        }
    }

    async function getStoredChats (){
        let response =null;
        try {
          dispatch(showLoader());
          response = await getAllChats();
          dispatch(hideLoader());
          if(response.status === 'success'){
            dispatch(setAllChats(response.data));
          }else{
            navigate('/login');
          }

        } catch (error) {
            navigate('login');
        }
    }
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getLoggedInuser();
            getAllUsersFromDB();
            getStoredChats();
        } else {
            navigate('/login');
        }
    }, []);

    // Conditionally render children only when both are successfully fetched
    if (!isAllUsersFetched) {
        return <div>Loading...</div>;
    }

    return <div>{children}</div>;
}

export default ProtectedRoute;
