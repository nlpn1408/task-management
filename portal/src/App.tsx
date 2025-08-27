// src/App.tsx
import { Link, Route, Routes } from "react-router-dom";
import Confirm from "./components/pages/Confirm";
import HomePage from "./components/pages/HomePage";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import { useAuth } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";

function App() {
  const { token, logout } = useAuth();

  const HomePageWithProvider = () => (
    <TaskProvider>
      <HomePage />
    </TaskProvider>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <nav className="p-4 border-b flex justify-between">
        <div>
          <Link to="/" className="mr-4">
            Home
          </Link>
          <Link to="/signup" className="mr-4">
            Signup
          </Link>
          <Link to="/confirm" className="mr-4">
            Confirm
          </Link>
          <Link to="/login">Login</Link>
        </div>
        {token && <button onClick={logout}>Sign out</button>}
      </nav>

      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={token ? <HomePageWithProvider /> : <Login />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
