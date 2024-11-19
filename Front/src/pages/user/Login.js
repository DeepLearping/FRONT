import React from 'react';

function Login() {

    const handleLogin = () => {
        const clientId = '294655601674-c93mo2jvfqe96spanjq8npovo0um1j97.apps.googleusercontent.com'; // 구글 클라이언트 ID
        const redirectUri = 'http://localhost:3000'; // 리디렉션 URI
        const scope = 'profile email'; // 요청할 권한
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    return (
        <div>
            <h1>로그인 페이지</h1>
            <button onClick={handleLogin}>구글로 로그인</button>
        </div>
    )
}

export default Login;