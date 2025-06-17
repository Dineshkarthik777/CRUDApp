/*
  # Create books table for personal library

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `author` (text, required)
      - `description` (text, optional)
      - `genre` (text, optional)
      - `condition` (text, required - excellent/good/fair/poor)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `books` table
    - Add policy for public access (since it's a single-user app)
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text DEFAULT '',
  genre text DEFAULT '',
  condition text NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (single user app)
CREATE POLICY "Allow all operations on books"
  ON books
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO books (title, author, description, genre, condition, notes) VALUES
  (
    'The Great Gatsby',
    'F. Scott Fitzgerald',
    'A classic American novel about the Jazz Age and the American Dream. This book explores themes of wealth, love, idealism, and moral decay in the 1920s.',
    'Classic Literature',
    'good',
    'First edition, inherited from grandmother. Beautiful prose.'
  ),
  (
    'To Kill a Mockingbird',
    'Harper Lee',
    'A powerful story about racial injustice and moral growth in the Deep South, told through the eyes of young Scout Finch.',
    'Classic Literature',
    'excellent',
    'Book club selection. Profound impact on my understanding of justice.'
  ),
  (
    'Dune',
    'Frank Herbert',
    'Epic science fiction novel set in the distant future amidst a feudal interstellar society.',
    'Science Fiction',
    'fair',
    'Amazing world-building. Need to read the sequels.'
  ),
  (
    'Pride and Prejudice',
    'Jane Austen',
    'A romantic novel about Elizabeth Bennet and Mr. Darcy, exploring themes of love, reputation, and class.',
    'Romance',
    'good',
    'Wit and social commentary still relevant today.'
  ),
  (
    'The Catcher in the Rye',
    'J.D. Salinger',
    'A coming-of-age story about teenage rebellion and alienation in 1950s New York.',
    'Classic Literature',
    'poor',
    'Well-worn copy from high school. Controversial but important.'
  );