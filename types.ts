
export interface Note {
  id: string;
  projectId: string;
  branchId: string;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
}

export interface Branch {
  id: string;
  name: string;
  isMain: boolean;
  parentId?: string; // ID of the parent branch
  notes: string[]; // Note IDs
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  branches: Branch[];
}

export enum SummaryLength {
  Short = 'সংক্ষিপ্ত',
  Medium = 'মাঝারি',
  Detailed = 'বিস্তারিত',
}

export interface AIConfig {
  model: string;
  temperature: number;
  topP: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface DeepInsight {
  text: string;
  sources: GroundingSource[];
}
