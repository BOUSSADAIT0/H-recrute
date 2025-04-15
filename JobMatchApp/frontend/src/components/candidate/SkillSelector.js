import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import SkillBadge from './SkillBadge';

// Hooks and Context
import useTheme from '../../hooks/useTheme';

// Styles and Constants
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

/**
 * SkillSelector component for selecting skills from a list
 * @param {Object} props - Component props
 * @param {Array} props.allSkills - All available skills
 * @param {Array} props.selectedSkills - Currently selected skills
 * @param {Function} props.onSkillsChange - Callback for skills changes
 * @param {Object} [props.style] - Additional container style
 * @returns {React.ReactElement} SkillSelector component
 */
const SkillSelector = ({
  allSkills = [],
  selectedSkills = [],
  onSkillsChange,
  style,
}) => {
  const { theme } = useTheme();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSkills, setFilteredSkills] = useState([]);
  
  // Filter skills based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSkills([]);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = allSkills.filter(skill => {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      return skillName.toLowerCase().includes(lowerQuery);
    });
    
    setFilteredSkills(filtered);
  }, [searchQuery, allSkills]);
  
  // Toggle skill selection
  const toggleSkill = (skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    const selectedSkillNames = selectedSkills.map(s => 
      typeof s === 'string' ? s : s.name
    );
    
    if (selectedSkillNames.includes(skillName)) {
      // Remove skill
      const newSelected = selectedSkills.filter(s => {
        const name = typeof s === 'string' ? s : s.name;
        return name !== skillName;
      });
      onSkillsChange(newSelected);
    } else {
      // Add skill
      onSkillsChange([...selectedSkills, skill]);
    }
    
    // Clear search after selection
    setSearchQuery('');
  };
  
  // Add custom skill
  const addCustomSkill = () => {
    if (!searchQuery.trim()) return;
    
    // Check if skill already exists
    const skillName = searchQuery.trim();
    const selectedSkillNames = selectedSkills.map(s => 
      typeof s === 'string' ? s : s.name
    );
    
    if (!selectedSkillNames.includes(skillName)) {
      onSkillsChange([...selectedSkills, skillName]);
    }
    
    // Clear search
    setSearchQuery('');
  };
  
  // Check if a skill is selected
  const isSkillSelected = (skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    return selectedSkills.some(s => {
      const name = typeof s === 'string' ? s : s.name;
      return name === skillName;
    });
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* Selected Skills */}
      <View style={styles.selectedContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Selected Skills
        </Text>
        
        <View style={styles.skillsContainer}>
          {selectedSkills.length > 0 ? (
            selectedSkills.map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              return (
                <SkillBadge 
                  key={index}
                  name={skillName}
                  selectable={true}
                  selected={true}
                  onPress={() => toggleSkill(skill)}
                />
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No skills selected
            </Text>
          )}
        </View>
      </View>
      
      {/* Skill Search */}
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          { 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          }
        ]}>
          <Icon name="magnify" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search skills or type to add"
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.trim() !== '' && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Icon name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {searchQuery.trim() !== '' && (
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={addCustomSkill}
          >
            <Icon name="plus" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Filtered Skills */}
      {filteredSkills.length > 0 && (
        <View style={[
          styles.resultsContainer,
          { 
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          }
        ]}>
          <FlatList
            data={filteredSkills}
            keyExtractor={(item, index) => 
              (typeof item === 'string' ? item : item.id || item.name) + index
            }
            renderItem={({ item }) => {
              const skillName = typeof item === 'string' ? item : item.name;
              const selected = isSkillSelected(item);
              
              return (
                <TouchableOpacity
                  style={[
                    styles.resultItem,
                    selected && { backgroundColor: theme.colors.primary + '10' },
                  ]}
                  onPress={() => toggleSkill(item)}
                >
                  <Text style={[
                    styles.resultText,
                    { color: selected ? theme.colors.primary : theme.colors.text }
                  ]}>
                    {skillName}
                  </Text>
                  
                  {selected && (
                    <Icon 
                      name="check" 
                      size={18} 
                      color={theme.colors.primary} 
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.medium,
  },
  selectedContainer: {
    marginBottom: spacing.medium,
  },
  label: {
    ...typography.subtitle2,
    marginBottom: spacing.small,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyText: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.small,
    ...typography.body1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.small,
  },
  resultsContainer: {
    marginTop: spacing.small,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  resultsList: {
    paddingVertical: spacing.small,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
  },
  resultText: {
    ...typography.body2,
  },
});

export default SkillSelector;