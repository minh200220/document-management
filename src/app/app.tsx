import './app.module.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import DocumentList from './pages/DocumentPage';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/folder/:id" element={<DocumentList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
