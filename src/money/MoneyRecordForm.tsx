/* eslint-disable react/jsx-props-no-spreading */
import { useContext, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Unstable_Grid2";

import FormHelperText from "@mui/material/FormHelperText";
import { CategoryContext } from "../category/CategoryContext";
import { MoneyRecord } from "../types";

type Props = {
  open: boolean;
  handleClose: () => void;
  submitHandler: SubmitHandler<MoneyRecord>;
  actionTitle: "Add new" | "Edit";
  moneyRecord?: MoneyRecord | null;
};

const schema = yup
  .object({
    value: yup
      .number()
      .min(1, "You must enter positive, non-zero value")
      .required("Please enter the value"),
    category: yup.number().required("Please select a category"),
    date: yup.string().required("Please enter the date"),
    info: yup.string().required("Please enter the info"),
  })
  .required();

export function MoneyRecordForm({
  open,
  handleClose,
  submitHandler,
  actionTitle,
  moneyRecord = null,
}: Props) {
  const { categories } = useContext(CategoryContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MoneyRecord>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (moneyRecord) {
      (Object.keys(moneyRecord) as (keyof MoneyRecord)[]).forEach((key) => {
        setValue(key, moneyRecord[key]);
      });
    }
  }, [moneyRecord]);

  const onSubmit: SubmitHandler<MoneyRecord> = (data) => {
    submitHandler(data);
    reset();
  };

  const onClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${actionTitle} money record`}</DialogTitle>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("id")} />
        <DialogContent>
          <Grid container>
            <Grid xs={12} md={6}>
              <FormControl>
                <FormLabel>Record type</FormLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="expense"
                        control={<Radio />}
                        label="Expense"
                      />
                      <FormControlLabel
                        value="income"
                        control={<Radio />}
                        label="Income"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select label="Category" {...field}>
                      {categories.map((category) => (
                        <MenuItem
                          value={category.id ?? ""}
                          key={category.id ?? 0}
                        >
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.category && (
                  <FormHelperText>{errors.category?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Value"
            error={!!errors.value}
            helperText={errors.value?.message}
            required
            {...register("value")}
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Date"
            error={!!errors.date}
            helperText={errors.date?.message}
            required
            {...register("date")}
          />
          <TextField
            variant="standard"
            margin="normal"
            fullWidth
            label="Info"
            error={!!errors.info}
            helperText={errors.info?.message}
            required
            {...register("info")}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" sx={{ ml: 2 }}>
            {`${actionTitle} money record`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
