import { Fragment_Mono, Hanken_Grotesk } from "next/font/google";

export const fontSans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const fontMono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });
