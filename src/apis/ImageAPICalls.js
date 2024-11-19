

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