import { useNavigate } from "react-router-dom";
import { createActions, handleActions } from "redux-actions";

const navigate = useNavigate;

/* 초기 state값 */
const initialState = {
    profileImages: [],
    images: []
};

/* 액션 타입 설정 */
export const LOAD_ALL_PROFILE_IMAGES = 'image/LOAD_ALL_PROFILE_IMAGES';
export const LOG_OUT = 'image/LOG_OUT';

/* 유저 관련 액션 함수 */
export const { image : { loadAllProfileImages, logOut }} = createActions({
    [LOAD_ALL_PROFILE_IMAGES]: (data) => (data),
    [LOG_OUT]: () => ({ }),

});

/* 리듀서 함수 */
const imageReducer = handleActions(
    {   
        [LOAD_ALL_PROFILE_IMAGES]: (state, data) => {

            return {
                ...state,

            } 
        },
        [LOG_OUT]: () => {
            localStorage.removeItem('token');  // 로그인 토큰 삭제
            return initialState;
        },
        
    },
    initialState
);

export default imageReducer;

