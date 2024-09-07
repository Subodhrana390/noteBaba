import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateListing from "./pages/CreateListing";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import NotesPage from "./pages/NotesPage";

function App() {
  const user = useSelector((state) => state.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      setIsLoaded(true);
    };

    loadUserData();
  }, []);

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/create-listing"
            element={user ? <CreateListing /> : <Navigate to="/login" />}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/note/:noteId" element={<DetailPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
