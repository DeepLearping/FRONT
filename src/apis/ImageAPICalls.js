import { request } from "./Apis";


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