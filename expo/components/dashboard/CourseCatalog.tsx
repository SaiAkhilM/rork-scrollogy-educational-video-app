import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { X, Lock, Play, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Course, Module } from '@/types';

interface CourseCatalogProps {
  course: Course;
  visible: boolean;
  onClose: () => void;
  onModulePress?: (module: Module) => void;
}

export default function CourseCatalog({ course, visible, onClose, onModulePress }: CourseCatalogProps) {
  const mockModules: Module[] = [
    {
      id: '1',
      title: 'Introduction to Deadly Animals',
      thumbnailUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
      progress: 100,
      isLocked: false,
      videos: [],
      quizzes: [],
      order: 1,
    },
    {
      id: '2',
      title: 'Venomous Creatures',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400',
      progress: 65,
      isLocked: false,
      videos: [],
      quizzes: [],
      order: 2,
    },
    {
      id: '3',
      title: 'Predators of the Wild',
      thumbnailUrl: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=400',
      progress: 0,
      isLocked: false,
      videos: [],
      quizzes: [],
      order: 3,
    },
    {
      id: '4',
      title: 'Tiny but Deadly',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=400',
      progress: 0,
      isLocked: true,
      videos: [],
      quizzes: [],
      order: 4,
    },
    {
      id: '5',
      title: 'Ocean Killers',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      progress: 0,
      isLocked: true,
      videos: [],
      quizzes: [],
      order: 5,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
            <Text style={styles.moduleCount}>{mockModules.length} modules</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={Colors.text.primary} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.modulesSection}>
            <Text style={styles.sectionTitle}>Course Modules</Text>
            {mockModules.map((module, index) => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.moduleCard,
                  module.isLocked && styles.moduleCardLocked,
                ]}
                onPress={() => !module.isLocked && onModulePress?.(module)}
                disabled={module.isLocked}
              >
                <View style={styles.moduleImageContainer}>
                  <Image 
                    source={{ uri: module.thumbnailUrl }} 
                    style={[
                      styles.moduleImage,
                      module.isLocked && styles.moduleImageLocked,
                    ]} 
                    blurRadius={module.isLocked ? 10 : 0}
                  />
                  {module.isLocked && (
                    <View style={styles.lockOverlay}>
                      <Lock color={Colors.white} size={24} />
                    </View>
                  )}
                  {module.progress === 100 && !module.isLocked && (
                    <View style={styles.completedBadge}>
                      <CheckCircle color={Colors.accentGreen} size={20} fill={Colors.accentGreen} />
                    </View>
                  )}
                </View>

                <View style={styles.moduleInfo}>
                  <View style={styles.moduleHeader}>
                    <Text style={styles.moduleNumber}>Module {index + 1}</Text>
                    {!module.isLocked && (
                      <Text style={styles.moduleProgress}>{module.progress}%</Text>
                    )}
                  </View>
                  <Text style={styles.moduleTitle} numberOfLines={2}>
                    {module.title}
                  </Text>
                  
                  {module.isLocked ? (
                    <Text style={styles.lockMessage}>
                      Complete 80% of previous module to unlock
                    </Text>
                  ) : (
                    <TouchableOpacity 
                      style={styles.enterButton}
                      onPress={() => onModulePress?.(module)}
                    >
                      <Play color={Colors.white} size={16} />
                      <Text style={styles.enterButtonText}>Enter Module</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  headerContent: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  title: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  moduleCount: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    lineHeight: 24,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  modulesSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  moduleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
    ...Colors.shadows.small,
  },
  moduleCardLocked: {
    opacity: 0.7,
  },
  moduleImageContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  moduleImage: {
    width: '100%',
    height: '100%',
  },
  moduleImageLocked: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 2,
  },
  moduleInfo: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  moduleNumber: {
    fontSize: Layout.fontSize.xs,
    color: Colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  moduleProgress: {
    fontSize: Layout.fontSize.xs,
    color: Colors.accentGreen,
    fontWeight: 'bold',
  },
  moduleTitle: {
    fontSize: Layout.fontSize.md,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    lineHeight: 20,
  },
  lockMessage: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    alignSelf: 'flex-start',
  },
  enterButtonText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
