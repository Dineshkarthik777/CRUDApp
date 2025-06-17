export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  genre: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
}