import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./layouts/Layout";
import Login from "./pages/user/Login";
import ChatRoom from "./pages/chat/ChatRoom";
import SelectCharacterList from "./pages/selectCharacterList/selectCharacterList";
import ProtectedRoute from "./ProtectedRoute";
import BalanceGame from "./pages/balanceGame/balanceGame";
import BalanceChat from "./pages/balanceGame/balanceChat";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<SelectCharacterList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat_room" element={<ProtectedRoute element={<ChatRoom />} />} />
          <Route path="/selectCharacterList" element={<SelectCharacterList/>} />
          <Route path="/balanceGame" element={<BalanceGame/>}/>
          <Route path="/balanceChat" element={<BalanceChat/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;