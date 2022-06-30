import { useContext } from "react";
import { ContextOnlineStatus } from '../contexts/OnlineStatusContext';

export const useOnlineStatus = ()=>{
    const store = useContext(ContextOnlineStatus);
    return store;
}