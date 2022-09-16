
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import {setCurrentRestaurant} from './app';
import { formattedRestaurants } from '../../utils/utils';

export const SET_RESTAURANT = 'SET_RESTAURANT';
export const REMOVE_RESTAURANT = 'REMOVE_RESTAURANT';
export const UPDATE_RESTAURANT = 'UPDATE_RESTAURANT';
export const SET_RESTAURANTS = 'SET_RESTAURANTS';
export const UPDATE_BUSINESS_HOURS = 'UPDATE_BUSINESS_HOURS';

function setRestaurant(restaurant){
    return{
        type: SET_RESTAURANT,
        payload: restaurant
    }
}

function updateRestaurant(restaurant){
  return {
    type: UPDATE_RESTAURANT,
    payload: restaurant
  }
}

export function setRestaurants(restaurants){
  return{
    type: SET_RESTAURANTS,
    payload: restaurants
  }
}

function removeRestaurant(restaurantId){
  return {
    type: REMOVE_RESTAURANT,
    payload: restaurantId
  }
}

function updateBusinessHours(restaurantId, businessHours){
  return {
      type: UPDATE_BUSINESS_HOURS,
      payload: {
          restaurantId,
          businessHours
      }
  }
}

export function handleGetRestaurants(owner){
  return (dispatch) => firebase
    .firestore()
    .collection('restaurants')
    .where('owner', '==', owner)
    .get()
    .then((documentSnapshot)=>{
       dispatch(setRestaurants(formattedRestaurants(documentSnapshot.docs)))
    })
    .catch((err)=>console.error(err))
}

export function handleGetStores({status}, callback){
  return firebase
  .firestore()
  .collection('restaurants')
  .where('status', '==', status)
  .get()
  .then((documentSnapshot)=>{
    callback(formattedRestaurants(documentSnapshot.docs))
  })
}

export function handleGetRestaurant(restaurantId, callback){
  return firebase
  .firestore()
  .collection('restaurants')
  .doc(restaurantId)
  .get()
  .then((documentSnapshot)=>{
    if(documentSnapshot.exists) callback(documentSnapshot.data())
  })
}
