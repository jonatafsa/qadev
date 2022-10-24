export const ConvertNumberToMinutes = (number: number) => {
  const minutes = number / 60;
  return Math.round(minutes);
};
