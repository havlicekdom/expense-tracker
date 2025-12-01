import { useContext, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Header } from "./common/Header";
import { LoginForm } from "./auth/LoginForm";
import { AuthContext } from "./auth/AuthContext";
import { CategoryContext } from "./category/CategoryContext";
import { MoneyRecordContext } from "./money/MoneyRecordContext";
import { UserDashboard } from "./common/UserDashboard";

function App() {
  const { user } = useContext(AuthContext);
  const { getCategories } = useContext(CategoryContext);
  const { getMoneyRecords } = useContext(MoneyRecordContext);

  useEffect(() => {
    if (user) {
      getCategories();
      getMoneyRecords();
    }
  }, [user]);

  return (
    <div>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        {!user && <LoginForm />}
        {user && <UserDashboard />}
      </Container>
    </div>
  );
}

export default App;
