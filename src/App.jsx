import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTokenFromLocalStorage } from "./helpers/localStorage";
import ChatApi from "./api";
import Homepage from "./routes/Homepage";
import LoginForm from "./auth/LoginForm";
import SignUpForm from "./auth/SignUpForm";
import NotFoundPage from "./routes/NotFoundPage";
import ChatHomePage from "./routes/chat/ChatHomePage";
import FavouriteUsersPage from "./routes/favourite/FavouriteUsersPage";
import UserPage from "./routes/user/UserPage";
import EditUserForm from "./routes/user/EditUserForm";
import Navbar from "./routes/Navbar";
function App({ router: RouterComponent = BrowserRouter }) {
  const [isTokenSet, setIsTokenSet] = useState(false);
  useEffect(() => {
    const tokenInLocal = getTokenFromLocalStorage();
    if (tokenInLocal) {
      ChatApi.token = tokenInLocal.token;
    }
    setIsTokenSet(true); // Set the state to true once the token is set
  }, []);

  if (!isTokenSet) {
    return <div>Loading...</div>;
  }

  // this is for React testing (App component will be able to work with MemoryRouter)
  const RouterProvider = RouterComponent || (({ children }) => <>{children}</>);

  return (
    <div>
      <RouterProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/users/:username" element={<UserPage />} />
          <Route path="/edit" element={<EditUserForm />} />
          <Route path="/chat" element={<ChatHomePage />} />
          <Route path="/favourite" element={<FavouriteUsersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RouterProvider>
    </div>
  );
}

export default App;
