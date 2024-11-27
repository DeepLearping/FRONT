import axios from 'axios';
import { request } from './Apis';
import { loadChatRoom } from '../modules/ChatModule';

const API_URL = "http://localhost:8080/chatMessage/sendQuestion"; // FastAPI URL

export const sendMessageToAI = async (question, characterId, characterName) => {
  // TODO: 생성된 채팅방의 session_id를 받아와서 conversation_id에 넣기
  const payload = {
    user_id: 1,
    conversation_id: 1, 
    question,
    character_id: characterId
  };

  const response = await axios.post(API_URL, payload);
  return response.data;
};

export function enterChatRoom(chatRoomInfo) {

  console.log('채팅방 입장...');

  /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
  return async (dispatch, getState) => {
      try {
          const result = await request('POST', '/api/v1/chatRoom/create/oneToOne', chatRoomInfo);
          console.log('result : ', result); // 서버에서 받아온 data 정보 

          const data = result.results.chatRoom;
          console.log('data : ', data);

          dispatch(loadChatRoom(data))

          return data; // 포장한 데이터를 반환해주기.
      } catch (error) {
          console.error('API error:', error);
      }
  }
}

export function fetchChatHistory() {

  console.log('채팅 내역을 불러옵니다...');

  return async (dispatch, getState) => {
      try {
          const result = await request('GET', '/api/v1/hospital');
          console.log('result : ', result); // 서버에서 받아온 data 정보 

          // 받아온 데이터(result)안에 담긴 내용을 알맞게 포장하시면 됩니다. 

          return result; // 포장한 데이터를 반환해주기.
      } catch (error) {
          console.error('API error:', error);
      }
  }
}

// const fetchChatHistory = async () => {
//   // if (!conversationId) return;
//   try {
//     const response = await fetch(
//       // `http://localhost:8000/chat_message/${conversationId}`
//       `http://localhost:8000/chat_message/1`
//     );
//     const data = await response.json();
//     setMessages(data.messages || []);
//   } catch (error) {
//     console.error("채팅 기록 로드 오류:", error);
//   }
// };

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
