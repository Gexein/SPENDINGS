import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserStore } from './store/userStore/userStore.ts'
import { SpendingsStore } from './store/spendingsStore/spendingsStore.ts'

const userStore = new UserStore()
const spendingsStore = new SpendingsStore()

export const Context = createContext<{ user: UserStore, spendings: SpendingsStore }>({ user: userStore, spendings: spendingsStore })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Context.Provider value={{
      user: userStore,
      spendings: spendingsStore
    }}>
      <App />
    </Context.Provider>


  </StrictMode>,
)
