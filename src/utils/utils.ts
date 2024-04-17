import { Any } from "@/constants/types";

export const phoneRegex = /^1\d{10}$/;

// 过滤空格
export const trimAll = (str: string): string => {
  return String(str || '').replace(/\s/g, '');
};


// 千分位格式化
export const thousandsFormatting = (v: Any): string => {
  let newNumber = "";
  const numbers = String(Math.abs(Number(v))).replace(/\s/g, "").split(".");

  if (!numbers[0]) return '';

  const valueArr = numbers[0].replaceAll(",", "").split("").reverse();
  if (valueArr.length > 3) {
    const newArr: Any = valueArr.reduce((pre: string[], cur: string, index: number) => {
      const newPre: Any = pre;
      const i: number = Math.floor(index / 3);
      if (!newPre[i]) {
        newPre[i] = [];
      }
      newPre[i].push(cur);
      return newPre;
    }, [] as string[]);

    newNumber = newArr
      .map((item: string[]) => item.join(""))
      .join(",")
      .split("")
      .reverse()
      .join("");
  } else {
    newNumber = numbers[0].replaceAll(",", "");
  }

  return numbers[1] ? `${v < 0 ? '-' : ''}${newNumber}.${numbers[1]}` : `${v < 0 ? '-' : ''}${newNumber}`;
};