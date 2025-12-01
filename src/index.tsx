import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { CategoryProvider } from './category/CategoryContext';
import { MoneyRecordProvider } from './money/MoneyRecordContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CategoryProvider>
        <MoneyRecordProvider>
          <App />
        </MoneyRecordProvider>
      </CategoryProvider>
    </AuthProvider>
  </React.StrictMode>,
);