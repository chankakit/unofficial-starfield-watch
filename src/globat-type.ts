/** 
 * 日期信息类型
 * year：4位年份，如2023 | 
 * month：月份，如2 |
 * dayNum：日（几号），如28 |
 * dayWeek：星期几，如 4（星期四）
 */
export interface DateInfo {
  year: number,
  month: number,
  dayNum: number,
  dayWeek: number
}

/** 
 * 时间信息类型
 */
export interface TimeInfo {
  hours: number,
  minutes: number,
  seconds: number
}

export interface WorkTime {
  start: TimeInfo,
  end: TimeInfo
}