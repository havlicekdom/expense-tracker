import React, { useMemo, useState } from 'react';
import * as api from './api';
import type { Category } from '../types';

type AddCategoryFn = (category: Category) => void;
type RemoveCategoryFn = (category: Category) => void;
type EditCategoryFn = (category: Category) => void;
type GetCategoriesFn = () => void;

type InitialState = {
  categories: Category[],
  addCategory: AddCategoryFn,
  removeCategory: RemoveCategoryFn,
  editCategory: EditCategoryFn,
  getCategories: GetCategoriesFn,
};

const initialState: InitialState = {
  categories: [],
  addCategory: () => ({}),
  removeCategory: () => ({}),
  editCategory: () => ({}),
  getCategories: () => ({}),
};

const CategoryContext = React.createContext(initialState);

CategoryContext.displayName = 'CategoryContext';

function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  const categoryContextValues = useMemo(() => {
    const getCategories: GetCategoriesFn = () => {
      setCategories([...api.getCategories()]);
    };

    const addCategory: AddCategoryFn = (category) => {
      api.addCategory(category);
      getCategories();
    };

    const removeCategory: RemoveCategoryFn = (category) => {
      api.removeCategory(category);
      getCategories();
    };

    const editCategory: EditCategoryFn = (category) => {
      api.updateCategory(category);
      getCategories();
    };

    return {
      categories,
      getCategories,
      addCategory,
      removeCategory,
      editCategory,
    };
  }, [categories]);

  return (
    <CategoryContext.Provider value={categoryContextValues}>
      { children }
    </CategoryContext.Provider>
  );
}

export { CategoryContext, CategoryProvider };
