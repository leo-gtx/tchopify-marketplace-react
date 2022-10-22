import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import {formattedDishes} from '../../utils/utils';

export const ADD_DISH = 'ADD_DISH';
export const SET_DISHES  = 'SET_DISHES';
export const REMOVE_DISH = 'REMOVE_DISH';
export const UPDATE_DISH = 'UPDATE_DISH';
function addDish(dish){
    return {
        type: ADD_DISH,
        payload: {
            [dish.id]: dish
        }
    };
}

function updateDish(dish){
    return {
        type: UPDATE_DISH,
        payload: dish,
    };
}

export function setDishes(dishes){
    return {
        type: SET_DISHES,
        payload: dishes,
    };
}

function removeDish(dishId){
    return {
        type: REMOVE_DISH,
        payload: dishId,
    };
}

export function handleGetDish(dishId, callback){
    return firebase
    .firestore()
    .collection('dishes')
    .doc(dishId)
    .get()
    .then((documentSnapshot)=>{
        if(documentSnapshot.exists) callback(documentSnapshot.data())
    })
    .catch((err)=>console.error(err))
}

export function handleGetDishesByShop(shop, callback){
    return firebase
    .firestore()
    .collection('dishes')
    .where('owner', '==', shop)
    .where('isPublished', '==', true)
    .get()
    .then((documentSnapshot) =>{
        callback(formattedDishes(documentSnapshot.docs))
    })
    .catch((err)=>console.error(err))
}
