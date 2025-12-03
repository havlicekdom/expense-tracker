import { beforeEach, describe, it, expect, vi } from 'vitest';
import type { Category } from '../types';

describe('Category API', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('getCategories should return an empty array when localStorage is empty', async () => {
    const { getCategories } = await import('./api');
    const result = getCategories();
    expect(result).toEqual([]);
  });

  it('getCategories should return categories from localStorage', async () => {
    const mockCategories: Category[] = [
      { id: 0, label: 'Food', name: 'food' },
      { id: 1, label: 'Transport', name: 'transport' },
    ];
    localStorage.setItem('categories', JSON.stringify(mockCategories));
    vi.resetModules();
    
    const { getCategories } = await import('./api');
    const result = getCategories();
    expect(result).toEqual(mockCategories);
  });

  it('addCategory should add a category with id 0 when categories array is empty', async () => {
    const { addCategory, getCategories } = await import('./api');
    const newCategory: Category = { id: 0, label: 'Food', name: 'food' };
    addCategory(newCategory);
    
    const categories = getCategories();
    expect(categories).toHaveLength(1);
    expect(categories[0]).toEqual({ id: 0, label: 'Food', name: 'food' });
  });

  it('addCategory should increment id when adding to non-empty categories', async () => {
    const { addCategory, getCategories } = await import('./api');
    const firstCategory: Category = { id: 0, label: 'Food', name: 'food' };
    const secondCategory: Category = { id: 0, label: 'Transport', name: 'transport' };
    
    addCategory(firstCategory);
    addCategory(secondCategory);
    
    const categories = getCategories();
    expect(categories).toHaveLength(2);
    expect(categories[0].id).toBe(0);
    expect(categories[1].id).toBe(1);
  });

  it('addCategory should persist categories to localStorage', async () => {
    const { addCategory } = await import('./api');
    const category: Category = { id: 0, label: 'Food', name: 'food' };
    addCategory(category);
    
    const stored = JSON.parse(localStorage.getItem('categories') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].label).toBe('Food');
  });

  it('addCategory should handle adding multiple categories with correct ids', async () => {
    const { addCategory, getCategories } = await import('./api');
    const categories: Category[] = [
      { id: 0, label: 'Food', name: 'food' },
      { id: 0, label: 'Transport', name: 'transport' },
      { id: 0, label: 'Entertainment', name: 'entertainment' },
    ];
    
    categories.forEach(cat => addCategory(cat));
    
    const result = getCategories();
    expect(result).toHaveLength(3);
    expect(result.map((c: Category) => c.id)).toEqual([0, 1, 2]);
  });

  it('removeCategory should remove a category by id', async () => {
    const { addCategory, removeCategory, getCategories } = await import('./api');
    const category1: Category = { id: 0, label: 'Food', name: 'food' };
    const category2: Category = { id: 1, label: 'Transport', name: 'transport' };
    
    addCategory(category1);
    addCategory(category2);
    
    removeCategory(category1);
    
    const categories = getCategories();
    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe(1);
  });

  it('removeCategory should persist removal to localStorage', async () => {
    const { addCategory, removeCategory } = await import('./api');
    const category: Category = { id: 0, label: 'Food', name: 'food' };
    addCategory(category);
    removeCategory(category);
    
    const stored = JSON.parse(localStorage.getItem('categories') || '[]');
    expect(stored).toHaveLength(0);
  });

  it('removeCategory should handle removing from middle of array', async () => {
    const { addCategory, removeCategory, getCategories } = await import('./api');
    const categories: Category[] = [
      { id: 0, label: 'Food', name: 'food' },
      { id: 1, label: 'Transport', name: 'transport' },
      { id: 2, label: 'Entertainment', name: 'entertainment' },
    ];
    
    categories.forEach(cat => addCategory(cat));
    removeCategory(categories[1]);
    
    const result = getCategories();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(0);
    expect(result[1].id).toBe(2);
  });

  it('updateCategory should update a category by id', async () => {
    const { addCategory, updateCategory, getCategories } = await import('./api');
    const original: Category = { id: 0, label: 'Food', name: 'food' };
    addCategory(original);
    
    const updated: Category = { id: 0, label: 'Groceries', name: 'groceries' };
    updateCategory(updated);
    
    const categories = getCategories();
    expect(categories[0]).toEqual(updated);
  });

  it('updateCategory should persist update to localStorage', async () => {
    const { addCategory, updateCategory } = await import('./api');
    const original: Category = { id: 0, label: 'Food', name: 'food' };
    addCategory(original);
    
    const updated: Category = { id: 0, label: 'Groceries', name: 'groceries' };
    updateCategory(updated);
    
    const stored = JSON.parse(localStorage.getItem('categories') || '[]');
    expect(stored[0].label).toBe('Groceries');
  });

  it('updateCategory should update category in middle of array without affecting others', async () => {
    const { addCategory, updateCategory, getCategories } = await import('./api');
    const categories: Category[] = [
      { id: 0, label: 'Food', name: 'food' },
      { id: 1, label: 'Transport', name: 'transport' },
      { id: 2, label: 'Entertainment', name: 'entertainment' },
    ];
    
    categories.forEach(cat => addCategory(cat));
    
    const updated: Category = { id: 1, label: 'Taxi', name: 'taxi' };
    updateCategory(updated);
    
    const result = getCategories();
    expect(result).toHaveLength(3);
    expect(result[1]).toEqual(updated);
    expect(result[0].label).toBe('Food');
    expect(result[2].label).toBe('Entertainment');
  });

  it('updateCategory should handle updating last category in array', async () => {
    const { addCategory, updateCategory, getCategories } = await import('./api');
    const categories: Category[] = [
      { id: 0, label: 'Food', name: 'food' },
      { id: 1, label: 'Transport', name: 'transport' },
    ];
    
    categories.forEach(cat => addCategory(cat));
    
    const updated: Category = { id: 1, label: 'Public Transport', name: 'public_transport' };
    updateCategory(updated);
    
    const result = getCategories();
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(updated);
  });
});
