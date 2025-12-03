import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryDashboard } from './CategoryDashboard';
import { CategoryProvider } from './CategoryContext';
import * as api from './api';

// Mock the api module
vi.mock('./api', () => ({
  getCategories: vi.fn(() => []),
  addCategory: vi.fn(),
  removeCategory: vi.fn(),
  updateCategory: vi.fn(),
}));

const mockAddCategory = vi.mocked(api.addCategory);
const mockGetCategories = vi.mocked(api.getCategories);

describe('CategoryDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCategories.mockReturnValue([]);
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <CategoryProvider>
        <CategoryDashboard />
      </CategoryProvider>
    );
  };

  const findAddButton = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.find(btn => {
      const el = btn as HTMLButtonElement;
      return btn.textContent?.includes('Add new category') && el.type !== 'submit';
    });
  };

  const findSubmitButton = (text: string) => {
    const buttons = screen.getAllByRole('button');
    return buttons.find(btn => {
      const el = btn as HTMLButtonElement;
      return el.type === 'submit' && btn.textContent?.includes(text);
    });
  };

  const getNameInput = () => {
    return document.querySelector('input[name="name"]') as HTMLInputElement;
  };

  const getLabelInput = () => {
    return document.querySelector('input[name="label"]') as HTMLInputElement;
  };

  describe('Rendering', () => {
    it('should render the categories heading', () => {
      renderComponent();
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    it('should render the add button', () => {
      renderComponent();
      expect(findAddButton()).toBeInTheDocument();
    });

    it('should render an empty list initially', () => {
      renderComponent();
      const list = screen.getByRole('list');
      expect(list.children).toHaveLength(0);
    });
  });

  describe('Add Category Dialog', () => {
    it('should open dialog when add button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should show form dialog with heading', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog.textContent).toContain('Add new category');
      });
    });

    it('should close dialog on escape key', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should have input fields in dialog', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
        expect(getLabelInput()).toBeInTheDocument();
      });
    });

    it('should have submit button in dialog', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(findSubmitButton('Add new category')).toBeInTheDocument();
      });
    });
  });

  describe('Add Category Submission', () => {
    it('should call addCategory with valid data', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
      });

      const nameInput = getNameInput();
      const labelInput = getLabelInput();
      
      await user.type(nameInput, 'food');
      await user.type(labelInput, 'Food & Groceries');
      
      const submitButton = findSubmitButton('Add new category')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockAddCategory).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'food',
            label: 'Food & Groceries',
          })
        );
      });
    });

    it('should close dialog after successful submission', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
      });

      const nameInput = getNameInput();
      const labelInput = getLabelInput();
      
      await user.type(nameInput, 'transport');
      await user.type(labelInput, 'Transportation');
      
      const submitButton = findSubmitButton('Add new category')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty name', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getLabelInput()).toBeInTheDocument();
      });

      const labelInput = getLabelInput();
      await user.type(labelInput, 'Food');
      
      const submitButton = findSubmitButton('Add')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be one lowercase word/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty label', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
      });

      const nameInput = getNameInput();
      await user.type(nameInput, 'food');
      
      const submitButton = findSubmitButton('Add')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter the category label/i)).toBeInTheDocument();
      });
    });

    it('should show error for uppercase in name', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
      });

      const nameInput = getNameInput();
      const labelInput = getLabelInput();
      
      await user.type(nameInput, 'Food');
      await user.type(labelInput, 'Food');
      
      const submitButton = findSubmitButton('Add')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be one lowercase word/i)).toBeInTheDocument();
      });
    });

    it('should show error for spaces in name', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
      });

      const nameInput = getNameInput();
      const labelInput = getLabelInput();
      
      await user.type(nameInput, 'fast food');
      await user.type(labelInput, 'Fast Food');
      
      const submitButton = findSubmitButton('Add')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be one lowercase word/i)).toBeInTheDocument();
      });
    });

    it('should not call addCategory on validation error', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const addButton = findAddButton()!;
      await user.click(addButton);
      
      await waitFor(() => {
        expect(getNameInput()).toBeInTheDocument();
      });

      const nameInput = getNameInput();
      await user.type(nameInput, 'Food');
      
      const submitButton = findSubmitButton('Add')!;
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockAddCategory).not.toHaveBeenCalled();
      });
    });
  });
});
