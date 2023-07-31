export const convertSecondsToMs = (seconds: number) => seconds * 1000
export const convertMinutesToMs = (minutes: number) => convertSecondsToMs(minutes * 60)