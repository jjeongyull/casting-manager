const functions = {};

// 전화번호
functions.formatPhoneNumber = (value) => {
  const onlyNum = value.replace(/\D/g, '');
  if (onlyNum.length <= 3) {
    return onlyNum;
  } else if (onlyNum.length <= 7) {
    return `${onlyNum.slice(0, 3)}-${onlyNum.slice(3)}`;
  } else {
    return `${onlyNum.slice(0, 3)}-${onlyNum.slice(3, 7)}-${onlyNum.slice(7, 11)}`;
  }
}

// 딥 클론 (객체 복사)
functions.deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// 날짜 포맷팅 (YYYY-MM-DD)
functions.formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 입력값 공백 제거
functions.trimAll = (value) => {
  return value.replace(/\s+/g, '');
};

// 숫자에 콤마
functions.formatCurrency = (amount) => {
  if (typeof amount === 'string') {
    amount = amount.replace(/,/g, ''); // 문자열에 포함된 콤마 제거
  }
  amount = parseFloat(amount);

  if (isNaN(amount)) {
    return 'Invalid number';
  }

  // 숫자를 소수점 기준으로 분리하고 정수 부분에만 콤마 추가
  const [integer, decimal] = amount.toString().split('.');
  return (
    integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (decimal ? `.${decimal}` : '')
  );
};

export default functions;