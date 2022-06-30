import { ADD_CART, setCheckoutConstraint } from "../actions/app";

const checker = (store) => (next) => (action) => {
    if(action.type === ADD_CART){
        const {app} = store.getState()
            if(app.checkout.cart.find((item)=>item.shop !== action.payload.shop)){
                return next(setCheckoutConstraint(true))
            }
    }
    return next(action)
  }
  
  export default checker