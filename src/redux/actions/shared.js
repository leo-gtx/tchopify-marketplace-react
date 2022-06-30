import { resetCart } from './app';

export function handleEraseData(){
    return (dispatch)=>Promise.all([
        dispatch(resetCart()),
    ])
}