import {
    SET_AUTHED_USER,
    REMOVE_AUTHED_USER,
    UPDATE_AUTHED_USER,
    ADD_ADDRESS,
    DELETE_ADDRESS,
} from '../actions/authedUser';

import {
    ADD_ORDER,
    SET_ORDERS
} from '../actions/order';

const initialState = {
    isAuthenticated: false,
    addresses: {},
    orders: {},
    balance: 0,
    rewards: 0,
}
export default function authedUser(state = initialState, action){
    switch (action.type) {
        case SET_AUTHED_USER:
            return {
                ...state, 
                ...action.payload
            };
        case REMOVE_AUTHED_USER:
            return initialState;
        case UPDATE_AUTHED_USER:
            return {
                ...state,
                ...action.payload
            };
        case ADD_ADDRESS:
            return {
                ...state,
                addresses: {
                    ...state.address,
                    [action.payload.id]: action.payload
                }
            };
        case DELETE_ADDRESS:
            delete state.addresses[action.payload]
            return {
                ...state,
                addresses: {
                    ...state.addresses
                }
            };
        case ADD_ORDER: 
        return {
            ...state,
            orders: {
                ...state.orders,
                [action.payload.id]: { 
                    ...state.orders[action.payload.id],
                    ...action.payload 
                } 
            }
        }
        case SET_ORDERS:
            return {
                ...state,
                orders: action.payload
            }
        default:
            return state;
    }
}