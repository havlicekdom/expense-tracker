import { useContext, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Typography from "@mui/material/Typography";
import { Category } from "../types";
import { CategoryContext } from "./CategoryContext";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";
import { AddEntityButton } from "../common/AddEntityButton";

export function CategoryDashboard() {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category>();
  const { addCategory, editCategory, removeCategory } =
    useContext(CategoryContext);

  const isEditing = () => !!editingCategory;

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    removeCategory(category);
  };

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(undefined);
  };

  const onSubmit: SubmitHandler<Category> = (data) => {
    if (isEditing()) {
      editCategory(data);
    } else {
      addCategory(data);
    }

    handleClose();
  };

  return (
    <div>
      <Typography component="h5" variant="h5" sx={{ mt: 2, mb: 4 }}>
        Categories
      </Typography>
      <AddEntityButton
        handleAddClick={handleAddClick}
        text="Add new category"
      />
      <CategoryList
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <CategoryForm
        open={open}
        handleClose={handleClose}
        submitHandler={onSubmit}
        actionTitle={isEditing() ? "Edit" : "Add new"}
        category={editingCategory}
      />
    </div>
  );
}
