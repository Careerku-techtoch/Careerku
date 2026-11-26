import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell, OpportunityDetailDrawer } from '@/components'
import { CareerkuProvider } from '@/hooks'
import {
  AnalyzePage,
  AuthPage,
  DashboardPage,
  DiscoverPage,
  ProfilePage,
  TrackerPage,
  WelcomePage,
} from '@/pages'

function AppWorkspaceLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export function App() {
  return (
    <CareerkuProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route element={<AppWorkspaceLayout />}>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <OpportunityDetailDrawer />
    </CareerkuProvider>
  )
}

export default App
