import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./layouts/Layout";
import UserMain from "./pages/UserMain";
import TestPage from "./TestPage";
import Login from "./pages/user/Login";
import ChatRoom from "./pages/ChatRoom";
import SelectCharacterList from "./pages/selectCharacterList/selectCharacterList";


// ProtectedRoute 컴포넌트 정의
const ProtectedRoute = ({ element, token }) => {
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserMain />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<ProtectedRoute element={<TestPage />} token={token} />} />
          <Route path="/chat_room" element={<ProtectedRoute element={<ChatRoom />} token={token} />} />
          <Route path="/selectCharacterList" element={<SelectCharacterList/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;