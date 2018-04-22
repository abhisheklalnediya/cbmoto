import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, View, Text, TextInput, Image } from 'react-native';
import PhotoUpload from 'react-native-photo-upload';
import firebase from 'react-native-firebase';
import gravatar from 'gravatar-api';

import UserActions from '../actions/user';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultProfilePic: 'https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg',
            ...this.props.user,
        };
        this.ref = firebase.firestore().collection('users');
        this.updateProfile = this.updateProfile.bind(this);
    }
    componentDidMount() {
        this.doc = this.ref.doc(this.props.user.phoneNumber);
        const data = { lastLogin: new Date() };
        this.doc.set(data, { merge: true }).then(s => console.log(s)).catch((e) => {
            console.log(e);
        });
        this.unsubscribe = this.doc.onSnapshot((documentSnapshot) => {
            console.log('document Updated', documentSnapshot.data());
            this.setState({ ...documentSnapshot.data() });
        });
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    updateProfile() {
        this.props.dispatch(UserActions.updateProfile({
            profilePic: this.state.profilePic,
            displayName: this.state.displayName || this.state.phoneNumber,
        }));
    }
    render() {
        const avatar = gravatar.imageUrl({ email: [this.props.user.phoneNumber, '@', 'cbmoto.com'].join() });
        const { lastLogin, displayName } = this.state;
        console.log(this.state);
        return (
            <View style={{ backgroundColor: '#DDD', flex: 1 }}>
                <Text>{(lastLogin) ? lastLogin.getTime() : 'Unknown'}</Text>
                <PhotoUpload
                    onPhotoSelect={(avatar) => {
                        if (avatar) {
                            this.setState({ profilePic: `data:image/png;base64, ${avatar}` });
                        }
                    }}
                    containerStyle={{
                        width: 150,
                        height: 150,
                    }}
                >
                    <Image
                        style={{
                            paddingVertical: 30,
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                        }}
                        resizeMode="cover"
                        source={{
                            uri: this.state.profilePic || this.state.defaultProfilePic,
                        }}
                    />
                </PhotoUpload>
                <TextInput
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ displayName: value })}
                    placeholder={'Display Name'}
                    value={displayName}
                />
                <Button title='Update' color='green' onPress={this.updateProfile} />
            </View>
        );
    }
}
export default connect(store => ({ user: store.user }))(ProfilePage);

// const styles = StyleSheet.create({
//     activityIndicatorContainer:{
//         backgroundColor: "#fff",
//         alignItems: 'center',
//         justifyContent: 'center',
//         flex: 1,
//     },

//     row:{
//         borderBottomWidth: 1,
//         borderColor: "#ccc",
//         padding: 10
//     },

//     title:{
//         fontSize: 15,
//         fontWeight: "600"
//     },

//     description:{
//         marginTop: 5,
//         fontSize: 14,
//     }
// });