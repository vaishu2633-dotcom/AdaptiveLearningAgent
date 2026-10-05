import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { GOAL_OPTIONS, QUESTION_BANKS } from '@/data/assessmentQuestions';
import {
  getRoadmapForGoal,
  getTopicById,
} from '@/data/learningPathData';
import {
  AssessmentQuestion,
  AssessmentResult,
  PredefinedGoalId,
  SkillScore,
  TopicItem,
} from '@/types/assessment';
import { TopicProgress } from '@/types/learning';

export interface AdaptiveNotification {
  title: string;
  message: string;
  timestamp: number;
}

interface AssessmentContextValue {
  selectedGoal: PredefinedGoalId;
  customGoal: string;
  goalTitle: string;
  goalDescription: string;
  goalIcon: string;
  setSelectedGoal: (goalId: PredefinedGoalId) => void;
  setCustomGoal: (text: string) => void;
  questions: AssessmentQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  answers: Record<number, number>; // questionIndex -> selectedOptionIndex
  recordAnswer: (questionIndex: number, optionIndex: number) => void;
  isAssessmentCompleted: boolean;
  result: AssessmentResult | null;
  finishAssessment: () => AssessmentResult;
  resetAssessment: () => void;

  // Roadmap & Daily Learning State
  roadmap: TopicItem[];
  currentTopicId: string;
  setCurrentTopicId: (id: string) => void;
  currentTopic?: TopicItem;
  completedTopicIds: string[];
  completeTopic: (topicId: string) => void;
  adaptiveNotification: AdaptiveNotification | null;
  dismissNotification: () => void;

  // Topic Quiz & Learning Resource State
  topicScores: Record<string, number>;
  watchedResources: Record<string, boolean>;
  markResourceWatched: (resourceId: string) => void;
  recordQuizResult: (topicId: string, score: number) => void;

  // Adaptive Progress Management
  topicProgressMap: Record<string, TopicProgress>;
  getTopicProgress: (topicId: string) => TopicProgress;
  updateTopicProgress: (topicId: string, partial: Partial<TopicProgress>) => void;
  recordTopicQuizScore: (topicId: string, score: number) => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [selectedGoal, setSelectedGoal] = useState<PredefinedGoalId>('data-scientist');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Active Roadmap State
  const [roadmap, setRoadmap] = useState<TopicItem[]>(() => {
    return getRoadmapForGoal('data-scientist', '');
  });
  const [currentTopicId, setCurrentTopicId] = useState<string>('ds-5');
  const [adaptiveNotification, setAdaptiveNotification] = useState<AdaptiveNotification | null>(
    null
  );

  // Synchronize roadmap when goal changes
  useEffect(() => {
    const newRoadmap = getRoadmapForGoal(selectedGoal, customGoal);
    setRoadmap(newRoadmap);
    const curr = newRoadmap.find((t) => t.status === 'current') || newRoadmap[0];
    if (curr) {
      setCurrentTopicId(curr.id);
    }
  }, [selectedGoal, customGoal]);

  const completedTopicIds = useMemo(() => {
    return roadmap.filter((t) => t.status === 'completed').map((t) => t.id);
  }, [roadmap]);

  const currentTopic = useMemo(() => {
    return (
      roadmap.find((t) => t.id === currentTopicId) ||
      roadmap.find((t) => t.status === 'current') ||
      roadmap[0]
    );
  }, [roadmap, currentTopicId]);

  const dismissNotification = () => {
    setAdaptiveNotification(null);
  };

  const completeTopic = (topicId: string) => {
    setRoadmap((prevRoadmap) => {
      let nextTopicToActivate: TopicItem | null = null;
      let foundCurrent = false;

      const updated = prevRoadmap.map((t) => {
        if (t.id === topicId) {
          foundCurrent = true;
          return {
            ...t,
            status: 'completed' as const,
            progressPercent: 100,
          };
        }
        if (
          foundCurrent &&
          !nextTopicToActivate &&
          (t.status === 'upcoming' || t.status === 'locked')
        ) {
          nextTopicToActivate = t;
          return {
            ...t,
            status: 'current' as const,
            progressPercent: 0,
          };
        }
        return t;
      });

      if (nextTopicToActivate) {
        const nextId = (nextTopicToActivate as TopicItem).id;
        const nextTitle = (nextTopicToActivate as TopicItem).title;
        setCurrentTopicId(nextId);
        setAdaptiveNotification({
          title: 'Roadmap Re-Calibrated! ⚡',
          message: `Mastery confirmed for current module! Your AI agent evaluated your responses and unlocked "${nextTitle}".`,
          timestamp: Date.now(),
        });
      } else {
        setAdaptiveNotification({
          title: 'Roadmap Milestone Reached! 🏆',
          message:
            'Outstanding achievement! You have mastered all currently assigned modules for this curriculum.',
          timestamp: Date.now(),
        });
      }

      return updated;
    });
  };

