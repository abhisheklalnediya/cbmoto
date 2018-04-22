import React, { Component } from 'react';
import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

import UserActions from '../actions/user';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '+919061120210',
            // phoneNumber: "+918139037169",
            codeSent: false,
            message: '',
            displayName: '',
        };
        this.signIn = this.signIn.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }
    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.dispatch(UserActions.setUser(user));
                this.props.dispatch(UserActions.reloadUser());
                this.props.dispatch(UserActions.updateProfile({
                    lastLogin: new Date(),
                }));
                this.setState({
                    displayName: user.displayName,
                });
                this.props.navigation.push('Profile');
            } else {
                this.props.dispatch(UserActions.clearUser());
            }
        });
    }
    confirmCode() {
        const { codeInput, confirmResult } = this.state;
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    console.log(user)
                    this.setState({ message: 'Code Confirmed!' });
                })
                .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
        }
    }
    signIn() {
        const { phoneNumber } = this.state;
        this.setState({ message: 'Sending code ...' });
        firebase.auth().signInWithPhoneNumber(phoneNumber).then((confirmResult) => {
            this.setState({ confirmResult, codeSent: true, message: 'Code has been sent!' }, () => {
                setTimeout(() => {
                    this.setState({ codeSent: false, message: 'Resend code?' });
                }, 3000);
            });
        }).catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
    }
    updateProfile() {
        this.props.dispatch(UserActions.updateUser({
            displayName: this.state.displayName,
        }));
    }
    renderVerificationCodeInput() {
        const { codeInput, codeSent } = this.state;
        return (
            <View style={{ marginTop: 25, padding: 25 }}>
                <Text>Enter verification code below:</Text>
                <TextInput
                    autoFocus
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ codeInput: value })}
                    placeholder="Code..."
                    value={codeInput}
                />
                <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
                {!codeSent && <Button title="Resend" disabled={codeSent} color="green" onPress={this.signIn} />}
            </View>
        );
    }
    renderPhoneNumberInput() {
        const { phoneNumber, codeSent } = this.state;
        return (
            <View style={{ padding: 25 }}>
                <Text>Enter phone number:</Text>
                <TextInput
                    autoFocus
                    style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                    onChangeText={value => this.setState({ phoneNumber: value })}
                    placeholder="Phone number"
                    value={phoneNumber}
                />
                <Button title='Sign In' disabled={codeSent} color='green' onPress={this.signIn} />
            </View>
        );
    }
    renderMessage() {
        const { message } = this.state;
        if (!message.length) return null;
        return (
            <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
        );
    }
    render() {
        const { confirmResult } = this.state;
        const { user } = this.props.user;
        if (this.props.user.pending) {
            return (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                {!user && !confirmResult && this.renderPhoneNumberInput()}
                {this.renderMessage()}
                {!user && confirmResult && this.renderVerificationCodeInput()}
            </View>
        );
    }
}

export default connect(state => ({ user: state.user }))(Home);

const styles = StyleSheet.create({
    activityIndicatorContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    row: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
    },
    description: {
        marginTop: 5,
        fontSize: 14,
    },
});
