import { padStart } from "lodash";
import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const utils = {
  /**
   * Parse second to time string
   * @param second
   * @returns {string} 00:00 or 00:00:00
   */
  secondToTime: (second) => {
    const add0 = (num) => (num < 10 ? "0" + num : "" + num);
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(":");
  },
  /**
   * Parse song duration
   * @param duration
   * @returns {string}
   */
  durationToTime(duration) {
    const { $d } = dayjs.duration(duration);
    return `${padStart($d.minutes, 2, "0")}:${padStart($d.seconds, 2, "0")}`;
  },

  isMobile: /mobile/i.test(window.navigator.userAgent),

  elementsContains: (elements, target) => {
    return elements.some((ele) => ele && ele.contains(target));
  },
  getTargetFromEvent: (e) => {
    const target = e.target;
    if (e.composed && target.shadowRoot) {
      return (e.composedPath && e.composedPath()[0]) || target;
    }
    return target;
  },
};

export function formatTime(interval) {
  interval = interval | 0;
  const minute = (((interval / 60) | 0) + "").padStart(2, "0");
  const second = ((interval % 60) + "").padStart(2, "0");
  return `${minute}:${second}`;
}

class Storage {
  set(key, value) {
    if (value === undefined) return;
    localStorage.setItem(key, stringify(value));
  }

  get(key) {
    const val = parse(localStorage.getItem(key));
    return val ? val : undefined;
  }
  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

export function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
export function moveArray(x, from, to) {
  x = x.slice();
  x.splice(to < 0 ? x.length + to : to, 0, x.splice(from, 1)[0]);
  return x;
}

export function randomOrder(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = arr[randomIndex];
    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }
  return arr;
}

export function random(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

function stringify(val) {
  return JSON.stringify(val);
}
function parse(val) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val || undefined;
  }
}

export const storage = new Storage();

export default utils;