  // Topic Quiz & Learning Resource State
  const [topicScores, setTopicScores] = useState<Record<string, number>>({});
  const [watchedResources, setWatchedResources] = useState<Record<string, boolean>>({});

  const markResourceWatched = (resourceId: string) => {
    setWatchedResources((prev) => ({
      ...prev,
      [resourceId]: true,
    }));
  };

  const recordQuizResult = (topicId: string, score: number) => {
    setTopicScores((prev) => ({
      ...prev,
      [topicId]: score,
    }));

    if (score >= 80) {
      // Score >= 80: Topic completed and next topic unlocked!
      completeTopic(topicId);
    } else if (score >= 60) {
      // Score 60-79: Topic remains active, recommend extra practice
      setRoadmap((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? {
                ...t,
                status: 'current' as const,
                progressPercent: 75,
                adaptiveReason:
                  'Score 60-79%: Solid attempt! Targeted review and 5 extra practice exercises recommended before re-testing.',
              }
            : t
        )
      );
      setAdaptiveNotification({
        title: 'Targeted Review Recommended ⚡',
        message:
          'Your quiz score was in the 60-79% range. A little more focused practice will solidify this concept.',
        timestamp: Date.now(),
      });
    } else {
      // Score < 60: Mark topic as "Needs Review", recommend AI explanation + extra practice + retest
      setRoadmap((prev) =>
        prev.map((t) =>
          t.id === topicId
            ? {
                ...t,
                status: 'needs_review' as const,
                progressPercent: 40,
                adaptiveReason:
                  'Score < 60%: Needs Review. AI explanation video, guided practice, and retest assigned.',
              }
            : t
        )
      );
      setAdaptiveNotification({
        title: 'Roadmap Adapted: Topic Needs Review ⚠️',
        message:
          'Your agent detected conceptual gaps on this topic. We have queued a 4-minute visual AI explanation and practice drills.',
        timestamp: Date.now(),
      });
    }
  };

  // Central Topic Progress State
  const [topicProgressMap, setTopicProgressMap] = useState<Record<string, TopicProgress>>({
    'ds-probability': {
      topicId: 'ds-probability',
      progress: 45,
      bestScore: 0,
      attempts: 0,
      status: 'in-progress',
      recommendedAction: 'Take the Probability Quiz',
    },
    'ds-5': {
      topicId: 'ds-5',
      progress: 45,
      bestScore: 0,
      attempts: 0,
      status: 'in-progress',
      recommendedAction: 'Take the Probability Quiz',
    },
  });

  const getTopicProgress = (topicId: string): TopicProgress => {
    if (topicProgressMap[topicId]) {
      return topicProgressMap[topicId];
    }
    const item = roadmap.find((t) => t.id === topicId);
    return {
      topicId,
      progress: item?.progressPercent || 0,
      bestScore: topicScores[topicId] || 0,
      attempts: topicScores[topicId] !== undefined ? 1 : 0,
      status:
        item?.status === 'completed'
          ? 'mastered'
          : item?.status === 'needs_review'
          ? 'needs-review'
          : item?.status === 'current'
          ? 'in-progress'
          : item?.status === 'upcoming'
          ? 'available'
          : 'locked',
    };
  };

