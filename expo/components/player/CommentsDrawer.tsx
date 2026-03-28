import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { X, Heart, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Comment } from '@/types';

interface CommentsDrawerProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
}

export default function CommentsDrawer({
  visible,
  onClose,
  comments,
  onAddComment,
  onLikeComment,
}: CommentsDrawerProps) {
  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{
          uri: item.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName)}&background=7B68EE&color=fff`,
        }}
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timeAgo}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onLikeComment(item.id)}
        >
          <Heart
            color={item.isLiked ? Colors.error : Colors.text.secondary}
            fill={item.isLiked ? Colors.error : 'transparent'}
            size={16}
          />
          {item.likes > 0 && (
            <Text style={[styles.likeCount, item.isLiked && styles.likeCountActive]}>
              {item.likes}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.text.primary} size={24} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.commentsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No comments yet. Be the first to comment! 💬
                </Text>
              </View>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.text.secondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!commentText.trim()}
            >
              <Send
                color={commentText.trim() ? Colors.primary : Colors.gray.medium}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? Layout.spacing.xl : Layout.spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray.light,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  title: {
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  commentsList: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
    marginRight: Layout.spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  userName: {
    fontSize: Layout.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: Layout.spacing.sm,
  },
  timeAgo: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
  },
  commentText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    lineHeight: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  likeCount: {
    fontSize: Layout.fontSize.xs,
    color: Colors.text.secondary,
  },
  likeCountActive: {
    color: Colors.error,
    fontWeight: '600',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
    gap: Layout.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.gray.lightest,
    borderRadius: Layout.borderRadius.large,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    padding: Layout.spacing.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
