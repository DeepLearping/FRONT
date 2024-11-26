import { createActions, handleActions } from "redux-actions";

/* 초기 state값 */
const initialState = {
    chatRooms: [],
    currentRoom: []
};

/* 액션 타입 설정 */
export const LOAD_CHAT_ROOM = 'chat/LOAD_CHAT_ROOM';
export const LOG_OUT = 'chat/LOG_OUT';

/* 유저 관련 액션 함수 */
export const { chat : { loadChatRoom, logOut }} = createActions({
    [LOAD_CHAT_ROOM]: (data) => (data),
    [LOG_OUT]: () => ({ }),

});

/* 리듀서 함수 */
const chatReducer = handleActions(
    {   
        [LOAD_CHAT_ROOM]: (state, data) => {

            return {
                ...state,
                currentRoom: data.payload
            } 
        },
        [LOG_OUT]: () => {
            return initialState;
        },
        
    },
    initialState
);

export default chatReducer;

