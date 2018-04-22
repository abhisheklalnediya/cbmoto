import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    View,
    Text,
} from 'react-native';
class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        const {user} = this.props.user
        return (
            <View>
                <Text>Welcome {user.displayName}</Text>
            </View>
        )
    }
}

export default connect(store => ({
    user: store.user,
}))(Dashboard)