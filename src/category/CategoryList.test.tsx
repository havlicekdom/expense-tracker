import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryList } from './CategoryList';
import { CategoryContext } from './CategoryContext';
import type { Category } from '../types';

describe('CategoryList', () => {
  const mockHandleEditClick = vi.fn();
  const mockHandleDeleteClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCategoryList = (categories: Category[] = []) => {
    const mockContextValue = {
      categories,
      addCategory: vi.fn(),
      removeCategory: vi.fn(),
      editCategory: vi.fn(),
      getCategories: vi.fn(),
    } as any;

    return render(
      <CategoryContext.Provider value={mockContextValue}>
        <CategoryList
          handleEditClick={mockHandleEditClick}
          handleDeleteClick={mockHandleDeleteClick}
        />
      </CategoryContext.Provider>
    );
  };

  it('renders empty list when no categories', () => {
    renderCategoryList([]);
    const list = screen.getByRole('list');
    expect(list.children).toHaveLength(0);
  });

  it('renders list items for categories', () => {
    const categories: Category[] = [
      { id: 1, name: 'food', label: 'Food & Groceries' },
      { id: 2, name: 'transport', label: 'Transportation' },
    ];

    renderCategoryList(categories);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });

  it('displays category labels', () => {
    const categories: Category[] = [{ id: 1, name: 'food', label: 'Food & Groceries' }];
    renderCategoryList(categories);
    expect(screen.getByText('Food & Groceries')).toBeInTheDocument();
  });

  it('calls edit handler when edit button clicked', async () => {
    const user = userEvent.setup();
    const categories: Category[] = [{ id: 1, name: 'food', label: 'Food & Groceries' }];
    renderCategoryList(categories);

    const listItem = screen.getByRole('listitem');
    const buttons = within(listItem).getAllByRole('button');
    const editButton = buttons[0];

    await user.click(editButton);
    expect(mockHandleEditClick).toHaveBeenCalledWith(categories[0]);
  });

  it('calls delete handler when delete button clicked', async () => {
    const user = userEvent.setup();
    const categories: Category[] = [{ id: 1, name: 'food', label: 'Food & Groceries' }];
    renderCategoryList(categories);

    const listItem = screen.getByRole('listitem');
    const buttons = within(listItem).getAllByRole('button');
    const deleteButton = buttons[1];

    await user.click(deleteButton);
    expect(mockHandleDeleteClick).toHaveBeenCalledWith(categories[0]);
  });

  it('renders many categories efficiently', () => {
    const categories: Category[] = Array.from({ length: 20 }, (_, i) => ({ id: i, name: `c${i}`, label: `Category ${i}` }));
    renderCategoryList(categories);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(20);
    expect(screen.getByText('Category 0')).toBeInTheDocument();
    expect(screen.getByText('Category 19')).toBeInTheDocument();
  });

  it('updates when context changes (rerender)', () => {
    const { rerender } = render(
      <CategoryContext.Provider value={{ categories: [], addCategory: vi.fn(), removeCategory: vi.fn(), editCategory: vi.fn(), getCategories: vi.fn() }}>
        <CategoryList handleEditClick={mockHandleEditClick} handleDeleteClick={mockHandleDeleteClick} />
      </CategoryContext.Provider>
    );

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    const categories: Category[] = [{ id: 1, name: 'food', label: 'Food & Groceries' }];

    rerender(
      <CategoryContext.Provider value={{ categories, addCategory: vi.fn(), removeCategory: vi.fn(), editCategory: vi.fn(), getCategories: vi.fn() }}>
        <CategoryList handleEditClick={mockHandleEditClick} handleDeleteClick={mockHandleDeleteClick} />
      </CategoryContext.Provider>
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Food & Groceries')).toBeInTheDocument();
  });
});
