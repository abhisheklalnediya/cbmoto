import firebase from 'react-native-firebase';

import {
    SET_USER,
    UPDATE_USER,
    RELOAD_USER,
    CLEAR_USER,
    UPDATE_PROFILE,
} from '../actions/actionTypes';

const initialData = {
    pending: true,
};

function setUser(user) {
    const userJson = user.toJSON();
    const doc = firebase.firestore().collection('users').doc(userJson.phoneNumber);
    return {
        ...userJson,
        user,
        doc,
    };
}

export default (state = initialData, action) => {
    switch (action.type) {
    case SET_USER:
        return {
            ...state,
            ...setUser(action.payload),
            pending: false,
        };
    case CLEAR_USER:
        return {
            user: null,
            pending: false,
        };
    case `${UPDATE_USER}_PENDING`:
        return {
            ...state,
            pending: true,
        };
    case `${UPDATE_USER}_FULFILLED`:
        return {
            ...state,
            pending: false,
        };
    case `${RELOAD_USER}_REJECTED`:
        state.user.signOut();
        return initialData;
    case `${UPDATE_PROFILE}_PENDING`:
        return {
            ...state,
            pending: true,
        };
    case `${UPDATE_PROFILE}_FULFILLED`:
        return {
            ...state,
            pending: false,
        };
    default:
        return state;
    }
};
