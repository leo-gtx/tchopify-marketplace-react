import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../firebase';
import { handleGetAuthedUser, updateAuthedUser } from '../redux/actions/authedUser';

function useAuth(){
// Set an initializing state whilst Firebase connects
const [initializing, setInitializing] = useState(true);
const [user, setUser] = useState();
const dispatch = useDispatch();
const authedUser = useSelector((state)=>state.authedUser)

// Handle user state changes
const onAuthStateChanged = useCallback((currentUser)=>{
    if (currentUser){
        if(!authedUser.isAuthenticated) {
          dispatch(handleGetAuthedUser(currentUser.uid, (user)=>{
            setUser(user);
          }))
          
        }
         else if(currentUser.emailVerified && !authedUser.emailVerified) dispatch(updateAuthedUser({emailVerified: currentUser.emailVerified}))
      }else{
        setUser({isAuthenticated: false})
      }
      if (initializing) setInitializing(false);
},[dispatch, authedUser, initializing])


  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    
  }, [onAuthStateChanged, authedUser.isAuthenticated]);



return {
    ...user,
    initializing,
    method: 'firebase'
}
}




export default useAuth