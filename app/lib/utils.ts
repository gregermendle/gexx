import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCssVariable(
  variableName: string,
  element: HTMLElement = document.documentElement
): string {
  const cssVarName = variableName.startsWith("--")
    ? variableName
    : `--${variableName}`;
  const computedStyle = getComputedStyle(element);
  return computedStyle.getPropertyValue(cssVarName).trim();
}
