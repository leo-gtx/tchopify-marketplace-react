import {groupBy, sumBy} from 'lodash';

export function formattedCategories(arrayCategories){
    let categories = {}
    arrayCategories.forEach((item)=>{
        categories = {
            ...categories,
            [item.id]: item.data()
        }
    })
    return categories
}

export function formattedDishes(arrayDishes){
    let dishes = {}
    arrayDishes.forEach((item)=>{
        dishes = {
            ...dishes,
            [item.id]: item.data()
        }
    })
    return dishes
}

export function formattedReviews(arrayReviews){
    let reviews = {}
    arrayReviews.forEach((item)=>{
        reviews = {
            ...reviews,
            [item.id]: item.data()
        }
    })
    return reviews
}


export function formattedOrders(arrayOrders){
    let orders = {}
    arrayOrders.forEach((item)=>{
        orders = {
            ...orders,
            [item.id]: item.data()
        }
    })
    return orders
}

export function formattedAddress(arrayAddress){
    let address = {}
    arrayAddress.forEach((item)=>{
        address = {
            ...address,
            [item.id]: item.data()
        }
    })
    return address
}

export function formattedStaffs(arrayStaffs){
    let staffs = {}
    arrayStaffs.forEach((item)=>{
        staffs = {
            ...staffs,
            [item.id]: item.data()
        }
    })
    return staffs
}

export function formattedRestaurants(arrayRestaurants){
    let restaurants = {}
    arrayRestaurants.forEach((item)=>{
        restaurants = {
            ...restaurants,
            [item.id]: item.data()
        }
    })
    return restaurants
}

export function formattedNotifications(arrayNotifications){
    let notifications = {}
    arrayNotifications.forEach((item)=>{
        notifications = {
            ...notifications,
            [item.id]: item.data()
        }
    })
    return notifications
}

export function jsUcfirst(string) 
{
    let formattedString = ''
    const splittedString = string.split(' ')
    splittedString.forEach((seg)=>{
        formattedString= `${formattedString} ${seg.charAt(0).toUpperCase() + seg.slice(1)}`
    })
    return formattedString
}

export function getDay(index){
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satursday']
    return days[index]
}

export function toTimeString(date){
    const dateString = date.toLocaleString()
    const timeString = dateString.split(',')[1].trim()
    return timeString
}

export function convertToKm(value){
    return `${Math.ceil(value/1000)} km`
}

export function shippingCost(value, kmCost){
    const distance = Math.ceil(value/1000)
    if(distance * kmCost < 500){
        return 500
    }
    if(distance * kmCost > 2000 ){
        return 2000
    }
    return kmCost * distance
}

export function getOptionsPrice(value){
    let total = 0;
    value.forEach((item)=>{
        total += Number(item.split('-')[1].trim().split(' ')[0])
    })
    return total
}

export function formattedRatings(values){
    const names = ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'];
    const reviewsGrouped = groupBy(values, (value)=> value.rating);
    const ratings = [];
    names.forEach((item, index)=>{
        ratings[index] = {
            name: item,
            reviewCount: reviewsGrouped[index + 1]?.length,
            starCount: sumBy(reviewsGrouped[index + 1],(review)=>review?.rating)
        }
    })

    return ratings;
}

export function isPurchased(orders, productId){
    let found = false;
    orders.forEach((item)=>{
        if (item.cart.findIndex((product)=> product.id === productId) !== -1){
            found = true
        }
    })
    return found
}

export function isStoreOpen(schedules){
    let currentDay = new Date().getDay()
    currentDay = schedules[currentDay]
    if (currentDay.isOpen){
        const now = new Date()
        const endTime = new Date(`${now.toDateString()} ${currentDay.endTime}`)
        const startTime = new Date(`${now.toDateString()} ${currentDay.startTime}`)
        if(now >= startTime && now < endTime){
            return true
        }
        return false
    }
    return false
}

export function getNextOpenDay(schedules){
    const options = { weekday: 'long'};
    let currentDay = new Date().getDay();
    const now = new Date()
    for (let index = 0; index <= 6; index+=1) {
        if(currentDay >= 6) currentDay = 0 
        else currentDay+=1;
        if(schedules[currentDay].isOpen){
            now.setDate(currentDay)
            return {
                t: 'common.openAt',
                day: new Date(`${now.toDateString()} ${schedules[currentDay].startTime}`).toLocaleTimeString(localStorage.getItem('i18nextLng'), options)
            }
        }
        
    }
    return {t: 'common.closedAlways'}
}

export const ROLES = {
    superAdmin: { label: 'ADMIN', value: 'ROLE_SUPER_ADMIN'},
    owner: { label: 'OWNER', value:'ROLE_OWNER'},
    admin: { label: 'ADMIN', value: 'ROLE_ADMIN'},
    chef: { label: 'CHEF', value: 'ROLE_CHEF'},
    waitress: { label: 'WAITRESS', value: 'ROLE_WAITRESS'},
    deliveryMan: { label: 'DELIVERY MAN', value: 'ROLE_DELIVERY_MAN'},
}

export function getRoleFromUser(user){
    return user.role.split('_')[1]
}

export function generateOTP() {
          
    // Declare a digits variable 
    // which stores all digits
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i+=1 ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export function getOwnerId(user){
    if(user.role === ROLES.owner.value){
        return user.id
    }
    return user.owner
}

export function isStaff(user){
    if(user.role !== ROLES.owner.value){
        return true
    }
    return false
}

export function isOwner(user){
    if(user.role === ROLES.owner.value){
        return true
    }
    return false
}

export function isAdmin(user){
    if(user.role === ROLES.admin.value){
        return true
    }
    return false
}

export function isChef(user){
    if(user.role === ROLES.chef.value){
        return true
    }
    return false
}

export function isWaitress(user){
    if(user.role === ROLES.waitress.value){
        return true
    }
    return false
}

export function RequestTimeout(ms, promise){
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            // eslint-disable-next-line
          reject({message: "Bad Network"})
          alert("Bad Network");
        }, ms);
        promise.then(
          (res) => {
            clearTimeout(timeoutId);
            resolve(res);
          },
          (err) => {
            clearTimeout(timeoutId);
            reject(err);
          }
        );
      })
}

export function uniqueId(){
    let dateString = Date.now().toString();
    dateString = dateString.substr(dateString.length - 3, 2);
    const randomness = Math.floor(Math.random() * 10000).toString().substr(0, 4);
    return dateString + randomness;
};