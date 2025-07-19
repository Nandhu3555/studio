# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Supabase Setup

This project uses Supabase for the database and authentication. To set up Supabase:

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from the project settings
3. Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
4. Run the migration to create the database schema:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase/migrations/create_initial_schema.sql`
   - Run the migration

## Features

- **Authentication**: Email/password authentication with Supabase Auth
- **Database**: PostgreSQL database with Row Level Security (RLS)
- **Real-time**: Real-time subscriptions for live updates
- **File Storage**: Supabase Storage for book covers and documents
- **Admin Panel**: Admin interface for managing books and users
- **Search**: Full-text search across books and question papers

## Database Schema

The application uses the following main tables:
- `users` - User profiles and authentication
- `books` - Book catalog with metadata
- `remarks` - User comments on books
- `question_papers` - Exam question papers
- `categories` - Book categories
- `branches` - Academic branches