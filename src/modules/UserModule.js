import { useNavigate } from "react-router-dom";
import { createActions, handleActions } from "redux-actions";

const navigate = useNavigate;

/* 초기 state값 */
const initialState = {
    userInfo: [],
    token: null,
    users: [],
    characters: [],
    character: [],
};

/* 액션 타입 설정 */
export const LOGIN = 'user/LOGIN';
export const LOG_OUT = 'user/LOG_OUT';
export const LOAD_ALL_CHARACTER_INFO = 'user/LOAD_ALL_CHARACTER_INFO';
export const UPDATE_USER_NICKNAME = 'user/UPDATE_USER_NICKNAME';
export const LOAD_USER = 'user/LOAD_USER';
export const CLEAR_MEMBER = 'user/CLEAR_MEMBER';

/* 유저 관련 액션 함수 */
export const { user : { login, logOut, loadAllCharacterInfo, updateUserNickname, loadUser, clearMember }} = createActions({
    [LOGIN]: ({ token, userInfo }) => ({ token, userInfo }),
    [LOG_OUT]: () => ({ }),
    [LOAD_ALL_CHARACTER_INFO]: (data) => (data),
    [UPDATE_USER_NICKNAME]: (data) => (data),
    [LOAD_USER]: (data) => (data),
    [CLEAR_MEMBER]: () => ({ }),

});

/* 리듀서 함수 */
const userReducer = handleActions(
    {   
        [LOGIN]: (state, { payload: { token, userInfo } }) => {

            // localStorage에 로그인 상태 저장
            localStorage.setItem("token", "Bearer "+token); // 토큰 저장

            return {
                ...state,
                userInfo: userInfo,
                token: token,
            } 
        },
        [LOG_OUT]: () => {
            localStorage.removeItem('token');  // 로그인 토큰 삭제
            return initialState;
        },
        [LOAD_ALL_CHARACTER_INFO]: (state, data) => {

            console.log('data : ', data);

            return {
                ...state,
                characters: data.payload, // 상태 업데이트
            };
        },
        [UPDATE_USER_NICKNAME]: (state, data) => {

            console.log('modifyUserInfo : ', data);

            return {
                ...state,
                userInfo: data.payload, // 상태 업데이트
            };
        },
        [LOAD_USER]: (state, data) => {

            console.log('data : ', data);

            return {
                ...state,
                userInfo: data.payload, // 상태 업데이트
            };
        },
        [CLEAR_MEMBER]: (state) => {
            localStorage.removeItem('token');
            return {
                ...state,
                userInfo: [], 
            };
        },
        
    },
    initialState
);

export default userReducer;

