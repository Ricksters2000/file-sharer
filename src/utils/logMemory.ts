export const logMemory = () => {
  // console.log(`current memory used:`, process.memoryUsage().heapUsed / 1024 / 1024)
  const memoryUsage = process.memoryUsage()
  const divide = 1000000
  const total = memoryUsage.arrayBuffers + memoryUsage.external + memoryUsage.heapTotal + memoryUsage.heapUsed + memoryUsage.rss;
  // console.log(`current memory used:`, process.memoryUsage().heapUsed / 1024 / 1024)
  console.log(`full stats:`, {
    rss: memoryUsage.rss / divide,
    heapTotal: memoryUsage.heapTotal / divide,
    headUsed: memoryUsage.heapUsed / divide,
    external: memoryUsage.external / divide,
    arrayBuffers: memoryUsage.arrayBuffers / divide,
  })
  console.log(`total:`, total / divide)
}