import firebase from 'react-native-firebase';
import {
    SET_USER,
    UPDATE_USER,
    RELOAD_USER,
    CLEAR_USER,
    UPDATE_PROFILE,
} from './actionTypes';

import store from '../store';

export default {
    setUser(user) {
        return {
            type: SET_USER,
            payload: user,
        };
    },
    clearUser() {
        return {
            type: CLEAR_USER,
        };
    },
    updateUser(profile) {
        const { user } = store.getState();
        return {
            type: UPDATE_USER,
            payload: user.user.updateProfile(profile),
        };
    },
    reloadUser() {
        const { user } = store.getState();
        return (dispatch) => {
            dispatch({ type: [RELOAD_USER, '_PENDING'].join('') });
            user.user.reload().then((s) => {
                dispatch({ type: [RELOAD_USER, '_FULFILLED'].join(''), payload: s });
            }).catch((e) => {
                firebase.auth().signOut();
                dispatch({ type: [RELOAD_USER, '_REJECTED'].join(''), payload: e });
            });
        };
    },
    // PROFILE
    updateProfile(data) {
        const { user } = store.getState();
        return {
            type: UPDATE_PROFILE,
            payload: user.doc.set(data, { merge: true }),
        };
    },
};
