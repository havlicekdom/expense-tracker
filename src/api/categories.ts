import type { Category } from '../types';
import { findHighestId } from '../utils';

const categories: Category[] = JSON.parse(localStorage.getItem('categories') ?? '[]');

const saveCategories = (updatedCategories: Category[]) => {
  localStorage.setItem('categories', JSON.stringify(updatedCategories));
};

export const getCategories = () => categories;

export const addCategory = (category: Category) => {
  category.id = categories.length > 0 ? findHighestId(categories) + 1 : 0;
  categories.push(category);
  saveCategories(categories);
};

export const removeCategory = (category: Category) => {
  const indexOfCategory = categories.findIndex((item) => item.id === category.id);
  categories.splice(indexOfCategory, 1);
  saveCategories(categories);
};

export const updateCategory = (category: Category) => {
  const indexOfCategory = categories.findIndex((item) => item.id === category.id);
  categories.splice(indexOfCategory, 1, category);
  saveCategories(categories);
};
