import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, View, StyleSheet, Text, TextInput, Image } from 'react-native';
import PhotoUpload from 'react-native-photo-upload';

import UserActions from '../actions/user';

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultProfilePic: 'data:image/png;base64, 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',
            ...this.props.user,
        };
        this.updateProfile = this.updateProfile.bind(this);
    }
    componentDidMount() {
        this.unsubscribe = this.props.user.doc.onSnapshot((documentSnapshot) => {
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
        const { displayName } = this.state;
        const { user } = this.props;
        console.log(this.state);
        return (
            <View style={styles.container}>
                <View style={{height: 150, width: 150}}>
                    <PhotoUpload
                        onPhotoSelect={(avatar) => {
                            if (avatar) {
                                this.setState({ profilePic: `data:image/png;base64, ${avatar}` });
                            }
                        }}
                        containerStyle={{
                            flex: 1,
                            backgroundColor: '#FFF',
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
                </View>
                <View style={styles.form}>
                    <Text style={{ textAlign: 'center' }}>Choose a display name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={value => this.setState({ displayName: value })}
                        placeholder={'Display Name'}
                        value={displayName}
                    />
                    <Button disabled={user.pending} title='Update' color='green' onPress={this.updateProfile} />
                </View>
            </View>
        );
    }
}
export default connect(store => ({ user: store.user }))(ProfilePage);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: '80%',
        maxWidth: 300,
        marginTop: 20,
    },
    input: {
        height: 50,
        marginTop: 0,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'monospace',
    },

});
