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

export function sendMessage(recipient, parameters, lang){
    const WHATSAPP_TOKEN = 'EAAHzShgUGNsBAOWIOXThSXaZCXxr3d8zHG8MdwDyP8YoDf0LIUvnJ9bGx72ISvRR5Qvb0SCBM4FLbZA0UrCRjBixCzGTBk4TMe7Ncpbr8ykZCzjElrY4BNb1OeTT1XiXtDCBovpIeRXHUbahHUhtHZBfcMBQ3FCoBZCdEsgKQmabTgCdMWR8ORXZBtRNsdOCZCrKfpZBXZAeogwZDZD';
    const { name, phone, description, orderId } = parameters;
    return axios({
        url: `https://graph.facebook.com/v15.0/113095531677116/messages`,
        method: 'post',
        headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
        },
        data: {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipient,
            type:  'template',
            template : {
                name: 'new_order_details',
                language: {
                    code: lang
                },
                components: [
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: name || ','
                            },
                            {
                                type: 'text',
                                text: phone
                            },
                            {
                                type: 'text',
                                text: description
                            }
                        ]
                    },
                    {
                        type: 'button',
                        sub_type: 'url',
                        index: '0',
                        parameters: [
                            {
                                type: 'payload',
                                payload: `https://restaurant.tchopify.com/dashboard/order/delivery-orders?orderId=${orderId}`
                            }
                        ]
                    }
                ]
            }
        },
        
    });
}