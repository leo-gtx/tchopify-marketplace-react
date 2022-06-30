import {v4 as uuidv4} from 'uuid';
import firebase from '../../firebase';
import { formattedReviews } from '../../utils/utils';


export function handleAddReview({dishId, userId, name, comment, avatarUrl, rating, isPurchased}, callback){
    const id = uuidv4()
    return firebase
    .firestore()
    .collection('reviews')
    .doc(id)
    .set({
            id,
            name,
            comment,
            isPurchased,
            avatarUrl,
            rating,
            dishId,
            userId,
            postedAt: Date.now(),
    })
    .then(()=>callback())
    .catch((err)=>console.error(err))
}

export function handleEditReview({reviewId, name, comment, avatarUrl, rating, isPurchased, dishId}, callback){
    return firebase
    .firestore()
    .collection('reviews')
    .doc(reviewId)
    .update({
            name,
            comment,
            isPurchased,
            avatarUrl,
            rating,
            dishId,
            editedAt: Date.now(),
    })
    .then(()=>callback())
    .catch((err)=>console.error(err))
}

export function handleGetReviews( dishId, callback){
    return firebase
    .firestore()
    .collection('reviews')
    .where('dishId', '==', dishId)
    .onSnapshot((documentSnapshots)=>{
          callback(formattedReviews(documentSnapshots.docs))  
    })
}