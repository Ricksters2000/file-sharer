export const generateMediaQueryBetween = (min: number, max: number) => {
  return `@media (min-width: ${min}px) and (max-width: ${max}px)`;
}

const small = 425;
const mediumEnd = 768;
const largeEnd = 1440;
const maxSize = 9999;

const mediumStart = small + 1;
const largeStart = mediumEnd + 1;

export const mediauQueries = {
  smallest: generateMediaQueryBetween(0, small),
  mediumAndBelow: generateMediaQueryBetween(0, mediumEnd),
  medium: generateMediaQueryBetween(mediumStart, mediumEnd),
  mediumAndAbove: generateMediaQueryBetween(mediumStart, maxSize),
  largeAndBelow: generateMediaQueryBetween(0, largeEnd),
  large: generateMediaQueryBetween(largeStart, largeEnd),
  largest: generateMediaQueryBetween(largeStart, maxSize),
}