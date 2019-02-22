export function isEmptyObject(obj) {
  if (!obj) {
    return true
  }
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}

export function formatPlayerTime(second: number) {
  if (!second || second === 0) {
    return '00:00';
  }
  let h = 0,
    i = 0,
    s = Math.round(second);
  if (s > 60) {
    i = Math.round(s / 60);
    s = Math.round(s % 60);
  }
  // 补零
  let zero = function (v: number) {
    return v >> 0 < 10 ? '0' + v : v;
  };
  // return [zero(h), zero(i), zero(s)].join(':');
  return [...(h ? [zero(h)] : []), zero(i), zero(s)].join(':');
}


export function formatBigNumber(count: number): string {
  let result: string;
  switch (true) {
    case count < 0: result = `0`; break;
    case count < 1000: result = `${count}`; break;
    default: result = '999+';
  }
  return result
}

export function getRandomNumber(low: number, high: number): number {
  return Math.floor(Math.random() * (high - low) + low);
}