export const timeFormat = (isoString: string) => {
  const date = new Date(isoString);

  // 取得年份
  const year = date.getFullYear().toString();

  // 取得日期 (月/日)，確保月份不補 0
  const month = date.getMonth() + 1; // `getMonth()` 從 0 開始
  const day = date.getDate();
  const formattedDate = `${month}/${day}`;

  // 取得時間 (HH:mm)
  const hours = date.getHours().toString().padStart(2, '0'); // 確保補 0
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return {
    year,
    date: formattedDate,
    time: formattedTime
  };
};

