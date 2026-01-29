import { useState } from 'react';
import { Text, View, TextInput, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { onboardingStyles as styles } from '@/styles/onboarding.styles';

interface NameScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function NameScreen({ onNext, onBack }: NameScreenProps) {
  const [name, setName] = useState('');

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Pressable style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>{'\u2039'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{"What's your name?"}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.screenContent}>
        <Image
          source={require('@/assets/modi.jpeg')}
          style={styles.smallPandaImage}
          contentFit="contain"
        />

        <Text style={styles.heading}>{"What's your name?"}</Text>
        <Text style={styles.subtitle}>
          {"I'd love to get to know you better!"}
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Your name"
          placeholderTextColor="#b0a89e"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
