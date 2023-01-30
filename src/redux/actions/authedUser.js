import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import { formattedAddress} from '../../utils/utils';
import { handleEraseData } from './shared';

export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const REMOVE_AUTHED_USER = 'REMOVE_AUTHED_USER';
export const UPDATE_AUTHED_USER = 'UPDATE_AUTHED_USER';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';

export function addAddress(address){
  return {
    type: ADD_ADDRESS,
    payload: address,
  }
}

export function deleteAddress(addressId){
  return {
    type: DELETE_ADDRESS,
    payload: addressId,
  }
}

function setAuthedUser(user){
    return{
        type: SET_AUTHED_USER,
        payload: user,
    }
}

function removeAuthedUser(){
  return{
    type: REMOVE_AUTHED_USER,
  }
}

export function updateAuthedUser(user){
  return {
    type: UPDATE_AUTHED_USER,
    payload: user
  }
}

export function handleGetAuthedUser(userId, callback){
    return (dispatch)=> firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then((doc)=>{
            if(doc.exists){
                const data = {
                    ...doc.data(),
                    isAuthenticated: true
                }
                dispatch(setAuthedUser(data))
                callback(data)
            }else{
                dispatch(setAuthedUser({ isAuthenticated: false}))
                callback({isAuthenticated: false})
            }

        })
        .catch((error)=>{
            console.error(error)
        })
    
}

  export function logout(){
    return (dispatch)=> firebase
    .auth()
    .signOut()
    .then(()=>{
      dispatch(removeAuthedUser())
      dispatch(handleEraseData())
    })
    .catch((err)=>console.error(err))
  };

  /*  export async function resetPassword(email){
   return firebase.auth().sendPasswordResetEmail(email);
  }; */
export function handleUpdateProfileCustomer({fullname, phoneNumber, image, userId, oldAvatar}, callback, onError){
  return (dispatch) =>{
  // If there is no image
  if(image==null){
    const data = {
      fullname,
      phoneNumber,
    }
   return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .update(data)
    .then(()=>{
        dispatch(updateAuthedUser(data))
        callback()
    })
    .catch((err)=>{
      console.error(err)
      onError(err)
    })
  }
  
  // If there is an image
  const filename = `${Date.now()}.jpeg`
  const uploadTask = firebase.storage()
  .ref(`images/avatars/${filename}`,{
    contentType: 'image/jpeg',
  })
  .put(image)
  return uploadTask
  .on("state_changed", (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    console.log(`Upload is ${progress} done`);
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      default:
        break;
    }
  },(e)=>{
     onError(e)
    switch (e.code) {
      case 'storage/unauthorize':
        console.error('Unauthorize')
        break;
      case 'storage/unknown':
        console.error(e.serverResponse)
        break;
      default:
        break;
    }
  }, () => {
    // Delete Old Image
    if(oldAvatar){
      // Create a reference to the file to delete
    const imageRef = firebase.storage().ref(`images/avatars/${oldAvatar}`);

    // Delete the file
    imageRef.delete().catch((error) => {
      console.error(error)
      onError(error)
    });
    }
    
    // Record new data
      uploadTask.snapshot.ref.getDownloadURL().then( downloadedURL => {
          const data = {
            fullname,
            phoneNumber,
            avatar: downloadedURL,
            filename
          }
         firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .update(data)
          .then(()=>{
              dispatch(updateAuthedUser(data))
              callback()
          })
          .catch((err)=>{
            console.error(err)
            onError(err)
          })
       })
     
     
  })   
  
  }
}

export function handleChangePassword({newPassword}, callback){
  return firebase
  .auth()
  .currentUser
  .updatePassword(newPassword)
  .then(()=>{
    callback()
  })
  .catch((err)=>console.log(err))
}


export function handleAddAddress({userId, receiver, phone, fullAddress, addressType }, callback, onError){
const id = uuidv4()
const data = {
  id,
  receiver,
  fullAddress,
  addressType,
  userId,
  phone
};
return (dispatch) =>  firebase
  .firestore()
  .collection('addresses')
  .doc(id)
  .set(data)
  .then(()=>{
    dispatch(addAddress(data))
    callback()
  })
  .catch((err)=>{
    onError(err)
    console.error(err)
  })
}

export function handleDeleteAddress(addressId){
  return (dispatch) =>  firebase
    .firestore()
    .collection('addresses')
    .doc(addressId)
    .delete()
    .then(()=>{
      dispatch(deleteAddress(addressId))
    })
    .catch((err)=>{
      console.error(err)
    })
  }

  export function handleGetAddress(userId){
    return (dispatch) => firebase
    .firestore()
    .collection('addresses')
    .where('userId', '==', userId)
    .get()
    .then((documentSnapshot)=>{
      if(!documentSnapshot.empty) dispatch(updateAuthedUser({addresses : formattedAddress(documentSnapshot.docs)}))
    })
  }

export function handleGetUser({id, phoneNumber, role}, callback){
  const data = {
    id,
    phoneNumber,
    role
  }
  return (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(id)
  .get()
  .then((documentSnapshot)=> {
    if(!documentSnapshot.exists){
      firebase
      .firestore()
      .collection('users')
      .doc(id)
      .set(data)
      .then(()=>{
        dispatch(setAuthedUser(data))
      })
    }else{
      dispatch(setAuthedUser(documentSnapshot.data()))
    }
    callback()
  })
}


export function handleSetRegistrationToken(userId, token){
  return (dispatch) => firebase
  .firestore()
  .collection('users')
  .doc(userId)
  .update({token})
  .then(()=>{
    dispatch(updateAuthedUser({token}))
  })
  .catch((err)=>console.error(err))
}