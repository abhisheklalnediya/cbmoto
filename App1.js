import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image } from 'react-native';

import firebase from 'react-native-firebase';

const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+44',
      confirmResult: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user)
        this.setState({ user });
        
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+919061120210',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });
    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => {
        console.log(confirmResult)
        this.setState({ confirmResult, message: 'Code has been sent!' })
      })
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          console.log(user)
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title='Sign In' color='green' onPress={this.signIn} />
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

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title='Confirm Code' color='#841584' onPress={this.confirmCode} />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;
    //console.log(firebase.auth.PhoneAuthProvider.credential('+919061120210'))
    // "AM5PThBt7t6UzLnl13vVP5aeDnDh95N_5L2UdmbXc4FhlXFV7Hbzdgr2dfEGT2IOk2uLxcvDVtABq2eDJ_ZdA7x8881J6rGp-nyMJO8q_wvi5p0ym9R_5MM7qAPg6M1OBk6VaOpCSoC18d8z1RX0k9DhKBxQkx_-M4d3busKWchswov2GLx1GbdNBd3Tg92ElDw77EK2c5s1e5b4zrTfi99MxipSPjHJDA"
    // "892603"
    if (user) {
      // user.updateEmail('abhisheklalnediya@gmail.com').then(s => {
      //   console.log(s) 
      // }). catch(e => {
      //   console.log(e.code)
      //   switch(e.code) {
      //     case 'auth/requires-recent-login' :
            
      //       break
      //   }
      // });
      // user.reauthenticateWithCredential(firebase.auth.PhoneAuthProvider.credential(
      //   "AM5PThBt7t6UzLnl13vVP5aeDnDh95N_5L2UdmbXc4FhlXFV7Hbzdgr2dfEGT2IOk2uLxcvDVtABq2eDJ_ZdA7x8881J6rGp-nyMJO8q_wvi5p0ym9R_5MM7qAPg6M1OBk6VaOpCSoC18d8z1RX0k9DhKBxQkx_-M4d3busKWchswov2GLx1GbdNBd3Tg92ElDw77EK2c5s1e5b4zrTfi99MxipSPjHJDA",
      //   "892603"
      // )).then(s => {
      //     console.log(s) 
      //   }). catch(e => {
      //    console.log(e.code)
        
      //   });
      console.log(user.toJSON())
    }
    return (
      <View style={{ flex: 1 }}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#77dd77',
              flex: 1,
            }}
          >
            <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{1}</Text>
            <Button title='Sign Out' color='red' onPress={this.signOut} />
          </View>
        )}
      </View>
    );
  }
}