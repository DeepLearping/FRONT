import { createActions, handleActions } from "redux-actions";

/* 초기 state값 */
const initialState = {
    chatRooms: [],
    currentRoom: [],
    balanceChatRooms: [],
    lastChatMessage: '',
};

/* 액션 타입 설정 */
export const LOAD_CHAT_ROOM = 'chat/LOAD_CHAT_ROOM';
export const LOG_OUT = 'chat/LOG_OUT';
export const LOAD_USER_CHAT_ROOMS = 'chat/LOAD_USER_CHAT_ROOMS';
export const SAVE_BALANCE_CHAT_ROOM = 'chat/SAVE_BALANCE_CHAT_ROOM';
export const UPDATE_LAST_MESSAGE = 'chat/UPDATE_LAST_MESSAGE';

/* 유저 관련 액션 함수 */
export const { chat : { loadChatRoom, logOut, loadUserChatRooms, saveBalanceChatRoom, updateLastMessage }} = createActions({
    [LOAD_CHAT_ROOM]: (data) => (data),
    [LOG_OUT]: () => ({ }),
    [LOAD_USER_CHAT_ROOMS]: (data) => (data),
    [SAVE_BALANCE_CHAT_ROOM]: (data) => (data),
    [UPDATE_LAST_MESSAGE]: (content) => (content),
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
        [LOAD_USER_CHAT_ROOMS]: (state, data) => {

            return {
                ...state,
                chatRooms: data.payload
            } 
        },
        [SAVE_BALANCE_CHAT_ROOM]: (state, data) => {

            return {
                ...state,
                balanceChatRooms: Array.isArray(state.balanceChatRooms) 
                ? state.balanceChatRooms.concat(data.payload) 
                : [data.payload]
            } 
        },
        [UPDATE_LAST_MESSAGE]: (state, { payload: content }) => {
            return {
                ...state,
                lastChatMessage: content
            };
        },
    },
    initialState
);

export default chatReducer;

