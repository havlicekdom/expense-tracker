/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Category } from "../types";

type Props = {
  open: boolean;
  handleClose: () => void;
  submitHandler: SubmitHandler<Category>;
  actionTitle: "Add new" | "Edit";
  category?: Category | null;
};

const schema = yup
  .object({
    name: yup
      .string()
      .matches(/^[a-z]+$/, "Name must be one lowercase word")
      .required("Please enter the category name"),
    label: yup.string().required("Please enter the category label"),
  })
  .required();

export function CategoryForm({
  open,
  handleClose,
  submitHandler,
  actionTitle,
  category = null,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Category>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (category) {
      (Object.keys(category) as (keyof Category)[]).forEach((key) => {
        setValue(key, category[key]);
      });
    }
  }, [category]);

  const onSubmit: SubmitHandler<Category> = (data) => {
    submitHandler(data);
    reset();
  };

  const onClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${actionTitle} category`}</DialogTitle>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("id")} />
        <DialogContent>
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            required
            {...register("name")}
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Label"
            error={!!errors.label}
            helperText={errors.label?.message}
            required
            {...register("label")}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" sx={{ ml: 2 }}>
            {`${actionTitle} category`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
