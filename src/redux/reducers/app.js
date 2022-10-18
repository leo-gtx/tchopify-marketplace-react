import { sum, filter, map, uniqBy, isEqual, uniqWith } from 'lodash';
import {
    SET_CURRENT_RESTAURANT,
    SET_SORT_STORE,
    SET_FILTERS_DISH,
    SET_SORT_DISH,
    GOTO_STEP,
    ADD_CART,
    GET_CART,
    CREATE_BILLING,
    NEXT_STEP,
    BACK_STEP,
    DELETE_CART,
    APPLY_DISCOUNT,
    DECREASE_QUANTITY,
    INCREASE_QUANTITY,
    RESET_CART,
    APPLY_SHIPPING,
    SET_SHOP_CHECKOUT,
    SET_CHECKOUT_CONSTRAINT,
    SET_DELIVERY_COST,
    SET_DELIVERY_TIME,
    SET_DELIVERY_LOCATION,
    TOGGLE_DISH_MODAL,
    SET_ORDER_ID
} from '../actions/app';

const initialState = {
    sortByDish: '',
    sortByStore: '',
    isCheckoutViolation: false,
    deliveryLocation: '',
    isDishModalOpen: false,
    filtersDishes: {
        category: 'All',
        rating: '',
        priceRange: ''
    },
    checkout: {
        orderId: '',
        from: '',
        cart: [],
        step: 0,
        billing: null,
        shipping: 0,
        deliveryCost: 0,
        deliveryTime: 0, 
        discount: 0,
        subtotal: 0,
        total: 0,
    },
}

export default function app(state = initialState, action){
    switch (action.type) {
        case TOGGLE_DISH_MODAL:
            return {
                ...state,
                isDishModalOpen: action.payload
            }
        case SET_CURRENT_RESTAURANT:
            return {
                ...state,
                currentRestaurant: action.payload
            }
        case SET_DELIVERY_LOCATION:
            return {
                ...state,
                deliveryLocation: action.payload
            }
        case SET_SORT_STORE:
            return {
                ...state,
                sortByStore: action.payload,
            }
        case SET_SORT_DISH:
            return {
                ...state,
                sortByDish: action.payload,
            }
        case SET_FILTERS_DISH:
            return {
                ...state,
                filtersDishes: action.payload,
            }
        case SET_CHECKOUT_CONSTRAINT: 
            return {
                ...state,
                isCheckoutViolation: action.payload
            }
        case SET_SHOP_CHECKOUT:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    from: action.payload
                }
            }
        case SET_DELIVERY_COST:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    deliveryCost: action.payload,
                }
            }
        case SET_DELIVERY_TIME:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    deliveryTime: action.payload
                }
            }
        case ADD_CART: {
            const product = action.payload;
            const isEmptyCart = state.checkout.cart.length === 0;

            if (isEmptyCart) {
                return {
                    ...state,
                    checkout: {
                        ...state.checkout,
                        cart: uniqBy([product, product], 'id'),
                    }
                }
            }
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: uniqWith([...map(state.checkout.cart, (_product) => {
                        const isExisted = (_product.id === product.id) && isEqual(_product.options, product.options)
                        if (isExisted) {
                            return {
                            ..._product,
                            subtotal: _product.price * (_product.quantity + 1),
                            quantity: _product.quantity + 1
                            };
                        }
                        return _product;
                        }), product], (a,b)=> a.id === b.id && isEqual(a.options, b.options) ),
                }
            }
                
            
        }
            
        case DELETE_CART: 
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: filter(state.checkout.cart, (item) => item.id !== action.payload.id || (item.id === action.payload.id && !isEqual(item.options,  action.payload.options))),
                }
            }
        case GOTO_STEP:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    step: action.payload,
                }
            }
        case BACK_STEP:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    step: state.checkout.step - 1
                }
            }
        case NEXT_STEP:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    step: state.checkout.step + 1
                }
            }
        case GET_CART: {
            const cart = action.payload;
            const subtotal = sum(cart.map((product) => product.price * product.quantity));
            const discount = cart.length === 0 ? 0 : state.checkout.discount;
            const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
            const billing = cart.length === 0 ? null : state.checkout.billing;
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart,
                    discount,
                    shipping,
                    billing,
                    subtotal,
                    total: subtotal - discount,
                }
            }
        }
        case CREATE_BILLING:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    billing: action.payload
                }
            }
        case APPLY_DISCOUNT: {
            const total = state.checkout.total - action.payload;
             return {
                ...state,
                checkout: {
                    ...state.checkout,
                    discount: action.payload,
                    total: total < 0 ? 0 : total
                }
            }
        }
           
        case DECREASE_QUANTITY: {
            const {id, options} = action.payload;
            const updateCart = map(state.checkout.cart, (product) => {
                if (product.id === id && isEqual(product.options, options)) {
                return {
                    ...product,
                    subtotal: product.price * (product.quantity - 1),
                    quantity: product.quantity - 1
                };
                }
                return product;
            });
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: updateCart
                }
            }
        }
        case INCREASE_QUANTITY: {
            const {id, options} = action.payload;
            const updateCart = map(state.checkout.cart, (product) => {
                if (product.id === id && isEqual(product.options, options)) {
                return {
                    ...product,
                    subtotal: product.price * (product.quantity + 1),
                    quantity: product.quantity + 1
                };
                }
                return product;
            });
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    cart: updateCart
                }
            }
        }
        case RESET_CART:
            return {
                ...state,
                checkout:{
                    orderId: '',
                    cart: [],
                    step: 0,
                    billing: null,
                    shipping: 0,
                    discount: 0,
                    subtotal: 0,
                    total: 0,
                }
            }
        case APPLY_SHIPPING:{
            const total = state.checkout.subtotal - state.checkout.discount + action.payload;
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    shipping: action.payload,
                    total:  total <0 ? 0 : total
                }
            }
        }
        case SET_ORDER_ID:
            return {
                ...state,
                checkout: {
                    ...state.checkout,
                    orderId: action.payload
                }
            }
        default:
            return state;
    }
}