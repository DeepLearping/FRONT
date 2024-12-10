import { fastAPIrequest, request } from './Apis';
import { loadChatRoom, loadUserChatRooms } from '../modules/ChatModule';

export const sendMessageToAI = async (messageInfo) => {
    const payload = {
        user_id: messageInfo.userId,
        conversation_id: messageInfo.sessionId,
        question: messageInfo.question,
        character_id: messageInfo.charNo,
    };

    const response = await request("POST", "/chatMessage/sendQuestion", payload);
    return response;
};

export const sendBalanceMessageToAI = async (messageInfo) => {
    const payload = {
        user_id: messageInfo.userId,
        conversation_id: messageInfo.sessionId,
        question: messageInfo.question,
        character_id: messageInfo.charNo,
        keyword:messageInfo.keyword,
        situation: messageInfo.situation
    };

    const response = await fastAPIrequest("POST", "/balanceChat", payload);
    return response;
};

export function loadChatRoomInfo(memberNo, sessionId) {

    console.log('채팅방 불러오기...');

    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', `/api/v1/chatRoom/${memberNo}/${sessionId}`);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            const data = result.results.chatRooms[0];
            dispatch(loadChatRoom(data));

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

export function enterChatRoom(chatRoomInfo) {

    console.log('채팅방 입장...');

    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch, getState) => {
        try {
            const result = await request('POST', '/api/v1/chatRoom/create/oneToOne', chatRoomInfo);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            const data = result.results.chatRoom;
            console.log('data : ', data);

            dispatch(loadChatRoom(data));

            return data; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

export function enterBalanceChatRoom(enterChatRoomInfo) {

    console.log('밸런스 채팅방 입장...');

    return async (dispatch, getState) => {
        try {
            const result = await request('POST', '/api/v1/chatRoom/create/balanceChatRoom', enterChatRoomInfo);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            const data = result.results.chatRoom;
            console.log('data : ', data);

            dispatch(loadChatRoom(data));

            return data; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

export function enterGroupChatRoom(chatRoomInfo) {

    console.log('단체 채팅방 입장...');

    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch, getState) => {
        try {
            const result = await request('POST', '/api/v1/chatRoom/create/groupChat', chatRoomInfo);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            const data = result.results.chatRoom;
            console.log('data : ', data);

            dispatch(loadChatRoom(data));

            return data; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

export function matchCharacter(messageInfo) {

    console.log('대답할 캐릭터 정보 불러오기...');

    return async (dispatch, getState) => {
        try {
            const result = await request('POST', '/chatMessage/selectCharacterIdList', messageInfo);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

export function fetchRecentChats(memberNo) {

    console.log('최근 채팅방 불러오기...');

    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch, getState) => {
        try {
            // 서버에 API 요청
            const result = await request('GET', `/api/v1/chatRoom/${memberNo}`);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            const chatRooms = result.results.chatRooms;
            dispatch(loadUserChatRooms(chatRooms))

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

export function deleteHumanQuestions(DeleteUserMessageRequest) {

    console.log('유저 채팅 기록 중복 삭제...');

    return async (dispatch, getState) => {
        try {
            // 서버에 API 요청
            const result = await request('POST', '/chatMessage/deleteHumanQuestions', DeleteUserMessageRequest);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}
