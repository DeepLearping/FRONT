import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./layouts/Layout";
import UserMain from "./pages/UserMain";
import TestPage from "./TestPage";
import Login from "./pages/user/Login";
import { useSelector } from "react-redux";

function App() {
  const token = useSelector(state => state.user.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserMain />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={token ? <TestPage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
