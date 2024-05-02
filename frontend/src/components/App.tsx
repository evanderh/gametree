import Board from './Board/Board'
import BoardControls from './Board/BoardControls'
import MoveTree from './Tree/MoveTree'
import { createContext } from 'react'
import { BookNode } from '../chess'

import book from '../book.json'
import EngineInfo from './Engine/EngineInfo'
import EngineHeader from './Engine/EngineHeader'
import EngineControls from './Engine/EngineControls'
export const OpeningsContext = createContext<BookNode>(book as BookNode);

const size = 'sm:h-screen sm:w-screen sm:flex-row min-h-0'
const bg = 'bg-gradient-to-b from-[#ECECEC] via-neutral-100 to-[#ECECEC]'
const dark = 'dark:from-[#222] dark:via-neutral-800 dark:to-[#222]'
const classes = `flex flex-col ${size} ${dark} ${bg}`

function App() {
  return (
    <OpeningsContext.Provider value={book as BookNode}>
      <main className={classes}>
        <div className='flex-auto flex flex-col sm:w-1/2 md:w-2/5 lg:w-1/3 2xl:w-1/4'>
          <div className='flex-none aspect-w-1 aspect-h-1 w-full pt-1 pl-1'>
            <Board />
            <BoardControls />
          </div>
          <div className='flex-1 flex flex-col min-h-0'>
            <EngineHeader />
            <EngineInfo />
            <EngineControls />
          </div>
        </div>
        <div className='flex-auto sm:h-screen sm:w-1/2 md:w-3/5 lg:w-2/3 2xl:w-3/4'>
          <MoveTree />
        </div>
      </main>
    </OpeningsContext.Provider>
  )
}

export default App