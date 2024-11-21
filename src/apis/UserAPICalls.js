import { loginRequest, request } from "./Apis";
import { loadAllCharacterInfo, login, updateUser} from "../modules/UserModule";

/* 로그인 정보 전달 받는 함수 */
export function callLoginAPI(code) {


    console.log('구글 login api calls...');

    return async (dispatch, getState) => {
        try {
            // 서버에 로그인 요청
            const result = await loginRequest('GET', `/auth/google/callback?code=${code}`);
            console.log('구글 login result : ', result); // 서버에서 반환된 유저 정보

            // 로그인 성공 시 action dispatch
            const token = result.data.results.token;
            console.log("token : ",token);
            const userInfo = result.data.results.user
            console.log("userInfo : ",userInfo);
            dispatch(login({ token, userInfo }));

            window.location.href = 'http://localhost:3000'

            return true; // 로그인 성공
        } catch (error) {
            console.error('Login API error:', error);
            return false; // 로그인 실패
        }
    }
}

export function callKakaoLoginAPI(code) {


    console.log('카카오 login api calls...');

    return async (dispatch, getState) => {
        try {
            // 서버에 로그인 요청
            const result = await loginRequest('GET', `/auth/kakao/callback?code=${code}`);
            console.log('카카오 login result : ', result); // 서버에서 반환된 유저 정보

            // // 로그인 성공 시 action dispatch
            // const token = result.data.results.token;
            // console.log("token : ",token);
            // const userInfo = result.data.results.user
            // console.log("userInfo : ",userInfo);
            // dispatch(login({ token, userInfo }));

            // window.location.href = 'http://localhost:3000'

            return true; // 로그인 성공
        } catch (error) {
            console.error('Login API error:', error);
            return false; // 로그인 실패
        }
    }
}

// // 유저 정보 불러오기
// export function getUserInfo(userId) {

//     console.log('유저 정보 불러오기...');

//     return async (dispatch) => {

//         try {
//             const result = await request('GET', `/api/v1/user/${userId}`);
//             console.log('result : ', result); // 서버에서 받아온 data 정보

//             const data = result.results.user;
//             console.log('data :', data);

//             dispatch(loadUserInfo(data))

//             return result; // 포장한 데이터를 반환해주기.


//         } catch (error) {
//             console.error('API error:', error);
//         }
//     }
// }

// 유저 정보 불러오기
export function getAllCharacterInfo() {

    console.log('모든 캐릭터 정보 불러오기...');

    return async (dispatch) => {

        try {
            const result = await request('GET', `/api/v1/character`);
            console.log('result : ', result); // 서버에서 받아온 data 정보

            const data = result.results.character;
            console.log('data :', data);

            dispatch(loadAllCharacterInfo(data))

            return result; // 포장한 데이터를 반환해주기.


        } catch (error) {
            console.error('API error:', error);
        }
    }
}


// ✨함수 정의 예시✨
export function allHospitalAPI() {

    console.log('api 사용 예시 호출...');

    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch, getState) => {
        try {
            // 서버에 API 요청
            const result = await request('GET', '/api/v1/hospital');
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            // 받아온 데이터(result)안에 담긴 내용을 알맞게 포장하시면 됩니다. 

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

function updateLocalStorage() {

}