import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, token }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
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
