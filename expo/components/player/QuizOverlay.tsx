import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Layout from '@/constants/layout';
import { Quiz } from '@/types';

interface QuizOverlayProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onSkip: () => void;
}



export default function QuizOverlay({ quiz, onComplete, onSkip }: QuizOverlayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    new Array(quiz.questions.length).fill(undefined)
  );
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [confettiAnimation] = useState(new Animated.Value(0));

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const allCorrect = answers.every(
    (a, i) => a === quiz.questions[i].correctAnswer
  );

  useEffect(() => {
    const savedAnswer = answers[currentQuestionIndex];
    if (savedAnswer !== undefined) {
      setSelectedOption(savedAnswer);
      setShowResult(true);
      setIsCorrect(savedAnswer === currentQuestion.correctAnswer);
    } else {
      setSelectedOption(undefined);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [currentQuestionIndex, answers, currentQuestion.correctAnswer]);

  const handleSubmit = () => {
    if (selectedOption === undefined) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    if (correct) {
      Animated.sequence([
        Animated.timing(confettiAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (allCorrect) {
      const score = (answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length / quiz.questions.length) * 100;
      onComplete(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTryAgain = () => {
    setSelectedOption(undefined);
    setShowResult(false);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = undefined;
    setAnswers(newAnswers);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.quizTitle}>Quiz Time! 🎯</Text>
          <Text style={styles.courseName}>{quiz.courseName || 'Course Quiz'}</Text>
        </View>

        <View style={styles.progressContainer}>
          {quiz.questions.map((_, index) => {
            const answer = answers[index];
            let color = Colors.gray.light;
            if (answer !== undefined) {
              color = answer === quiz.questions[index].correctAnswer
                ? Colors.accentGreen
                : Colors.error;
            }
            if (index === currentQuestionIndex) {
              color = Colors.primary;
            }

            return (
              <View
                key={index}
                style={[styles.progressDot, { backgroundColor: color }]}
              />
            );
          })}
        </View>

        <Animated.View
          style={[
            styles.questionCard,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              let backgroundColor = Colors.white;
              let borderColor = Colors.gray.light;

              if (showResult && isSelected) {
                backgroundColor = isCorrect ? Colors.accentGreen : Colors.error;
                borderColor = isCorrect ? Colors.accentGreen : Colors.error;
              } else if (isSelected) {
                backgroundColor = Colors.primary;
                borderColor = Colors.primary;
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    { backgroundColor, borderColor },
                  ]}
                  onPress={() => !showResult && setSelectedOption(index)}
                  disabled={showResult}
                >
                  <Text
                    style={[
                      styles.optionText,
                      (isSelected || (showResult && isSelected)) && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {showResult && isSelected && (
                    <View style={styles.resultIcon}>
                      {isCorrect ? (
                        <Check color={Colors.white} size={20} />
                      ) : (
                        <X color={Colors.white} size={20} />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {!showResult && selectedOption !== undefined && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          )}

          {showResult && !isCorrect && (
            <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
              <Text style={styles.tryAgainButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}

          {showResult && isCorrect && (
            <View style={styles.correctMessage}>
              <Text style={styles.correctMessageText}>
                ✨ Correct! Great job!
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft color={currentQuestionIndex === 0 ? Colors.gray.medium : Colors.primary} size={24} />
            <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              (!showResult || !isCorrect) && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!showResult || !isCorrect}
          >
            <Text style={[
              styles.navButtonText,
              (!showResult || !isCorrect) && styles.navButtonTextDisabled,
            ]}>
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            </Text>
            <ChevronRight color={(!showResult || !isCorrect) ? Colors.gray.medium : Colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>
            Skip Quiz (Won&apos;t count for certificate)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {confettiAnimation && (
        <Animated.View
          style={[
            styles.confetti,
            {
              opacity: confettiAnimation,
              transform: [
                {
                  scale: confettiAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.confettiText}>🎉</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  quizTitle: {
    fontSize: Layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  courseName: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.xl,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  questionNumber: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  questionText: {
    fontSize: Layout.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xl,
  },
  optionsContainer: {
    gap: Layout.spacing.md,
  },
  optionButton: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.primary,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  resultIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  tryAgainButton: {
    backgroundColor: Colors.error,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  tryAgainButtonText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  correctMessage: {
    backgroundColor: Colors.accentGreen,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
  },
  correctMessageText: {
    color: Colors.white,
    fontSize: Layout.fontSize.lg,
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    padding: Layout.spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: Layout.fontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: Colors.gray.medium,
  },
  skipButton: {
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    textDecorationLine: 'underline',
  },
  confetti: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  confettiText: {
    fontSize: 100,
  },
});
