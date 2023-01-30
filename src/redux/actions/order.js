import firebase from '../../firebase';
import { formattedOrders, RequestTimeout, uniqueId, formattedMessage, getInitial} from '../../utils/utils';
import { pay, sendMessage } from '../../utils/api';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

function addOrder(order){
    return {
        type: ADD_ORDER,
        payload: order
    }
}


function setOrders(orders){
    return {
        type: SET_ORDERS,
        payload: orders
    }
}

export function handlePlaceOrder({cart, subtotal, discount, billing, shipping, payment, from, mode, coupon, total, deliveryTime}, callback, onError){
    const id = `${getInitial(from.name)}${uniqueId()}`
        const data = {
            id,
            cart,
            subtotal,
            discount,
            shipping,
            payment,
            mode,
            from,
            billing,
            total,
            deliveryTime,
            orderAt: Date.now(),
            status: 'new',
            paymentStatus: 'unpaid',
        };
        return (dispatch) => firebase
        .firestore()
        .collection('orders')
        .doc(id)
        .set(data)
        .then(()=>{
            if(coupon){
               firebase
                .firestore()
                .collection('coupons')
                .doc(coupon.id)
                .update({remainUse: coupon.remainUse -1, blacklisted:[...coupon.blacklisted, billing.userId]}) 
                .then(()=>{
                    dispatch(addOrder(data))
                    callback(id)
                })
            }else{
                dispatch(addOrder(data))
                callback(id)
            }
            
            
        })
        .catch((err)=>{
            onError(err)
        })
}

export function handlePlaceOrderOnly({language, cart, subtotal, discount, billing, shipping, payment, from, mode, total, deliveryTime}, callback, onError){
    const id = `${getInitial(from.name)}${uniqueId()}`
        const data = {
            id,
            cart,
            subtotal,
            discount,
            shipping,
            payment,
            mode,
            from,
            billing,
            total,
            deliveryTime,
            orderAt: Date.now(),
            status: 'new',
            paymentStatus: 'unpaid',
        };
        return (dispatch) => firebase
        .firestore()
        .collection('orders')
        .doc(id)
        .set(data)
        .then(()=>{
                dispatch(addOrder(data))
                callback(id)
                const parameters = {
                    name: billing.receiver,
                    phone: billing.phone,
                    description: formattedMessage(cart),
                    orderId: id
                }
                sendMessage(from.phoneNumber, parameters, language)
        })
        .catch((err)=>{
            onError(err)
        })
}

export function handlePayOrder({orderId, total, wallet, service}, callback, onError){
    return (dispatch) => RequestTimeout(1000*60*5, pay({amount: total, wallet, currency: 'xaf', service})
    .then((res)=>{
        const data = {
            paymentStatus: 'paid',
            paymentFeedback: res.data
        };
        firebase
        .firestore()
        .collection('orders')
        .doc(orderId)
        .update(data)
        .then(()=>{
                dispatch(addOrder(data))
                callback()
        })
        .catch((err)=>{
            onError(err)
        })
    })
    .catch((err)=>{
        onError(err)
    }))
    
}

export function handlePayAndPlaceOrder({cart, subtotal, discount, billing, shipping, payment, from, total, wallet, service, deliveryTime, coupon, mode}, callback, onError){
    return (dispatch) => RequestTimeout(1000*60*5, pay({amount: total, wallet, currency: 'xaf', service})
    .then((res)=>{
        const id = uniqueId()
        const data = {
            id,
            cart,
            subtotal,
            discount,
            shipping,
            payment,
            mode,
            from,
            billing,
            total,
            deliveryTime,
            orderAt: Date.now(),
            status: 'new',
            paymentStatus: 'paid',
            paymentFeedback: res.data
        };
        firebase
        .firestore()
        .collection('orders')
        .doc(id)
        .set(data)
        .then(()=>{
            if(coupon){
               firebase
                .firestore()
                .collection('coupons')
                .doc(coupon.id)
                .update({remainUse: coupon.remainUse -1, blacklisted:[...coupon.blacklisted, billing.userId]}) 
                .then(()=>{
                    dispatch(addOrder(data))
                    callback()
                })
            }else{
                dispatch(addOrder(data))
                callback()
            }
            
            
        })
        .catch((err)=>{
            onError(err)
        })
    })
    .catch((err)=>{
        onError(err)
    }))
    .catch((err)=>onError(err))

    
}

/* export function handlePayAndMarkAsDelivered({total, wallet, service, orderId, owner}, callback, onError){
    return (dispatch) => pay({amount: total, wallet, currency: 'xaf', service})
    .then((res)=>{
        const data = {
            id: orderId,
            status: 'completed',
            paymentStatus: 'paid',
            paymentFeedback: res.data
        };
        firebase
        .firestore()
        .collection('orders')
        .doc(orderId)
        .update(data)
        .then(()=>{
            firebase
            .firestore()
            .collection('users')
            .doc(owner)
            .get()
            .then((snapDoc)=>{
                if(snapDoc.exists){
                    firebase
                    .firestore()
                    .collection('users')
                    .doc(owner)
                    .update({balance: snapDoc.data().balance + total})
                }
                dispatch(addOrder(data))
                callback()
            })
        })
        .catch((err)=>{
            onError(err)
        })
    })
    .catch((err)=>{
        onError(err)
    })

    
} */

export function handleMarkAsDelivered({total, orderId, owner}, callback, onError){
    return firebase
        .firestore()
        .collection('orders')
        .doc(orderId)
        .update({status: 'completed', completedDate: Date.now()})
        .then(()=>{
            firebase
            .firestore()
            .collection('users')
            .doc(owner)
            .get()
            .then((snapDoc)=>{
                if(snapDoc.exists){
                    firebase
                    .firestore()
                    .collection('users')
                    .doc(owner)
                    .update({balance: snapDoc.data().balance + total})
                }
                callback()
            })
        })
        .catch((err)=>{
            onError(err)
        })
}

export function handleRateOrder({orderId, rating}, onSuccess, onError){
    return firebase
    .firestore()
    .collection('orders')
    .doc(orderId)
    .update({rating})
    .then(onSuccess)
    .catch(onError)
}

export function handleGetOrders(userId){
    return (dispatch) => firebase
    .firestore()
    .collection('orders')
    .where('billing.userId', '==', userId)
    .onSnapshot((documentSnapshot)=>{
        dispatch(setOrders(formattedOrders(documentSnapshot.docs)))
    })
}



export function GetOrder(orderId,callback){
    return firebase
    .firestore()
    .collection('orders')
    .doc(orderId)
    .onSnapshot((documentSnapshot)=>{
        callback(documentSnapshot.data())
    })
}

export function getCoupon({code, uid}, onSuccess, onError){
    return firebase
    .firestore()
    .collection('coupons')
    .where('code', '==', code)
    .where('isExpired', '==', false)
    .where('remainUse', '>', 0)
    .get()
    .then((snapDoc)=>{
        
        if(!snapDoc.empty){
            const coupon = snapDoc.docs[0].data()
            if(coupon.blacklisted.includes(uid)){
                onError()
            }else{
                onSuccess(coupon)
            }
            
        }else{
            onError()
        }

    })
    .catch((err)=>{
        console.error(err)
        onError()
    })
}