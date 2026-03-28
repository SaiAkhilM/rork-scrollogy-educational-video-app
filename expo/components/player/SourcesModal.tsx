import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Linking,
  SafeAreaView,
} from 'react-native';
import { X, ExternalLink, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Source } from '@/types';

interface SourcesModalProps {
  visible: boolean;
  onClose: () => void;
  sources: Source[];
}

export default function SourcesModal({ visible, onClose, sources }: SourcesModalProps) {
  const handleOpenSource = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  const renderSource = ({ item }: { item: Source }) => (
    <TouchableOpacity
      style={styles.sourceItem}
      onPress={() => handleOpenSource(item.url)}
    >
      <View style={styles.sourceIcon}>
        <ExternalLink color={Colors.primary} size={20} />
      </View>
      <View style={styles.sourceContent}>
        <View style={styles.sourceHeader}>
          <Text style={styles.sourceDomain}>{item.domain}</Text>
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle color={Colors.accentGreen} size={16} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <Text style={styles.sourceTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      <ExternalLink color={Colors.text.secondary} size={20} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sources & References</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={Colors.text.primary} size={28} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          All information in this video is backed by these trusted sources:
        </Text>

        <FlatList
          data={sources}
          renderItem={renderSource}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sourcesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No sources available for this video.
              </Text>
            </View>
          }
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Verified sources include .gov, .edu, and .org domains
          </Text>
        </View>
      </SafeAreaView>
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
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
  },
  sourcesList: {
    padding: Layout.spacing.lg,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.md,
    ...Colors.shadows.small,
  },
  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  sourceContent: {
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  sourceDomain: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: Layout.spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    backgroundColor: Colors.gray.lightest,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.small,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.accentGreen,
    fontWeight: '600',
  },
  sourceTitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: Layout.spacing.xl * 2,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  footerText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
