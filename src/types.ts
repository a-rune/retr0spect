export interface Course {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  hours: number;
  isModule: boolean;
  topics: string[];
}

export interface CourseWithTerm extends Course {
  term: string;
}

export interface TopicData {
  theory: number;
  notes?: string;
  links?: string[];
}

/** Row from olifog/tripospro `questions.json`. */
export interface TriposQuestion {
  year: string | number;
  paper: string | number;
  question: string | number;
  topic: string;
  pdf?: string;
  solutions?: string;
}
