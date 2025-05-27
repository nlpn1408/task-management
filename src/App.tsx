import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/contexts/TaskContext";
import { mockTasks } from "@/services/mockData";
import HomePage from "./components/pages/HomePage";
import Header from "./components/organisms/Header";

function App() {
  return (
    <Router>
      <TaskProvider initialMockTasks={mockTasks}>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </TaskProvider>
    </Router>
  );
}

export default App;
