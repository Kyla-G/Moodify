import React from "react";
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import images from "@/constants/images";
import icons from "@/constants/icons";

// Map mood types to theme color properties
const moodToThemeMap = {
  "rad": "buttonBg",
  "good": "accent1",
  "meh": "accent2",
  "bad": "accent3",
  "awful": "accent4"
};

const SummaryModal = ({
  visible,
  onClose,
  selectedMood,
  selectedEmotion,
  selectedDate,
  onSaveEntry,
  onChatbot,
  theme
}) => {
  const { width, height } = useWindowDimensions();
  const modalPadding = width < 350 ? 12 : 24;
  const iconSize = width < 350 ? 18 : 24;

  // Get mood color from theme
  const getMoodThemeColor = (mood) => {
    if (!mood) return theme.calendarBg;
    
    // Convert "rad" to "Rad" if needed for mapping
    const normalizedMood = mood.toLowerCase();
    const themeProperty = moodToThemeMap[normalizedMood];
    
    if (themeProperty && theme[themeProperty]) {
      return theme[themeProperty];
    }
    
    return theme.text; // Fallback
  };

  const moodColor = getMoodThemeColor(selectedMood);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: moodColor,
          paddingVertical: modalPadding,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: height * 0.05,
              left: width * 0.05,
              zIndex: 10,
            }}
          >
            <Ionicons name="close" size={iconSize} color={theme.calendarBg} />
          </TouchableOpacity>

          <View
            style={{ 
              alignItems: 'center',
              justifyContent: 'center',
              padding: modalPadding 
            }}
          >
            <Text
              style={{ 
                color: theme.calendarBg,
                fontFamily: "LeagueSpartan",
                textAlign: "center",
                marginBottom: 2,
                fontSize: width < 350 ? 28 : 36
              }}
            >
              You're feeling
            </Text>

            <Text
              style={{ 
                color: theme.buttonText || theme.calendarBg,
                fontFamily: "LeagueSpartan-Bold",
                textAlign: "center",
                marginBottom: 40,
                fontSize: width < 350 ? 20 : 48
              }}
            >
              {selectedMood} and {selectedEmotion}
            </Text>

            <View style={{ 
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40
            }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 16
              }}>
                <Ionicons 
                  name="calendar-outline" 
                  size={iconSize} 
                  color={theme.calendarBg} 
                  style={{ marginRight: 8 }} 
                />
                <Text
                  style={{ 
                    color: theme.calendarBg,
                    fontFamily: "LeagueSpartan",
                    textAlign: "center",
                    fontSize: width < 350 ? 16 : 20
                  }}
                >
                  {format(selectedDate, "MMMM dd, yyyy")}
                </Text>
              </View>

              <View style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
                <Ionicons 
                  name="time-outline" 
                  size={iconSize} 
                  color={theme.calendarBg} 
                  style={{ marginRight: 8 }} 
                />
                <Text
                  style={{ 
                    color: theme.calendarBg,
                    fontFamily: "LeagueSpartan",
                    textAlign: "center",
                    fontSize: width < 350 ? 16 : 20
                  }}
                >
                  {format(selectedDate, "h:mm a")}
                </Text>
              </View>
            </View>
          </View>

          {/* Chatbot Section */}
          <View style={{ 
            padding: modalPadding, 
            width: '100%', 
            alignItems: 'flex-start' 
          }}>
            <Text
              style={{ 
                color: theme.calendarBg,
                fontFamily: "LeagueSpartan-Bold",
                marginBottom: 24,
                fontSize: width < 350 ? 20 : 24
              }}
            >
              Would you like to talk about it more?
            </Text>

            <View style={{
              alignItems: "flex-start"
            }}>
              <TouchableOpacity
                onPress={onChatbot}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 100,
                  alignItems: "center",
                  marginBottom: 8,
                  backgroundColor: theme.calendarBg
                }}
              >
                <Text
                  style={{ 
                    fontFamily: "LeagueSpartan-Bold",
                    fontSize: 24,
                    color: moodColor
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSaveEntry}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 100,
                  alignItems: "center",
                  marginBottom: 8,
                  backgroundColor: theme.calendarBg
                }}
              >
                <Text
                  style={{ 
                    fontFamily: "LeagueSpartan",
                    fontSize: 24,
                    color: moodColor
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={images.moodichat}
            style={{
              width: width * 1,
              height: width * 1,
              position: 'absolute',
              bottom: -130,
              left: 85,
              resizeMode: 'contain'
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default SummaryModal;