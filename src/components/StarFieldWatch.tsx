import { useState } from 'react'
import '@/components/StarFieldWatch.scss'
import { DateInfo, TimeInfo } from '@/globat-type.ts'


const dayFormatter = (value: number): string => {
  const dayText = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday',
  ]
  return dayText[value]
}
const monthFormatter = (month: number): string => {
  const monthText = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December'
  ]
  return monthText[month]
}


const updateTime = (): {date: DateInfo, time: TimeInfo} => {
  const now = new Date()
  let ro = {
    date: {
      year: now.getFullYear(),
      month: now.getMonth(),
      dayNum: now.getDate(),
      dayWeek: now.getDay()
    },
    time: {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    }
  }
  return ro
}

enum PointerAngleLimit {
  Min = -5,
  Max = 360
}
interface Pointer {
  hours: PointerAngleLimit,
  minutes: PointerAngleLimit,
  seconds: PointerAngleLimit
}
const calPointerAngle = (time:TimeInfo, isContinuously:boolean): Pointer => {
  const offsetDeg = {
    h: -5,
    m: -3,
    s: -1,
  }
  // 时针和分针是离散跳动，时针小时变更时才跳动，分针分钟变更时才跳动
  let pointerAngle = {
    hours: (time.hours % 12) / 12 * 360.0 + offsetDeg.h,
    minutes: time.minutes / 60 * 360.0 + offsetDeg.m,
    seconds: time.seconds / 60 * 360.0 + offsetDeg.s
  }
  // 时针和分针是“连续的”，每秒都会改变一点
  if(isContinuously) {
    pointerAngle = {
      hours: (time.hours%12*3600+time.minutes*60+time.seconds)/(12*3600) * 360.0 + offsetDeg.h,
      minutes: ((time.minutes%60*60+time.seconds)/3600) * 360.0 + offsetDeg.m,
      seconds: time.seconds / 60 * 360.0 + offsetDeg.s
    }
  }
  return pointerAngle
}

const formatNumber = (num: number): string => {
  if (num < 10) {
    return `0${num}`
  } else {
    return num.toString()
  }
}
function timeDisplay(time:TimeInfo, is12Hr:boolean) {
  let hours = time.hours
  if(is12Hr) {
    hours = time.hours % 12
  }
  return (
    <>
      <div className='flex align-center time-wrap'>
        <div className='time'>{ formatNumber(hours) }:{ formatNumber(time.minutes) }</div>
        <div style={{ display: is12Hr ? 'block' : 'none', marginTop: '-1px' }}>
          <div className={`${time.hours<12 ? 'activate' : ''} am-pm`} style={{ marginBottom: '1.5px' }}>AM</div>
          <div className={`${time.hours>=12 ? 'activate' : ''} am-pm`}>PM</div>
        </div>
      </div>
    </>
  )
}

function convertToSecond(time:TimeInfo): number {
  return time.hours * 3600 + time.minutes * 60 + time.seconds
}
const calWorkDuration = (workTime: { start:TimeInfo, end:TimeInfo }): number => {
  return convertToSecond(workTime.end) - convertToSecond(workTime.start)
}
const calWorkProgress = (now:TimeInfo, workTime: { start:TimeInfo, end:TimeInfo }): number => {
  let durationSecond = calWorkDuration(workTime)
  let progressPercent
  if(durationSecond < 0) {
    let t = convertToSecond(now) - (convertToSecond(workTime.start))
    if(t < 0) {
      t = t + 24 * 3600
    }
    durationSecond = durationSecond + 24 * 3600
    progressPercent = t / durationSecond
  } else {
    const t = convertToSecond(now) - (convertToSecond(workTime.start))
    progressPercent = t / durationSecond
  }
  if(progressPercent<0 || progressPercent>1) {
    progressPercent = 1
  }
  return progressPercent
}

export interface WatchProps {
  is12Hr: boolean,
  isContinuously: boolean,
  workTime: {
    start: TimeInfo,
    end: TimeInfo
  }
}

