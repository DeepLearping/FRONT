import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, token }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setModalOpen(true);
    } else {
      // token을 디코드하여 만료 시간 확인
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
  
      if (decodedToken.exp < currentTime) {
        setModalOpen(true);
      } else {
        setModalOpen(false);
      }
    }
  }, [token]);

  const handleClose = () => {
    setModalOpen(false);
    navigate(-1); // 이전 페이지로 이동합니다.
  };

  if (token) {
    return element;
  } else {
    return (
      <>
        {isModalOpen && <LoginModal isOpen={isModalOpen} onClose={handleClose} />}
      </>
    );
  }
};

export default ProtectedRoute;
