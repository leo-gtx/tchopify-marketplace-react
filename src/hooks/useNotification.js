import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, onMessageListener } from '../firebase';
import { handleSetRegistrationToken } from '../redux/actions/authedUser';

export default function useNotification(){
    const dispatch = useDispatch();
    const { authedUser } = useSelector((state)=>state);
    const { notifications } = authedUser;
    const [token, setToken] = useState();
    getToken((value)=>setToken(value));
    onMessageListener()
    .then((payload)=>{
        const {notification} = payload;
        const notify = new Notification(notification.title, { body: notification.body, image: notification.image, icon: '/favicon/android-chrome-192x192.png' })
    })
    .catch((err)=>console.error(err))

    useEffect(()=>{
        if(authedUser.isAuthenticated && token){
            dispatch(handleSetRegistrationToken(authedUser.id, token))
        }
    },[token, authedUser.token])
    
    return null
}