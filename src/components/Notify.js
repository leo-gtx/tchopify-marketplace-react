import { useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import useNotification from '../hooks/useNotification';

export default function Notify(){
    const { enqueueSnackbar } = useSnackbar();
    const { isToken, payload } = useNotification();
    useEffect(()=>{
        if(isToken) enqueueSnackbar(payload.title, {variant: 'default'});
    },[isToken, payload])
    
    return null;
}