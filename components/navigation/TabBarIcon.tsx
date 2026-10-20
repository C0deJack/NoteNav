// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import type { IconProps } from '@expo/vector-icons/build/createIconSet';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

type TabBarIconProps = Omit<
  IconProps<ComponentProps<typeof Ionicons>['name']>,
  'color'
> & {
  // Tab navigators type color as RN's ColorValue, which is wider than
  // @expo/vector-icons accepts. They always pass a string in practice.
  color: ColorValue;
};

export function TabBarIcon({ style, color, ...rest }: TabBarIconProps) {
  return (
    <Ionicons
      size={28}
      style={[{ marginBottom: -3 }, style]}
      color={color as string}
      {...rest}
    />
  );
}
