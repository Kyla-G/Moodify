import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import images from "@/constants/images";
import ConfettiCannon from 'react-native-confetti-cannon';

interface XpStreakPopupModalProps {
  visible: boolean;
  onClose: () => void;
  calculatedTotalXp: number;
  streak: number;
  xpAmount?: number;
  xpSource?: 'mood_entry' | 'chatbot_rating' | null;
  isPastDay?: boolean;
}

const XpStreakPopup = ({ 
  visible, 
  onClose, 
  // totalXp, 
  streak, 
  xpAmount, 
  xpSource, 
  isPastDay = false 
}: XpStreakPopupModalProps) => {
  const { width, height } = useWindowDimensions();
  const [confettiActive, setConfettiActive] = useState(false);
  const modalWidth = width * 0.9;
  
  useEffect(() => {
    if (visible) {
      setConfettiActive(true);
    }
  }, [visible]);
  
  // Skip showing XP popup for past-day entries
  if (isPastDay) {
    return null;
  }
  
  // Calculate XP amount based on source - exactly 5 XP for mood_entry and 20 XP for chatbot_rating
  const displayXpAmount = xpAmount || 
    (xpSource === 'mood_entry' ? 5 : 
     xpSource === 'chatbot_rating' ? 20 : 0);
  
  // Calculate total XP by adding accumulated XP from both sources
  const calculatedTotalXp = (xpSource === 'mood_entry' ? 5 : 0) + (xpSource === 'chatbot_rating' ? 20 : 0);
  
  // Determine message based on XP source
  const getMessage = () => {
    if (xpSource === 'mood_entry') {
      return "Good job on logging your mood today!";
    } else if (xpSource === 'chatbot_rating') {
      return "Thanks for your feedback on the Moodi!";
    } else {
      return "Good job on logging your mood today!";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          <View style={{
            backgroundColor: '#003049',
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
            borderWidth: 1,
            width: modalWidth
          }}> 
            {confettiActive && (
              <ConfettiCannon 
                count={300} 
                origin={{ x: 200, y: 150 }} 
                fadeOut={true} 
                autoStart={true}
                onAnimationEnd={() => setConfettiActive(false)}
              />
            )}

            <Image
              source={images.moodiwave}
              style={{
                width: 250,
                height: 180
              }}
              resizeMode="contain"
            />

            <Text style={{
              fontFamily: 'LeagueSpartan-Bold',
              color: '#FF6B35',
              marginBottom: 10,
              textAlign: 'center',
              fontSize: 35
            }}>I'm here for you</Text>
            
            <Text style={{
              fontFamily: 'LeagueSpartan-Regular',
              color: '#EEEED0',
              marginBottom: 25,
              textAlign: 'center',
              fontSize: 20
            }}>{getMessage()}</Text>
            
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#F6C49E',
              borderRadius: 10,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 25,
            }}>
              <Text style={{
                fontFamily: 'LeagueSpartan-Bold',
                color: '#004E89',
                textAlign: 'center',
                fontSize: 28
              }}>+{displayXpAmount} XP</Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 24,
              paddingHorizontal: 10,
            }}>
              
              {/* Total XP */}
              <View style={{
                backgroundColor: '#004E89',
                borderRadius: 20,
                padding: 15,
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 8
              }}>
                <Text style={{
                  color: '#F6C49E',
                  fontSize: 20,
                  fontFamily: 'LeagueSpartan-Bold'
                }}>TOTAL XP</Text>
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: '#F6C49E',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: 8
                }}>
                  <Ionicons name="flash" size={24} color="#004E89" />
                  <Text style={{
                    fontSize: 20,
                    fontFamily: 'LeagueSpartan-Regular',
                    color: '#004E89',
                    marginRight: 5,
                  }}>{calculatedTotalXp}</Text>
                </View>
              </View>

              {/* Streak */}
              <View style={{
                backgroundColor: '#F6C49E',
                borderRadius: 20,
                padding: 15,
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 8
              }}>
                <Text style={{
                  color: '#FF6B35',
                  fontFamily: 'LeagueSpartan-Bold',
                  fontSize: 20,
                }}>STREAK</Text>
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: '#FF6B35',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: 8
                }}>
                  <Ionicons name="flame" size={24} color="#F6C49E" />
                  <Text style={{
                    fontSize: 20,
                    fontFamily: 'LeagueSpartan-Regular',
                    color: '#EEEED0',
                    marginRight: 5,
                  }}>{streak}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={{
                backgroundColor: '#FF6B35',
                borderRadius: 30,
                paddingVertical: 15,
                paddingHorizontal: 30,
                alignItems: 'center',
                marginTop: 20,
              }}
              onPress={onClose}
            >
              <Text style={{
                fontFamily: 'LeagueSpartan-Bold',
                color: '#EEEED0',
                fontSize: 25
              }}>Claim XP</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default XpStreakPopup;