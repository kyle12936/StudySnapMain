import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx';
import Register from './Register.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import Dashboard from './Dashboard.tsx';
import { AuthProvider } from './AuthProvider.tsx';
import { UserProvider } from './UserContext.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Deck from './Deck.tsx';
import { User } from 'lucide-react';



const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
    children: [
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "Register",
        element: <Register/>,
      },
      {
        path: "Dashboard",
        element: (
          //<ProtectedRoute>
            <Dashboard />
          //</ProtectedRoute>
        ),
      },
      {
        path: "Deck",
        element: (
          //<ProtectedRoute>
            <Deck />
          //</ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
