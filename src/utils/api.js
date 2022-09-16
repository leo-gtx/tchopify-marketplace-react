import axios from 'axios';


// Payment API

export function pay({amount, wallet, currency, service}){
    return new Promise((resolve, reject)=>{
        const headers = {
            "x-api-key": process.env.REACT_APP_SOPAY_API_KEY,
            "operation": "2",
            "service": service,
            "Content-Type": "application/json"
        };
        axios.post(`${process.env.REACT_APP_SOPAY_API_BASE_URL}/api/agent/bills`,
        {wallet, amount, currency, description: 'Payment On Tchopify'},
        {headers})
        .then((res)=>{
            if (res.data.success){
                resolve(res.data)
            }else{
                reject(res.data)
            }
        })
        .catch((err)=>console.error(err))
    })
    
}

export function withdraw({amount, wallet, service}){
    return axios.post(`${process.env.REACT_APP_SOPAY_API_BASE_URL}/api/user/login_check`,{
        email: process.env.REACT_APP_SOPAY_EMAIL,
        password: process.env.REACT_APP_SOPAY_PASSWORD
    })
    .then((res)=> new Promise((resolve, reject)=>{
        const headers = {
            "x-api-key": process.env.REACT_APP_SOPAY_API_KEY,
            "operation": "4",
            "service": service,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${res.data.token}`
        };
        axios.post(`${process.env.REACT_APP_SOPAY_API_BASE_URL}/api/user/proceeds`,
        {wallet, amount, description: 'Withdraw From Tchopify'},
        {headers})
        .then((res)=>{
            if (res.data.success){
                resolve(res.data)
            }else{
                reject(res.data)
            }
        })
        .catch((err)=>console.error(err))
    }))
    
}