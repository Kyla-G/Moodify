import { View, Text} from "react-native"
import React from "react"
import { Link } from "expo-router"

const OnBoarding1 = () => {
    return (
        <View>
        <Text>Track Moods</Text>
        <Link href="/on-boarding-page2">Next</Link>
        </View>
    )
}

export default OnBoarding1