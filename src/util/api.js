import axios from 'axios';

// const BASE_URL = 'https://addit.menteimo.com/casting_manager_server/index.php'; // API의 기본 URL
const BASE_URL = '/casting_manager_server/index.php'; // API의 기본 URL

// 예시 API 호출 함수
export const api = async (data) => {

  try {
    const response = await axios.post(BASE_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const { cmd, status, statusText } = response.data; // 응답에서 cmd와 state 추출

    switch (cmd) {
      case "login":
        if (status !== 200) {
          console.log(statusText);
        }
        break;
      case "loginChk":
        if (status === 200) {
          console.log(status);
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