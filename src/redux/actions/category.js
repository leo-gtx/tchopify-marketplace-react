import firebase from '../../firebase';
import { formattedCategories } from '../../utils/utils';

export const ADD_CATEGORY = 'ADD_CATEGORY';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const ADD_SUBCATEGORY = 'ADD_SUBCATEGORY';
export const SET_SUBCATEGORIES = 'SET_SUBCATEGORIES';
export const DELETE_SUBCATEGORY = 'DELETE_SUBCATEGORY';
export const EDIT_CATEGORY = 'EDIT_CATEGORY';
export const EDIT_SUBCATEGORY = 'EDIT_SUBCATEGORY';

export function setSubcategories(subcategories){
    return {
        type: SET_SUBCATEGORIES,
        payload: subcategories
    }
}

export function handleGetSubcategoriesByRestaurant(restaurantId, callback){
    return firebase
    .firestore()
    .collection('categories')
    .where('isGroup', '==', false)
    .where('owner', '==', restaurantId)
    .get()
    .then((documentSnapshot)=>{
        if(!documentSnapshot.empty) callback(formattedCategories(documentSnapshot.docs))
    })
    .catch((err)=>console.error(err))
}
