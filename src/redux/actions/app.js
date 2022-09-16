export const SET_CURRENT_RESTAURANT = 'SET_CURRENT_RESTAURANT';
export const SET_SORT_STORE = 'SET_SORT_STORE';
export const SET_SORT_DISH = 'SET_SORT_DISH';
export const SET_FILTERS_DISH = 'SET_FILTERS_DISH';
export const ADD_CART = 'ADD_CART';
export const GOTO_STEP = 'GOTO_STEP';
export const GET_CART = 'GET_CART';
export const CREATE_BILLING = 'CREATE_BILLING';
export const BACK_STEP = 'BACK_STEP';
export const NEXT_STEP = 'NEXT_STEP';
export const DELETE_CART = 'DELETE_CART';
export const APPLY_DISCOUNT =  'APPLY_DISCOUNT';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const RESET_CART = 'RESET_CART';
export const APPLY_SHIPPING = 'APPLY_SHIPPING';
export const SET_SHOP_CHECKOUT = 'SET_SHOP_CHECKOUT';
export const SET_CHECKOUT_CONSTRAINT = 'SET_CHECKOUT_CONSTRAINT';
export const SET_DELIVERY_COST = 'SET_DELIVERY_COST';
export const SET_DELIVERY_TIME = 'SET_DELIVERY_TIME';
export const SET_DELIVERY_LOCATION = 'SET_DELIVERY_LOCATION';
export const TOGGLE_DISH_MODAL = 'TOGGLE_DISH_MODAL';
export const SET_ORDER_ID = 'SET_ORDER_ID';

export function setOrderId(value){
    return {
        type: SET_ORDER_ID,
        payload: value
    }
}

export function toggleDishModal(value){
    return {
        type: TOGGLE_DISH_MODAL,
        payload: value
    }
}

export function setCheckoutConstraint(value){
    return {
        type: SET_CHECKOUT_CONSTRAINT,
        payload: value
    }
}

export function setShopCheckout(value){
    return {
        type: SET_SHOP_CHECKOUT,
        payload: value
    }
}

export function setCurrentRestaurant(restaurantId){
    return {
        type: SET_CURRENT_RESTAURANT,
        payload: restaurantId
    }
}
export function sortByStore(value){
    return {
        type: SET_SORT_STORE,
        payload: value
    }
}

export function setSortByDish(value){
    return { 
        type: SET_SORT_DISH,
        payload: value
    }
}

export function setFiltersDishes(value){
    return {
        type: SET_FILTERS_DISH,
        payload: value
    }
}

export function addCart(value){
    return {
        type: ADD_CART,     
        payload: value
    }
}

export function gotoStep(value){
    return {
        type: GOTO_STEP,
        payload: value
    }
}

export function getCart(cart){
    return {
        type: GET_CART,
        payload: cart
    }
}

export function createBilling(value){
    return {
        type: CREATE_BILLING,
        payload: value
    }
}

export function onNextStep(){
    return {
        type: NEXT_STEP,
    }
}

export function onBackStep(){
    return {
        type: BACK_STEP,
    }
}

export function deleteCart(id, options){
    return {
        type: DELETE_CART,
        payload: { id, options}
    }
}

export function applyDiscount(value){
    return {
        type: APPLY_DISCOUNT,
        payload: value
    }
}

export function decreaseQuantity(id, options){
    return {
        type: DECREASE_QUANTITY,
        payload: {id, options}
    }
}

export function increaseQuantity(id, options){
    return {
        type: INCREASE_QUANTITY,
        payload: {id, options}
    }
}

export function resetCart(){
    return {
        type: RESET_CART,
    }
}

export function applyShipping(value){
    return {
        type: APPLY_SHIPPING,
        payload: value
    }
}

export function setDeliveryCost(value){
    return {
        type: SET_DELIVERY_COST,
        payload: value
    }
}

export function setDeliveryTime(value){
    return {
        type: SET_DELIVERY_TIME ,
        payload: value
    }
}

export function handleSetShopAndCart(shop, product){
    return (dispatch) => {
        dispatch(setShopCheckout(shop))
        dispatch(addCart(product))
    }
}

export function setDeliveryLocation(value){
    return {
        type: SET_DELIVERY_LOCATION,
        payload: value
    }
}