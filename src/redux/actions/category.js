import {v4 as uuidv4} from 'uuid';
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

function addCategory(category){
    return {
        type: ADD_CATEGORY,
        payload: category
    }
}

function editCategory(category){
    return {
        type: EDIT_CATEGORY,
        payload: category
    }
}

function editSubcategory(subcategory){
    return {
        type: EDIT_SUBCATEGORY,
        payload: subcategory
    }
}

function setCategories(categories){
    return {
        type: SET_CATEGORIES,
        payload: categories
    }
}

function removeCategory(categoryId){
    return{
        type: DELETE_CATEGORY,
        payload: categoryId
    }
}
function addSubcategory(subcategory){
    return {
        type: ADD_SUBCATEGORY,
        payload: subcategory
    }
}
export function setSubcategories(subcategories){
    return {
        type: SET_SUBCATEGORIES,
        payload: subcategories
    }
}
function removeSubcategory(subcategoryId){
    return {
        type: DELETE_SUBCATEGORY,
        payload: subcategoryId
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