function StarFieldWatch(props: WatchProps) {
  const {
    is12Hr,
    isContinuously,
    workTime
  } = props


  const [date, setDate] = useState(updateTime().date)
  const [time, setTime] = useState(updateTime().time)
  const [pointerAngle, setPointerAngle] = useState(calPointerAngle(updateTime().time, isContinuously))

  const [workProgress, setWorkProgress] = useState(calWorkProgress(updateTime().time, workTime))

  setTimeout(() => {
    const now = updateTime()
    setDate(now.date)
    setTime(now.time)
    setPointerAngle(calPointerAngle(now.time, isContinuously))
    setWorkProgress(calWorkProgress(updateTime().time, workTime))
  }, 1000)

  return (
    <>
      <div className='flex justify-center align-center watch-outside'>
        <div className='ring-text' style={{ top: '1.4%', left:'45%' }}>12</div>
        <div className='ring-text' style={{ right: '2.5%'}}>3</div>
        <div className='ring-text' style={{ bottom: '1%' }}>6</div>
        <div className='ring-text' style={{ left: '2.4%', top: '47%' }}>9</div>
        {/* 指针 */}
        <div className='pointer hour-pointer' style={{ transform: `rotate(${pointerAngle.hours}deg)` }}>
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M160 9C169.495 9 178.968 9.89551 188.295 11.6746L160 160L160 9Z" fill="#E2FAFF"/>
            <path d="M160 18C168.929 18 177.838 18.8421 186.608 20.5152L160 160L160 18Z" fill="#444B4C"/>
          </svg>
        </div>
        <div className='pointer minute-pointer' style={{ transform: `rotate(${pointerAngle.minutes}deg)` }}>
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M160 9C165.061 9 170.119 9.25445 175.155 9.7624L160 160L160 9Z" fill="#00F0FF"/>
          <path d="M160 18C164.759 18 169.516 18.2393 174.251 18.717L160 160L160 18Z" fill="#3D5D5F"/>
        </svg>
        </div>
        <div className='pointer second-pointer' style={{ transform: `rotate(${pointerAngle.seconds}deg)` }}>
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M160 9C161.581 9 163.163 9.02484 164.743 9.07451L160 160L160 9Z" fill="#FF3838"/>
          <path d="M160 18C161.487 18 162.974 18.0234 164.46 18.0701L160 160L160 18Z" fill="#6B3A3A"/>
        </svg>
        </div>
        {/* 内圈内容 */}
        <div className='watch-inside'>
          {/* 刻度 */}
          <svg width="246" height="246" viewBox="0 0 246 246" fill="none" xmlns="http://www.w3.org/2000/svg" className='scale'>
            <g stroke="white" strokeWidth="2.4710">
              <line x1="124.236" y1="43" x2="124.236" y2="203"/>
              <line x1="43" y1="121.764" x2="203" y2="121.764"/>
              <line x1="53.1002" y1="161.93" x2="191.664" y2="81.93"/>
              <line x1="54.3357" y1="81.93" x2="192.9" y2="161.93"/>
              <line x1="81.93" y1="191.664" x2="161.93" y2="53.1004"/>
              <line x1="84.07" y1="53.1005" x2="164.07" y2="191.665"/>
            </g>
            <g opacity="0.5" stroke="white" strokeWidth="0.92664">
              <line x1="43.3898" y1="130.902" x2="202.513" y2="114.177"/>
              <line x1="44.6518" y1="139.18" x2="201.155" y2="105.914"/>
              <line x1="46.7723" y1="147.281" x2="198.941" y2="97.8383"/>
              <line x1="49.7279" y1="155.116" x2="195.895" y2="90.0379"/>
              <line x1="58.0063" y1="169.649" x2="187.449" y2="75.603"/>
              <line x1="63.2384" y1="176.186" x2="182.142" y2="69.1251"/>
              <line x1="69.1252" y1="182.142" x2="176.186" y2="63.239"/>
              <line x1="75.6023" y1="187.449" x2="169.648" y2="58.0061"/>
              <line x1="90.0378" y1="195.896" x2="155.116" y2="49.7283"/>
              <line x1="97.838" y1="198.941" x2="147.281" y2="46.7723"/>
              <line x1="105.914" y1="201.156" x2="139.18" y2="44.652"/>
              <line x1="114.177" y1="202.514" x2="130.901" y2="43.3901"/>
              <line x1="43.4867" y1="114.177" x2="202.61" y2="130.901"/>
              <line x1="44.8445" y1="105.914" x2="201.348" y2="139.18"/>
              <line x1="47.0586" y1="97.8382" x2="199.228" y2="147.281"/>
              <line x1="50.1048" y1="90.0382" x2="196.272" y2="155.116"/>
              <line x1="58.551" y1="75.6027" x2="187.994" y2="169.648"/>
              <line x1="63.8584" y1="69.1254" x2="182.762" y2="176.186"/>
              <line x1="69.8139" y1="63.2383" x2="176.875" y2="182.141"/>
              <line x1="76.3519" y1="58.0065" x2="170.398" y2="187.449"/>
              <line x1="90.8843" y1="49.7285" x2="155.962" y2="195.896"/>
              <line x1="98.7193" y1="46.7724" x2="148.162" y2="198.941"/>
              <line x1="106.82" y1="44.6517" x2="140.086" y2="201.155"/>
              <line x1="115.098" y1="43.39" x2="131.823" y2="202.514"/>
            </g>
            <circle cx="123" cy="123" r="74.749" fill="#0D1112"/>
          </svg>
          {/* 进度背景 */}
          <svg width="246" height="246" viewBox="0 0 246 246" fill="none" xmlns="http://www.w3.org/2000/svg" className='pos-abs'>
            <circle opacity="0.25" cx="123" cy="123" r="101" stroke="#E2FAFF" strokeWidth="36" strokeDasharray="317.29 600"/>
          </svg>
          {/* 进度前景 */}
          <svg width="246" height="246" viewBox="0 0 246 246" fill="none" xmlns="http://www.w3.org/2000/svg" className='pos-abs' style={{ transform: 'scaleX(-1)' }}>
            <circle cx="123" cy="123" r="101" stroke="#E2FAFF" strokeWidth="36" strokeDasharray="1 700" style={{ strokeDasharray: `${workProgress * 101 * Math.PI} 700`}}/>
          </svg>
          {/* 搬砖图标 */}
          <svg width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute', top:'38.5%', left:'13%' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.1582 16.1582L13.6182 20.7715C13.7869 20.9964 13.9104 21.252 13.9817 21.5239L16.0151 29.2717C16.3198 30.4328 15.6256 31.6211 14.4645 31.9259C13.3033 32.2306 12.115 31.5364 11.8103 30.3752L9.88503 23.0392L7.91782 20.4163V22.321C7.91782 22.6064 7.86158 22.8891 7.75231 23.1529L4.70227 30.515C4.24281 31.6241 2.9713 32.1507 1.86226 31.6912C0.753224 31.2318 0.226637 29.9602 0.686095 28.8512L3.57063 21.8885V14.0122C3.57063 13.891 3.58056 13.772 3.59965 13.6562C3.58901 13.0576 3.83261 12.4585 4.31871 12.0338L11.5532 5.71195C12.428 4.94753 13.7568 5.03699 14.5212 5.91178L16.325 7.97595C16.5072 8.18443 16.6409 8.41871 16.727 8.66499C17.1153 9.34205 17.4886 10.2025 17.4886 10.8221V14.5399L20.4707 16.7835C21.2443 17.3655 21.3996 18.4645 20.8175 19.2381C20.2355 20.0117 19.1365 20.167 18.3629 19.5849L14.6819 16.8154C14.2417 16.4842 13.9828 15.9654 13.9828 15.4146V12.8161L10.1582 16.1582Z" fill="#E2FAFF"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M19.0662 15.727V15.7268L20.4706 16.7835C20.9194 17.1212 21.1601 17.6328 21.1695 18.1539C21.1601 17.6328 20.9194 17.1213 20.4706 16.7837L19.0662 15.727ZM19.0662 20.9673C20.0309 21.088 21.0315 20.703 21.6579 19.8704C22.5892 18.6327 22.3407 16.8743 21.103 15.9431L19.0662 14.4106V14.0606C19.0662 13.5304 19.496 13.1006 20.0262 13.1006H27.2913C27.8215 13.1006 28.2513 13.5304 28.2513 14.0606V21.3258C28.2513 21.856 27.8215 22.2858 27.2913 22.2858H20.0262C19.496 22.2858 19.0662 21.856 19.0662 21.3258V20.9673Z" fill="#E2FAFF"/>
            <circle cx="20.118" cy="4.33635" r="3.85637" fill="#E2FAFF"/>
          </svg>
          {/* 🏁 图标 */}
          <svg width="35" height="14" viewBox="0 0 35 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position:'absolute', top:'44.5%', right:'12%' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M7.48 0.151855H0.615997V4.72786H7.48V0.151855ZM7.48001 9.3039H0.616005V13.8799H7.48001V9.3041H14.344V13.8799H21.208V9.3041H28.072V13.8799H34.936V9.3039H28.072V4.7281H21.208V9.3039H14.344V4.7281H7.48001V9.3039ZM14.344 0.152003H21.208V4.728H14.344V0.152003ZM34.936 0.152003H28.072V4.728H34.936V0.152003Z" fill="#E2FAFF"/>
          </svg>
          {/* 信息 */}
          <div className='flex flex-col align-center justify-center date-time'>
            <div className='date'>{ dayFormatter(date.dayWeek) }</div>
            { timeDisplay(time, is12Hr) }
            <div className='date'>
              <span>{ monthFormatter(date.month) }</span> <span>{ date.dayNum }</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StarFieldWatch
