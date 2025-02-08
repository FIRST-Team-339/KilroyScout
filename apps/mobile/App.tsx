import { NavigationContainer } from "@react-navigation/native";
import "./global.css";
import React from "react";
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	useColorScheme,
	View,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

function App(): React.JSX.Element {
	const isDarkMode = useColorScheme() === "dark";

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	return (
		<NavigationContainer>
			<SafeAreaView style={backgroundStyle}>
				<StatusBar
					barStyle={isDarkMode ? "light-content" : "dark-content"}
					backgroundColor={backgroundStyle.backgroundColor}
				/>
				<Text>hello!!!</Text>
			</SafeAreaView>
		</NavigationContainer>
	);
}

export default App;
