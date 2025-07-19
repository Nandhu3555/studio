/*
  # Create initial schema for B-Tech Lib

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `branch` (text)
      - `year` (integer)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
    
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `description` (text)
      - `category` (text)
      - `image_url` (text)
      - `document_url` (text)
      - `likes` (integer, default 0)
      - `dislikes` (integer, default 0)
      - `year` (integer)
      - `study_year` (integer)
      - `rating` (numeric, default 0)
      - `language` (text, default 'English')
      - `pages` (integer, default 0)
      - `publisher` (text)
      - `summary` (text, nullable)
      - `created_at` (timestamp)
    
    - `remarks`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `text` (text)
      - `created_at` (timestamp)
    
    - `question_papers`
      - `id` (uuid, primary key)
      - `subject` (text)
      - `year` (integer)
      - `semester` (text)
      - `exam_type` (text)
      - `branch` (text)
      - `study_year` (text)
      - `document_url` (text)
      - `created_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    
    - `branches`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  branch text NOT NULL,
  year integer NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  document_url text NOT NULL,
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  year integer NOT NULL,
  study_year integer NOT NULL,
  rating numeric DEFAULT 0,
  language text DEFAULT 'English',
  pages integer DEFAULT 0,
  publisher text NOT NULL,
  summary text,
  created_at timestamptz DEFAULT now()
);

-- Create remarks table
CREATE TABLE IF NOT EXISTS remarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create question_papers table
CREATE TABLE IF NOT EXISTS question_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  year integer NOT NULL,
  semester text NOT NULL,
  exam_type text NOT NULL,
  branch text NOT NULL,
  study_year text NOT NULL,
  document_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE remarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for books table
CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete books"
  ON books
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for remarks table
CREATE POLICY "Anyone can read remarks"
  ON remarks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert remarks"
  ON remarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own remarks"
  ON remarks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own remarks"
  ON remarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for question_papers table
CREATE POLICY "Anyone can read question papers"
  ON question_papers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert question papers"
  ON question_papers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update question papers"
  ON question_papers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete question papers"
  ON question_papers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for categories table
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for branches table
CREATE POLICY "Anyone can read branches"
  ON branches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert branches"
  ON branches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update branches"
  ON branches
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete branches"
  ON branches
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO categories (name) VALUES 
  ('Computer Science'),
  ('Mechanical'),
  ('Electronics'),
  ('Civil'),
  ('Mathematics')
ON CONFLICT (name) DO NOTHING;

-- Insert default branches
INSERT INTO branches (name) VALUES 
  ('Computer Science'),
  ('Mechanical'),
  ('Electronics'),
  ('Civil')
ON CONFLICT (name) DO NOTHING;