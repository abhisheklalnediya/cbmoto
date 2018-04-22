import firebase from 'react-native-firebase';

import {
    SET_USER,
    UPDATE_USER,
    RELOAD_USER,
    CLEAR_USER
} from '../actions/actionTypes';

const initialData = {
    pending: true,
}

function setUser(user) {
    const userJson = user.toJSON()
    const doc = firebase.firestore().collection('users').doc(userJson.phoneNumber);
    return {
        ...userJson,
        user: user,
        doc
    }
}

export default userReducer = (state = initialData, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                ...setUser(action.payload),
                pending: false
            }
        case CLEAR_USER:
            return {
                user: null,
                pending: false
            }
        case [UPDATE_USER, '_PENDING'].join(''):
            return {
                ...state,
                pending: true,
            }
        case [UPDATE_USER, '_FULFILLED'].join(''):
            return {
                ...state,
                pending: false,
            }
        case [RELOAD_USER, '_REJECTED'].join(''):
            return initialData
        default :
           return state;
    }
}
