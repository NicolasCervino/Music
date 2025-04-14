import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
   Dimensions,
   Modal,
   Pressable,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native';

export interface MenuOption {
   label: string;
   icon?: keyof typeof Ionicons.glyphMap;
   onPress: () => void;
}

export interface ContextMenuProps {
   options: MenuOption[];
   menuIcon?: keyof typeof Ionicons.glyphMap;
   iconSize?: number;
   menuPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
   accessibilityLabel?: string;
}

export function ContextMenu({
   options,
   menuIcon = 'ellipsis-vertical',
   iconSize = 20,
   menuPosition = 'bottom-right',
   accessibilityLabel = 'More options',
}: ContextMenuProps): React.ReactElement {
   const { theme } = useTheme();
   const [menuVisible, setMenuVisible] = useState(false);
   const [menuRect, setMenuRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

   // Menu min/max width constants (used for positioning calculations)
   const MIN_MENU_WIDTH = 160;
   const MAX_MENU_WIDTH = 220;
   const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

   const toggleMenu = (e: any) => {
      e.stopPropagation();
      if (!menuVisible) {
         // Measure the position of the menu trigger button
         e.target.measure(
            (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
               setMenuRect({ top: pageY, left: pageX, width, height });
               setMenuVisible(true);
            }
         );
      } else {
         setMenuVisible(false);
      }
   };

   const handleOptionPress = (onPress: () => void) => {
      setMenuVisible(false);
      onPress();
   };

   // Calculate optimal menu width based on content
   const getMenuWidth = () => {
      // Find the longest option label length (approximate character width)
      const longestLabel = options.reduce((max, option) => {
         return option.label.length > max ? option.label.length : max;
      }, 0);

      // Approximate width based on character count (~8px per character + padding + icon space)
      const iconSpace = 36; // Space for the icon
      const padding = 32; // Left and right padding
      const approximateWidth = longestLabel * 8 + padding + iconSpace;

      // Constrain width between MIN and MAX
      return Math.max(MIN_MENU_WIDTH, Math.min(approximateWidth, MAX_MENU_WIDTH));
   };

   const getMenuPositionStyle = () => {
      // Get the calculated menu width
      const menuWidth = getMenuWidth();

      let position = { top: 0, left: 0 };

      // Calculate initial position based on specified menuPosition
      switch (menuPosition) {
         case 'top-right':
            position = {
               top: menuRect.top - 180,
               left: menuRect.left - menuWidth + menuRect.width,
            };
            break;
         case 'top-left':
            position = {
               top: menuRect.top - 180,
               left: menuRect.left,
            };
            break;
         case 'bottom-left':
            position = {
               top: menuRect.top + menuRect.height + 10,
               left: menuRect.left,
            };
            break;
         case 'bottom-right':
         default:
            position = {
               top: menuRect.top + menuRect.height + 10,
               left: menuRect.left - menuWidth + menuRect.width,
            };
            break;
      }

      // Ensure the menu stays within screen boundaries

      // Check left boundary
      if (position.left < 10) {
         position.left = 10;
      }

      // Check right boundary
      if (position.left + menuWidth > SCREEN_WIDTH - 10) {
         position.left = SCREEN_WIDTH - menuWidth - 10;
      }

      // Check top boundary
      if (position.top < 40) {
         // Allow some space for status bar
         position.top = 40;
      }

      // Check bottom boundary
      const MENU_HEIGHT = options.length * 50; // Approximate menu height
      if (position.top + MENU_HEIGHT > SCREEN_HEIGHT - 30) {
         position.top = SCREEN_HEIGHT - MENU_HEIGHT - 30;
      }

      return position;
   };

   return (
      <View style={styles.container}>
         <TouchableOpacity
            style={styles.menuButton}
            onPress={toggleMenu}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityLabel={accessibilityLabel}
         >
            <Ionicons name={menuIcon} size={iconSize} color={theme.colors.text} />
         </TouchableOpacity>

         <Modal
            visible={menuVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
         >
            <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
               <View
                  style={[
                     styles.menuContainer,
                     getMenuPositionStyle(),
                     {
                        backgroundColor: theme.dark ? '#1c1c1c' : '#ffffff',
                        borderColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        width: getMenuWidth(),
                     },
                  ]}
               >
                  {options.map((option, index) => (
                     <React.Fragment key={`${option.label}-${index}`}>
                        <TouchableOpacity
                           style={styles.menuItem}
                           onPress={() => handleOptionPress(option.onPress)}
                           activeOpacity={0.7}
                        >
                           {option.icon && (
                              <View style={styles.iconContainer}>
                                 <Ionicons
                                    name={option.icon}
                                    size={18}
                                    color={theme.colors.text}
                                    style={styles.menuItemIcon}
                                 />
                              </View>
                           )}
                           <Text
                              style={[styles.menuItemText, { color: theme.colors.text }]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                           >
                              {option.label}
                           </Text>
                        </TouchableOpacity>
                        {index < options.length - 1 && (
                           <View
                              style={[
                                 styles.divider,
                                 {
                                    backgroundColor: theme.dark
                                       ? 'rgba(255,255,255,0.1)'
                                       : 'rgba(0,0,0,0.05)',
                                 },
                              ]}
                           />
                        )}
                     </React.Fragment>
                  ))}
               </View>
            </Pressable>
         </Modal>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      position: 'relative',
   },
   menuButton: {
      padding: 8,
      borderRadius: 20,
   },
   modalOverlay: {
      flex: 1,
   },
   menuContainer: {
      position: 'absolute',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 12,
      overflow: 'hidden',
      borderWidth: 0.5,
   },
   menuItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
   },
   iconContainer: {
      width: 28,
      alignItems: 'center',
      justifyContent: 'center',
   },
   menuItemIcon: {
      marginRight: 8,
   },
   menuItemText: {
      fontSize: 15,
      fontWeight: '500',
      flex: 1,
   },
   divider: {
      height: 1,
      width: '94%',
      alignSelf: 'center',
   },
});
