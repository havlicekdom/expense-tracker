import React, { useContext, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { AuthContext } from './context/AuthContext';
import { CategoryContext } from './context/CategoryContext';
import { MoneyRecordContext } from './context/MoneyRecordContext';
import UserDashboard from './components/UserDashboard';

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
        {user && (
          <UserDashboard />
        )}
      </Container>
    </div>
  );
}

export default App;
