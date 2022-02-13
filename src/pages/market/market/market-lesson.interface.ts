export interface IMarketLesson {
  id: string;
  title: string;
  description?: string;
  cid: string;
  previewCID?: string;
  type: 'video' | 'audio' | 'pdf';
  author: {
    id: string;
    email: string;
  };
}

export interface IMarketLessonsQueryParams {
  page?: string;
  pageSize?: string;
  video?: string;
  audio?: string;
  pdf?: string;
}
