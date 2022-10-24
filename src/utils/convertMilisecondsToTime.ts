export function convertMilisecondsToTime(e: number) {
  const minutes = Math.floor(e / 60000);
  const seconds = ((e % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
}
