import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type BookRow = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

interface Book {
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

interface BookContextType {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  addBook: (bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBook: (id: string, bookData: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  refreshBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}

interface BookProviderProps {
  children: ReactNode;
}

export function BookProvider({ children }: BookProviderProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert database row to Book interface
  const mapRowToBook = (row: BookRow): Book => ({
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description || '',
    genre: row.genre || undefined,
    condition: row.condition,
    notes: row.notes || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });

  // Fetch all books from database
  const fetchBooks = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedBooks = data?.map(mapRowToBook) || [];
      setBooks(mappedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (bookData: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const insertData: BookInsert = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description || null,
        genre: bookData.genre || null,
        condition: bookData.condition,
        notes: bookData.notes || null,
      };

      const { data, error } = await supabase
        .from('books')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const newBook = mapRowToBook(data);
      setBooks(prev => [newBook, ...prev]);
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err instanceof Error ? err.message : 'Failed to add book');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async (id: string, bookData: Partial<Book>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updateData: BookUpdate = {};
      
      if (bookData.title !== undefined) updateData.title = bookData.title;
      if (bookData.author !== undefined) updateData.author = bookData.author;
      if (bookData.description !== undefined) updateData.description = bookData.description || null;
      if (bookData.genre !== undefined) updateData.genre = bookData.genre || null;
      if (bookData.condition !== undefined) updateData.condition = bookData.condition;
      if (bookData.notes !== undefined) updateData.notes = bookData.notes || null;

      const { data, error } = await supabase
        .from('books')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedBook = mapRowToBook(data);
      setBooks(prev => prev.map(book => 
        book.id === id ? updatedBook : book
      ));
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err instanceof Error ? err.message : 'Failed to update book');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete book');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBooks = async () => {
    await fetchBooks();
  };

  const value: BookContextType = {
    books,
    isLoading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refreshBooks,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}