import { StackNavigator } from 'react-navigation';
import HomeScreen from '../components/home';
import SplashScreen from '../components/splash';
import DashboardScreen from '../components/dashboard';
import ProfileScreen from '../components/profile';

export default StackNavigator({
    Home: {
        screen: HomeScreen,
    },
    Splash: {
        screen: SplashScreen,
    },
    Dashboard: {
        screen: DashboardScreen,
    },
    Profile: {
        screen: ProfileScreen,
    },
}, {
    headerMode: 'none',
});
