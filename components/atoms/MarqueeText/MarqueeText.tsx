import { Text } from '@/components/atoms';
import { Marquee } from '@animatereactnative/marquee';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

type MarqueeTextProps = {
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  speed?: number;
  spacing?: number;
  variant?: "caption" | "subtitle" | "heading";
};

export function MarqueeText({
  text,
  style,
  textStyle,
  speed = 0.5,
  spacing = 45,
  variant = "caption"
}: MarqueeTextProps) {
  const [shouldMarquee, setShouldMarquee] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {/* Hidden measurement text */}
      <Text
        variant={variant}
        style={[textStyle, { opacity: 0, position: 'absolute' }]}
        onTextLayout={(e) => {
            const numberOfLines = e.nativeEvent.lines.length;
            if (numberOfLines > 1) {
                setShouldMarquee(true);
            } else {
                setShouldMarquee(false);
            }
        }}
      >
        {text}
      </Text>

      {shouldMarquee ? (
        <Marquee
          speed={speed}
          spacing={spacing}
          style={styles.marquee}
        >
          <Text variant={variant} style={textStyle}>
            {text}
          </Text>
        </Marquee>
      ) : (
        <Text 
          variant={variant} 
          style={[textStyle, styles.staticText]}
          numberOfLines={1}
        >
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    justifyContent: 'center',
  },
  marquee: {
    height: 20,
  },
  staticText: {
    height: 20,
  }
});
