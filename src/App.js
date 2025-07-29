import './App.css';
import { Routes, Route } from 'react-router-dom';
import Logger from './components/logger';
import Main from './components/main';
import ProtectedRoute from './components/protectedRouter';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Logger />} />
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
