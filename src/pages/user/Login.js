import React from 'react';

function Login() {

    const handleGoogleLogin = () => {
        const clientId = '447676513898-dcf1ft0rpj7rtvdesegt6v2hrs60btpg.apps.googleusercontent.com'; // 구글 클라이언트 ID
        const redirectUri = 'http://localhost:3000'; // 리디렉션 URI
        const scope = 'profile email'; // 요청할 권한
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    const handleKakaoLogin = () => {
        const clientId = 'bd5756f93546ee3a9ccadc4394902b27'; // 구글 클라이언트 ID
        const redirectUri = 'http://localhost:3000'; // 리디렉션 URI
        const scope = 'profile_nickname,profile_image,account_email,name'; // 요청할 권한
        const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
        window.location.href = authUrl; // 구글 로그인 페이지로 리디렉션
    };

    return (
        <div>
            <h1>로그인 페이지</h1>
            <button onClick={handleGoogleLogin}>구글로 로그인</button>
            <button onClick={handleKakaoLogin}>카카오로 로그인</button>
        </div>
    )
}

export default Login;