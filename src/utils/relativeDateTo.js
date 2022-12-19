export default function relativeDateTo(past) {
  const now = new Date();
  const pastDate = new Date(past);

  const yearDiff = now.getFullYear() - pastDate.getFullYear();
  if (yearDiff > 0) return `${yearDiff}년 전`;

  const monthDiff = now.getMonth() - pastDate.getMonth();
  if (monthDiff > 0) return `${monthDiff}개월 전`;

  const dayDiff = now.getDay() - pastDate.getDay();
  if (dayDiff > 0) return `${dayDiff}일 전`;

  const hourDiff = now.getHours() - pastDate.getHours();
  if (hourDiff > 0) return `${hourDiff}시간 전`;

  const minuteDiff = now.getMinutes() - pastDate.getMinutes();
  if (minuteDiff > 0) return `${minuteDiff}분 전`;

  return '방금 전';
}
