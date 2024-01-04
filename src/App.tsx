import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Registration'
import { UserProvider, useUser } from './contexts/user.context'
import MainLayout from './layout/Layout'
import PrivateRoute from './components/PrivateRoute'
import AdminPage from './pages/Administrator'
import UserDetails from './pages/UserDetails'
import UsersPage from './pages/Users'
import ShiftUsersPage from './pages/ShiftUsers'
import ShiftsPage from './pages/Shifts'

function App() {
  const { user: context_user } = useUser()
  const localUser = localStorage.getItem('user_info')
  const initialUser = localUser ? JSON.parse(localUser) : null

  const user = context_user || initialUser

  return (
    <div className='App'>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route
              path='/login'
              element={user ? <Navigate to='/' /> : <Login />}
            />
            <Route
              path='/register'
              element={user ? <Navigate to='/' /> : <Register />}
            />
            <Route path='/' element={<MainLayout />}>
              <Route
                path='/'
                element={<PrivateRoute element={<AdminPage />} />}
              />

              <Route
                path='/users/:userId'
                element={<PrivateRoute element={<UserDetails edit />} />}
              />
              <Route
                path='/profile/:userId'
                element={<PrivateRoute element={<UserDetails profile />} />}
              />
              <Route
                path='/users'
                element={<PrivateRoute element={<UsersPage />} />}
              />
              <Route
                path='/shifts'
                element={<PrivateRoute element={<ShiftsPage />} />}
              />
              <Route
                path='/shifts/:shiftId/users'
                element={<PrivateRoute element={<ShiftUsersPage />} />}
              />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
