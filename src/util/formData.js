import axios from 'axios';
// const BASE_URL = 'https://addit.menteimo.com/casting_manager_server/index.php'; // API의 기본 URL
const BASE_URL = '/casting_manager_server/index.php'; // API의 기본 URL

// 예시 API 호출 함수
export const formDataFunction = async (data) => {

  try {
    const response = await axios.post(BASE_URL, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    const { cmd, status } = response.data; // 응답에서 cmd와 state 추출

    switch (cmd) {
      case "insert_profile":
        if (status === 200) {
          alert('프로필 동록이 완료되었습니다.');
        } else {
          alert('프로필 동록 중 오류가 발생하였습니다.');
        }
        break;
      default:
        break;
    }

    return response.data; // API 응답 데이터 반환
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred'); // 에러 발생 시 처리
  }
};