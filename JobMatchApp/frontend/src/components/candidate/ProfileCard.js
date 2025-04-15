import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import Card from '../common/Card';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

/**
 * ProfileCard component to display candidate profile summary
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {Object} props.profile - Profile data
 * @param {Function} props.onPress - Card press handler
 * @param {Function} [props.onMessagePress] - Message button press handler
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} ProfileCard component
 */
const ProfileCard = ({ user, profile, onPress, onMessagePress, style }) => {
  const { theme } = useTheme();
  
  // Get profile picture
  const getProfilePicture = () => {
    if (user?.profilePicture) {
      return { uri: user.profilePicture };
    }
    return require('../../assets/images/default-profile.png');
  };
  
  // Get top skills to display
  const getTopSkills = () => {
    if (!profile?.skills || profile.skills.length === 0) {
      return [];
    }
    
    return profile.skills.slice(0, 3).map(skill => {
      if (typeof skill === 'object') {
        return skill.name || skill.skill?.name || '';
      }
      return skill;
    });
  };
  
  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={getProfilePicture()}
          style={styles.profilePicture}
          resizeMode="cover"
        />
        
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          
          {profile?.title && (
            <Text style={[styles.title, { color: theme.colors.textSecondary }]}>
              {profile.title}
            </Text>
          )}
          
          {user?.location && (
            <View style={styles.locationContainer}>
              <Icon name="map-marker-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
                {user.location}
              </Text>
            </View>
          )}
        </View>
        
        {onMessagePress && (
          <TouchableOpacity
            style={[styles.messageButton, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={onMessagePress}
          >
            <Icon name="message-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {profile?.summary && (
        <View style={styles.section}>
          <Text 
            style={[styles.summaryText, { color: theme.colors.text }]}
            numberOfLines={3}
          >
            {profile.summary}
          </Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Skills
        </Text>
        
        <View style={styles.skillsContainer}>
          {getTopSkills().map((skill, index) => (
            <View 
              key={index} 
              style={[
                styles.skillBadge, 
                { backgroundColor: theme.colors.primary + '20' }
              ]}
            >
              <Text style={[styles.skillText, { color: theme.colors.primary }]}>
                {skill}
              </Text>
            </View>
          ))}
          
          {profile?.skills && profile.skills.length > 3 && (
            <View style={[styles.skillBadge, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.skillText, { color: theme.colors.textSecondary }]}>
                +{profile.skills.length - 3}
              </Text>
            </View>
          )}
          
          {(!profile?.skills || profile.skills.length === 0) && (
            <Text style={[styles.noSkillsText, { color: theme.colors.textSecondary }]}>
              No skills listed
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        {profile?.experience && (
          <View style={styles.footerItem}>
            <Icon name="briefcase-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              {profile.experience} years
            </Text>
          </View>
        )}
        
        {profile?.education && profile.education.length > 0 && (
          <View style={styles.footerItem}>
            <Icon name="school-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              {profile.education[0].degree}
            </Text>
          </View>
        )}
        
        <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.medium,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.medium,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...typography.h6,
    marginBottom: 2,
  },
  title: {
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
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: spacing.small,
  },
  section: {
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    ...typography.subtitle2,
    marginBottom: spacing.small,
  },
  summaryText: {
    ...typography.body2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: spacing.small,
    marginBottom: spacing.extraSmall,
  },
  skillText: {
    ...typography.caption,
    fontWeight: '500',
  },
  noSkillsText: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.small,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    marginLeft: spacing.small,
  },
});

export default ProfileCard;