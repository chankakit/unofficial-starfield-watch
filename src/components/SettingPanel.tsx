import { useEffect, useState } from 'react'
import '@/components/SettingPanel.scss'
import { TimeInfo, WorkTime } from '@/globat-type.ts'

type SetTimeFormatFunction = (childValue: boolean) => void

export interface SettingProps {
  setTimeFormat: SetTimeFormatFunction,
  is12Hr: boolean,
  workTime: WorkTime,
  visible: boolean,
  children: React.ReactElement,
  setWorkTime: any
}

const minutesList = (range:{min: number, max: number}, selected: number, changeDisplayTime: any) => {
  let list = []
  for (let i = range.min; i < range.max; i++) {
    list.push(
      <li className={`time-selector-item ${selected===i ? 'activated' : ''} `} key={i} onClick={()=>changeDisplayTime('minutes', i)}>
        {formatNumber(i)}
      </li>
    )
  }
  return list
}

const hourList = (isAM: boolean, is12Hr: boolean, selected: number, changeDisplayTime: any) => {
  const type = 'hours'
  let list = []

  if(is12Hr) {
    let range = {
      start: 0,
      end: 12
    }
    if(isAM) {
      for (let i = range.start; i < range.end; i++) {
        list.push(
          <li className={`time-selector-item ${(selected%12)===i ? 'activated' : ''} `} key={i} onClick={()=>changeDisplayTime(type, i)}>
            { formatNumber(i) }
          </li>
        )
      }
    } else {
      range.start = 1
      range.end = 12
      for (let i = range.start; i < range.end; i++) {
        list.push(
          <li className={`time-selector-item ${(selected%12)===i ? 'activated' : ''} `} key={i} onClick={()=>changeDisplayTime(type, i)}>
            { formatNumber(i) }
          </li>
        )
      }
      list.unshift(
        <li className={`time-selector-item ${selected%12===0 ? 'activated' : ''} `} key={12} onClick={()=>changeDisplayTime(type, 12)}>
          { formatNumber( 12 ) }
        </li>
      )
    }
  } else {
    for (let i = 0; i < 24; i++) {
      list.push(
        <li className={`time-selector-item ${selected===i ? 'activated' : ''} `} key={i} onClick={()=>changeDisplayTime(type, i)}>
          {formatNumber(i)}
        </li>
      )
    }
  }
  return list
}

interface TimeSelectorProps {
  visible: boolean,
  isStart: boolean,
  time: TimeInfo,
}
/** 时间选择器 */
function timeSelector (props: TimeSelectorProps, setProps: any, setWorkTime: any, is12Hr: boolean) {
  const {
    visible,
    isStart,
    time
  } = props

  const [displayTime, setDisplayTime] = useState({ ...time })
  useEffect(() => {
    setDisplayTime({ ...time });
  }, [time])

  const [isAM, setIsAM] = useState<boolean>(displayTime.hours < 12)
  useEffect(() => {
    setIsAM(displayTime.hours < 12);
  }, [displayTime.hours])


  const changeDisplayTime = (type: string, value: number) => {
    if(is12Hr && type === 'hours') {
      value = value % 12
      if(!isAM) {
        value = value + 12
      }
    }

    if(type === 'hours') {
      setDisplayTime((prevProps) => ({
        ...prevProps,
        hours: value
      }))
    } else if(type === 'minutes') {
      setDisplayTime((prevProps) => ({
        ...prevProps,
        minutes: value
      }))
    }
  }

  
  const handleCancel = () => {
    setProps((prevProps:TimeSelectorProps) => ({
      ...prevProps,
      visible: false
    }))
  }

  const handleOK = () => {
    if(is12Hr) {
      displayTime.hours = displayTime.hours % 12
      if(!isAM) {
        displayTime.hours = displayTime.hours + 12
      }
    }
    // console.log(displayTime)
    // 确定修改时间
    if(isStart) {
      setWorkTime((prevProps:WorkTime) => ({
        ...prevProps,
        start: {
          hours: displayTime.hours,
          minutes: displayTime.minutes,
          seconds: 0,
        }
      }))
    } else {
      setWorkTime((prevProps:WorkTime) => ({
        ...prevProps,
        end: {
          hours: displayTime.hours,
          minutes: displayTime.minutes,
          seconds: 0,
        }
      }))
    }

    setProps((prevProps:TimeSelectorProps) => ({
      ...prevProps,
      visible: false
    }))
  }

  return (
    <>
      <div className='pos-abs time-selector-panel' style={{ display: visible ? 'block' : 'none', width: is12Hr ? '160px' : '120px'}}>
        <div className='panel-title'>{isStart ? 'START-TIME' : 'END-TIME'}</div>
        <div className='flex h-m'>
          <span className='text'>HOUR</span>
          <span className='text'>MINUTE</span>
          <span className='text' style={{ display: is12Hr ? 'block' : 'none' }}></span>
        </div>
        <div className='flex list-wrap'>
          <ol className='list'>
            { hourList(isAM, is12Hr, displayTime.hours, changeDisplayTime) }
          </ol>
          <ol className='list'>
            { minutesList({min: 0, max: 60}, displayTime.minutes, changeDisplayTime) }
          </ol>
          <ol className='list' style={{ display: is12Hr ? 'block' : 'none' }}>
            <li className={`time-selector-item ${isAM ? 'activated' : ''}`} onClick={ () => setIsAM(true)}>AM</li>
            <li className={`time-selector-item ${!isAM ? 'activated' : ''}`} onClick={ () => setIsAM(false)}>PM</li>
          </ol>
        </div>
        <div className='flex action'>
          <button onClick={handleCancel}>CANCEL</button>
          <button onClick={handleOK}>OK</button>
        </div>
      </div>
    </>
  )
}

