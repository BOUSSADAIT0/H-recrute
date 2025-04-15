import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

/**
 * ProfileHeader component for displaying user profile header
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {Object} props.profile - Profile data
 * @param {Function} [props.onEditPress] - Edit button press handler
 * @param {Function} [props.onImagePress] - Profile image press handler
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} ProfileHeader component
 */
const ProfileHeader = ({
  user,
  profile,
  onEditPress,
  onImagePress,
  style
}) => {
  const { theme } = useTheme();
  
  // Get profile picture
  const getProfilePicture = () => {
    if (user?.profilePicture) {
      return { uri: user.profilePicture };
    }
    return require('../../assets/images/default-profile.png');
  };
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.colors.primary + '10' },
      style
    ]}>
      <View style={styles.coverArea} />
      
      <View style={styles.profileContent}>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          onPress={onImagePress}
          disabled={!onImagePress}
        >
          <Image
            source={getProfilePicture()}
            style={styles.profileImage}
            resizeMode="cover"
          />
          {onImagePress && (
            <View style={[
              styles.editImageButton,
              { backgroundColor: theme.colors.primary }
            ]}>
              <Icon name="camera" size={14} color={theme.colors.white} />
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          
          {profile?.title && (
            <Text style={[styles.userTitle, { color: theme.colors.textSecondary }]}>
              {profile.title}
            </Text>
          )}
          
          {user?.location && (
            <View style={styles.locationContainer}>
              <Icon name="map-marker" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
                {user.location}
              </Text>
            </View>
          )}
        </View>
        
        {onEditPress && (
          <TouchableOpacity
            style={[
              styles.editButton,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary
              }
            ]}
            onPress={onEditPress}
          >
            <Icon name="pencil" size={16} color={theme.colors.primary} />
            <Text style={[styles.editButtonText, { color: theme.colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.medium,
  },
  coverArea: {
    height: 80,
  },
  profileContent: {
    flexDirection: 'row',
    marginTop: -40,
    padding: spacing.medium,
    paddingTop: 0,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.medium,
    justifyContent: 'center',
  },
  userName: {
    ...typography.h6,
    marginBottom: 2,
  },
  userTitle: {
    ...typography.body2,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    ...typography.caption,
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.small,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: spacing.small,
  },
  editButtonText: {
    ...typography.caption,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ProfileHeader;