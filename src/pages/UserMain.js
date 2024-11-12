import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../css/UserMain.css';
import { useDispatch } from "react-redux";
import { callLoginAPI } from "../apis/UserAPICalls";


function UserMain() {

    const dispatch = useDispatch();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code'); // 쿼리 파라미터에서 code 추출
    
        if (code) {
          // 백엔드에 code 전송하여 액세스 토큰 요청
          dispatch(callLoginAPI(code))
            
        }
      }, [dispatch]);

    return (
        <>
            <div className="user-main-container">
                <div className="user-main-brand-container">
                    <div className="user-main-brand-background">
                        <span className="user-main-title">Character Talk</span>
                    </div>
                </div>
                <ul className="user-main-nav-list">
                    <li className="user-main-nav-item">
                        <NavLink to="/test">
                            <h1>TEST</h1>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default UserMain;
