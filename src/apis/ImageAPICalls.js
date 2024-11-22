import { request } from "./Apis";
import axios from 'axios';

export function loadAllProfileImages() {

    console.log('모든 프로필 이미지 불러오기...');

    return async (dispatch, getState) => {
        try {
            // 서버에 API 요청
            const result = await request('GET', '/images/api/character-profile');
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            // 받아온 데이터(result)안에 담긴 내용을 알맞게 포장하시면 됩니다. 

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

// 인기 캐릭터 선정을 위해 캐릭터 선택 횟수 카운팅 하는 함수
export function updateCharacterChatCount(charNo) {

    console.log(`Character ${charNo} clicked`);

    /* redux-thunk(미들 웨어)를 이용한 비동기 처리 */
    return async (dispatch, getState) => {
        try {
            // 서버에 API 요청
            const result = await request('PUT', '/api/v1/character/${charNo}/incrementChatCount', charNo);
            console.log('result : ', result); // 서버에서 받아온 data 정보 

            // 받아온 데이터(result)안에 담긴 내용을 알맞게 포장하시면 됩니다. 

            return result; // 포장한 데이터를 반환해주기.
        } catch (error) {
            console.error('API error:', error);
        }
    }
}

