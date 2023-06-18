import { loadEnv } from "vite";

export const env = loadEnv(`development`, process.cwd(), ``);