export const generateRandomNumber = () => {
  return generateRandomNumberBetween(0, 999999999)
}

export const generateRandomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) ) + min
}