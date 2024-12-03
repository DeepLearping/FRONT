import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./layouts/Layout";
import Login from "./pages/user/Login";
import ChatRoom from "./pages/chat/ChatRoom";
import SelectCharacterList from "./pages/selectCharacterList/selectCharacterList";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<SelectCharacterList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat_room" element={<ProtectedRoute element={<ChatRoom />} token={token} />} />
          <Route path="/selectCharacterList" element={<SelectCharacterList/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;