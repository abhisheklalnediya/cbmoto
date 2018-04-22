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
            // phoneNumber: '+919061120210',
            phoneNumber: "+918139037169",
            // phoneNumber: "+91",
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
                console.log('here')
                this.props.dispatch(UserActions.setUser(user));
                this.props.dispatch(UserActions.reloadUser());
                this.props.dispatch(UserActions.updateProfile({
                    lastLogin: new Date(),
                }));
                this.setState({
                    displayName: user.displayName,
                    message: 'Welcome',
                });
            } else {
                this.props.dispatch(UserActions.clearUser());
            }
        });
    }
    componentWillReceiveProps(nextProps) {

        if (!this.props.user.doc && nextProps.user.doc) {
            nextProps.user.doc.get().then((ds) => {
                if (ds.data().displayName) {
                    this.props.navigation.push('Dashboard');
                } else {
                    this.props.navigation.push('Profile');
                }
            }).catch(e => console.log(e));
        }
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    confirmCode() {
        const { codeInput, confirmResult } = this.state;
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
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
                // setTimeout(() => {
                //     this.setState({ codeSent: false, message: 'Resend code?' });
                // }, 3000);
            });
        }).catch((error) => {
            const message = error.code === 'auth/invalid-phone-number' ?  'Phone Number not valid' : 'Some thing wrong happend!'
            this.setState({ message: `Error: ${message}` })
        });
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
            <View style={styles.phoneNumberContainer}>
                <Text style={{ textAlign: 'center' }}>Enter phone number:</Text>
                <TextInput
                    // autoFocus
                    dataDetectorTypes="phoneNumber"
                    keyboardType="phone-pad"
                    maxLength={13}
                    style={styles.phoneInput}
                    onChangeText={value => this.setState({ phoneNumber: value })}
                    placeholder="+919061120210"
                    value={phoneNumber}
                    onSubmitEditing={this.signIn}
                />
                <Button title='Sign In' disabled={codeSent || !phoneNumber} color='green' onPress={this.signIn} />
            </View>
        );
    }
    renderMessage() {
        const { message } = this.state;
        if (!message.length) return null;
        return (
            <Text style={styles.message}>{message}</Text>
        );
    }
    render() {
        const { confirmResult } = this.state;
        const { user } = this.props.user;
        return (
            <View style={styles.container}>
                <Text style={styles.brand}>CB-MOTO</Text>
                {this.props.user.pending && <ActivityIndicator animating />}
                {!user && !confirmResult && this.renderPhoneNumberInput()}
                {this.renderMessage()}
                {confirmResult && this.renderVerificationCodeInput()}
            </View>
        );
    }
}

export default connect(state => ({ user: state.user }))(Home);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
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
    brand: {
        fontFamily: "NOVA STAMP Bold",
        fontSize: 40,
        color: 'brown',
    },
    phoneNumberContainer: {
        // backgroundColor: '#DDD',
        width: '80%',
        maxWidth: 300,
        marginTop: 20,
    },
    phoneInput: {
        height: 50,
        marginTop: 0,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'monospace',
    },
    message: {
        marginTop: 15,
        padding: 15,
        color: '#666',
    },
});
