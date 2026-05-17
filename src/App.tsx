import BottomBar from "./components/BottomBar"
import CoolIntro from "./components/CoolIntro"
import { ScrollArea } from "./components/ui/scroll-area"

export function App() {
  return (
    <>
      <ScrollArea className="h-screen w-screen">
        <CoolIntro />
      </ScrollArea>
      <BottomBar />
    </>
  )
}

export default App