  const updateTopicProgress = (topicId: string, partial: Partial<TopicProgress>) => {
    setTopicProgressMap((prev) => {
      const current = prev[topicId] || getTopicProgress(topicId);
      return {
        ...prev,
        [topicId]: {
          ...current,
          ...partial,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const recordTopicQuizScore = (topicId: string, score: number) => {
    const prevProg = getTopicProgress(topicId);
    const newBest = Math.max(prevProg.bestScore || 0, score);
    const attempts = (prevProg.attempts || 0) + 1;

    let newStatus: TopicProgress['status'] = 'in-progress';
    let recAction = '';

    if (score >= 80) {
      newStatus = 'mastered';
      recAction = 'Continue to Next Topic';
    } else if (score >= 60) {
      newStatus = 'in-progress';
      recAction = 'Practice Problems & Retake Quiz';
    } else {
      newStatus = 'needs-review';
      recAction = 'Review AI Explanation & Watch Video';
    }

    updateTopicProgress(topicId, {
      progress: score >= 80 ? 100 : score >= 60 ? 75 : 40,
      bestScore: newBest,
      lastQuizScore: score,
      attempts,
      status: newStatus,
      recommendedAction: recAction,
    });

    recordQuizResult(topicId, score);
  };

  // Active question bank according to selected goal
  const questions: AssessmentQuestion[] = useMemo(() => {
    return QUESTION_BANKS[selectedGoal] || QUESTION_BANKS['other'] || [];
  }, [selectedGoal]);

  const activeGoalObj = useMemo(() => {
    return GOAL_OPTIONS.find((g) => g.id === selectedGoal) || GOAL_OPTIONS[0];
  }, [selectedGoal]);

  const goalTitle = useMemo(() => {
    if (selectedGoal === 'other') {
      return customGoal.trim() ? customGoal.trim() : 'Custom Learning Path';
    }
    return activeGoalObj.title;
  }, [selectedGoal, customGoal, activeGoalObj]);

  const goalDescription = useMemo(() => {
    if (selectedGoal === 'other') {
      return customGoal.trim()
        ? `Custom curriculum tailored for ${customGoal.trim()}`
        : 'Tell us what you want to learn.';
    }
    return activeGoalObj.description;
  }, [selectedGoal, customGoal, activeGoalObj]);

  const goalIcon = useMemo(() => {
    return activeGoalObj.icon;
  }, [activeGoalObj]);

  const recordAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const calculateResult = (): AssessmentResult => {
    const totalQuestions = questions.length || 10;
    let correctCount = 0;

    // Group scores by skill
    const skillStats: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected !== undefined && selected === q.correctAnswerIndex;

      if (isCorrect) {
        correctCount += 1;
      }

      if (!skillStats[q.skill]) {
        skillStats[q.skill] = { correct: 0, total: 0 };
      }
      skillStats[q.skill].total += 1;
      if (isCorrect) {
        skillStats[q.skill].correct += 1;
      }
    });

    const overallScore = Math.round((correctCount / totalQuestions) * 100);

    const skillScores: SkillScore[] = Object.keys(skillStats).map((skillName) => {
      const { correct, total } = skillStats[skillName];
      const percentage = Math.round((correct / total) * 100);
      return {
        skill: skillName,
        correctCount: correct,
        totalCount: total,
        percentage,
      };
    });

    // Determine strengths (>= 60%) and focus areas (< 60%)
    const strengths: string[] = [];
    const focusAreas: string[] = [];

    skillScores.forEach((s) => {
      if (s.percentage >= 60) {
        strengths.push(`${s.skill} Fundamentals`);
      } else {
        focusAreas.push(s.skill);
      }
    });

    // Edge cases if all are high or all low
    if (strengths.length === 0) {
      strengths.push('Conceptual Motivation & Problem Solving');
    }
    if (focusAreas.length === 0) {
      focusAreas.push('Advanced Topics & Applied Projects');
    }

    const calculated: AssessmentResult = {
      overallScore,
      correctAnswersCount: correctCount,
      totalQuestions,
      skillScores,
      strengths,
      focusAreas,
      goalId: selectedGoal,
      goalTitle,
    };

    setResult(calculated);
    setIsAssessmentCompleted(true);
    return calculated;
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsAssessmentCompleted(false);
    setResult(null);
  };

  return (
    <AssessmentContext.Provider
      value={{
        selectedGoal,
        customGoal,
        goalTitle,
        goalDescription,
        goalIcon,
        setSelectedGoal,
        setCustomGoal,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        recordAnswer,
        isAssessmentCompleted,
        result,
        finishAssessment: calculateResult,
        resetAssessment,
        roadmap,
        currentTopicId,
        setCurrentTopicId,
        currentTopic,
        completedTopicIds,
        completeTopic,
        adaptiveNotification,
        dismissNotification,
        topicScores,
        watchedResources,
        markResourceWatched,
        recordQuizResult,
        topicProgressMap,
        getTopicProgress,
        updateTopicProgress,
        recordTopicQuizScore,
      }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
