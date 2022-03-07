export interface ILearnerDashboardLesson {
  type: ILearnerDashboardLessonType;
  lessonId: string;
  likeAuthor: string;
  previewCID: string;
  title: string;
  created: string;
}

export type ILearnerDashboardLessonType = 'audio' | 'video' | 'pdf';