/** 不够两位数的补 0 格式器 */
const formatNumber = (num: number): string => {
  if (num < 10) {
    return `0${num}`
  } else {
    return num.toString()
  }
}

/** Settings 面板中，两个时间按钮的内容格式器 */
const workTimeDisplayFormatter = (time:TimeInfo, is12Hr:boolean):string => {
  let displayTime = `${formatNumber(time.hours)}:${formatNumber(time.minutes)}`
  if(is12Hr) {
    if(time.hours === 12) {
      displayTime = `${formatNumber(time.hours)}:${formatNumber(time.minutes)} PM`
    } else {
      displayTime = `${formatNumber(time.hours%12)}:${formatNumber(time.minutes)} ${time.hours>12 ? 'PM' : 'AM'}`
    }
  }
  return displayTime
}


function SettingPanel(props: SettingProps) {
  const {
    setTimeFormat,
    is12Hr,
    workTime,
    visible,
    children,
    setWorkTime
  } = props

  const [timeSelectorProps, setTimeSelectorProps] = useState({
    visible: false,
    isStart: true,
    time: {...workTime.start},
  })
  useEffect(() => {
    setTimeSelectorProps((prevProps) => ({
      ...prevProps,
      visible: false
    }))
  }, [visible])
  
  /** 改变显示格式，12小时/24小时
   * f 为 ture 时表示 12 小时，false 表示为 24 小时*/ 
  // setTimeFormat是从父组件传过来的操作函数
  const changeTimeFormat = (f:boolean) => {
    setTimeFormat(f)
  }

  return (
    <>
      <div style={{ display: 'inherit', position: 'relative' }}>
        <div className='setting-panel pos-abs' style={{ display: visible ? 'block' : 'none' }}>
          <ul className='flex flex-col setting-list'>
            <li className='flex align-center setting-item'>
              <div className='item-title'>TIME FORMAT</div>
              <div className='flex' style={{ gap: '4px'}}>
                <button className={is12Hr ? 'activated' : ''} onClick={()=>changeTimeFormat(true)}>12H</button>
                <button className={!is12Hr ? 'activated' : ''} onClick={()=>changeTimeFormat(false)}>24H</button>
              </div>
            </li>
            <li className='flex align-center setting-item'>
              <div className='item-title'>WORK START-TIME</div>
              <button onClick={()=> setTimeSelectorProps({visible: true, isStart: true, time: {...workTime.start}})} style={{ width: '74px'}}>{workTimeDisplayFormatter(workTime.start, is12Hr)}</button>
            </li>
            <li className='flex align-center setting-item'>
              <div className='item-title'>WORK END-TIME</div>
              <button onClick={()=> setTimeSelectorProps({visible: true, isStart: false, time: {...workTime.end}})} style={{ width: '74px'}}>{workTimeDisplayFormatter(workTime.end, is12Hr)}</button>
            </li>
          </ul>
        </div>
        { timeSelector(timeSelectorProps, setTimeSelectorProps, setWorkTime, is12Hr) }
        { children }
      </div>
    </>
  )
}

export default SettingPanel
