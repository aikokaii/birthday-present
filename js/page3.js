import { mount as base } from "./page2.js";

const HEART3 = '<svg viewBox="0 0 200 180"><path pathLength="100" d="M100 44C90 22 70 10 50 12C24 14 8 36 12 62C18 104 70 140 100 168C130 140 182 104 188 62C192 36 176 14 150 12C130 10 110 22 100 44C104 66 130 76 126 96C122 116 92 114 92 98C92 86 108 84 108 96"/></svg>';

export const mount = root => base(root, HEART3);
