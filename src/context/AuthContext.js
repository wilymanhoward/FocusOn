import React, { createContext, useState } from 'react'; 
import { saveCookie, getCookie } from '../api';

export const AuthContext = createContext(); 

const USERDATA_KEY = 'my_userdata'

export default function AuthContextProvider(props) {

    const [userData, setUserData] = useState(getCookie(USERDATA_KEY))

    const updateUserData = (new_userData) => { 
        setUserData(new_userData); 
        saveCookie(USERDATA_KEY, new_userData)
    }

    return ( 
        <AuthContext.Provider value = { 
            {
                userData, // userData: userData
                updateUserData // updateUserData: updateUserData
            }
        }> 
            {props.children} 
        </AuthContext.Provider> 
    ) 
}