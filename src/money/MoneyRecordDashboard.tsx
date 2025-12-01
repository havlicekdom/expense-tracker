import { useContext, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MoneyRecordContext } from "./MoneyRecordContext";
import { MoneyRecord } from "../types";
import { MoneyRecordForm } from "./MoneyRecordForm";
import { MoneyRecordList } from "./MoneyRecordList";
import { AddEntityButton } from "./AddEntityButton";

export function MoneyRecordDashboard() {
  const [open, setOpen] = useState(false);
  const [editingMoneyRecord, setEditingMoneyRecord] = useState<MoneyRecord>();
  const { addMoneyRecord, editMoneyRecord, removeMoneyRecord } =
    useContext(MoneyRecordContext);

  const isEditing = () => !!editingMoneyRecord;

  const handleEditClick = (category: MoneyRecord) => {
    setEditingMoneyRecord(category);
    setOpen(true);
  };

  const handleDeleteClick = (category: MoneyRecord) => {
    removeMoneyRecord(category);
  };

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMoneyRecord(undefined);
  };

  const onSubmit: SubmitHandler<MoneyRecord> = (data) => {
    if (isEditing()) {
      editMoneyRecord(data);
    } else {
      addMoneyRecord(data);
    }

    handleClose();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography component="h4" variant="h4" sx={{ mb: 4 }}>
        Your records
      </Typography>
      <AddEntityButton handleAddClick={handleAddClick} text="Add new record" />
      <MoneyRecordList
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
      <MoneyRecordForm
        open={open}
        handleClose={handleClose}
        submitHandler={onSubmit}
        actionTitle={isEditing() ? "Edit" : "Add new"}
        moneyRecord={editingMoneyRecord}
      />
    </Box>
  );
}
