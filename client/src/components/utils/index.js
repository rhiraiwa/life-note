// 年月日の整形
export const formatDate = (value) => {
    
  if (value.length !== 8) return value;

  let wYear = value.slice(0,4);
  let wMonth = value.slice(4,6);
  let wDate = value.slice(6,8);

  return `${wYear}/${wMonth}/${wDate}`;
}

// 時刻の整形
export const formatTime = (value) => {

  if (value.length !== 6) return value;

  let wHour = value.slice(0,2);
  let wMinutes = value.slice(2,4);
  let wSecond = value.slice(4,6);

  return `${wHour}:${wMinutes}:${wSecond}`;
}

// 金額の整形
export const formatMoney = (value) => {

  if (value === '' || value === '0' || value === 0) return;

  return `\\ ${Number(value).toLocaleString()}`
}

// 数値の整形
export const formatComma = (value) => {
  return `${Number(value).toLocaleString()}`
}

// 数値の整形（入力時）
export const formatNumber = (value) => {
  
  if (value === '') return '';

  // カンマを除去して数値だけを取得
  const inputValue = value.replace(/,/g, '');

  // 数値以外の文字を削除
  const formattedValue = inputValue.replace(/[^\d.-]/g, '');

  if (formattedValue === '') {
    return '';
  }

  // カンマを追加してフォーマット
  const formattedString = parseFloat(formattedValue).toLocaleString();

  return formattedString;
};