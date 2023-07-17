import { useEffect, useState } from 'react'
import ColorBlock from '@/components/ColorBlock.tsx'
import StarFieldWatch from '@/components/StarFieldWatch.tsx'
import SettingPanel from '@/components/SettingPanel.tsx'
import Background from '@/components/Background.tsx'
import '@/App.scss'


const getCookie = (key: string): string | null => {
  const name = key + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(';')

  for (const cookie of cookieArray) {
    let c = cookie.trim()
    if(c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return null
} 

function App() {
  // 是否显示setting面板
  const [showSettings, toggleSetting] = useState(false)

  const [showBG, toggleBG] = useState(()=>{
    if(getCookie('showBG') === null) {
      return true
    } else {
      return getCookie('showBG') === 'true'
    }
  })
  useEffect(() => {
    document.cookie = `showBG=${JSON.stringify(showBG)}`
  }, [showBG])

  const workTimeStr = getCookie('workTime')
  const defaultWorkTime = {
    start: {
      hours: 9,
      minutes: 0,
      seconds: 0
    },
    end: {
      hours: 18,
      minutes: 0,
      seconds: 0
    }
  }
  const [workTime, setWorkTime] = useState(workTimeStr ? JSON.parse(workTimeStr) : defaultWorkTime)
  useEffect(() => {
    document.cookie = `workTime=${JSON.stringify(workTime)}`
  }, [workTime])

  // 显示格式，是否12小时制
  const [is12Hr, setIs12Hr] = useState(getCookie('is12Hr')==='true')
  useEffect(() => {
    document.cookie = `is12Hr=${JSON.stringify(is12Hr)}`
  }, [is12Hr])

  /** format 为 true 时代表 12 小时显示，false 为 24 小时显示 */
  const setTimeFormat = (format:boolean) => {
    setIs12Hr(format)
  }


  return (
    <>
      <div className='large-title'>
        <ColorBlock isVertical={false}/>
        <div className='text'>
          <div className='invert-text'>UNOFFICIAL</div>
          <div>
            <div className='title-text'>STARFIELD</div>
            <div className='title-text'>CHRONOMARK</div>
          </div>
        </div>
      </div>

      <div className='flex flex-col align-center contents'>
        <div className='flex align-center small-title'>
          <div className='top-color-block'>
            <ColorBlock isVertical={true} />
          </div>
          <div className='small-title-text'>
            STARFIELD<br/>FANART
          </div> 
        </div>
        <StarFieldWatch 
          is12Hr={is12Hr}
          isContinuously={true}
          workTime={workTime}/>
        <div className='flex justify-between actions global-padding' style={{ width: '100%' }}>
          <button onClick={()=>open('https://github.com/chankakit/unofficial-starfield-watch')}>GITHUB</button>
          <button onClick={()=>{ toggleBG(!showBG) }}>{ showBG ? 'HIDE BG' : 'SHOW BG' }</button>
          <SettingPanel
            visible={showSettings} 
            is12Hr={is12Hr} 
            setTimeFormat={setTimeFormat}
            workTime={workTime}
            setWorkTime={setWorkTime}>
            <button onClick={()=> {toggleSetting(!showSettings)}}>SETTINGS</button>
          </SettingPanel>
        </div>
      </div>

      <Background visible={showBG}/>
    </>
  )
}

export default App
