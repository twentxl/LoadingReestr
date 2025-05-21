export function formatDateTime(date: any) {
  const datetime: Date = new Date(date);
  if (datetime instanceof Date && !isNaN(datetime.getTime())) {
    const year = datetime.getFullYear();
    const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
    const day = datetime.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  else {
    return null;
  }
}