/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as RegisterRouteImport } from './routes/register'
import { Route as PaymentRouteImport } from './routes/payment'
import { Route as DashboardRouteImport } from './routes/dashboard'
import { Route as ChatSlugRouteImport } from './routes/chat.$slug'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const RegisterRoute = RegisterRouteImport.update({ id: '/register', path: '/register', getParentRoute: () => rootRouteImport } as any)
const PaymentRoute = PaymentRouteImport.update({ id: '/payment', path: '/payment', getParentRoute: () => rootRouteImport } as any)
const DashboardRoute = DashboardRouteImport.update({ id: '/dashboard', path: '/dashboard', getParentRoute: () => rootRouteImport } as any)
const ChatSlugRoute = ChatSlugRouteImport.update({ id: '/chat/$slug', path: '/chat/$slug', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/register': typeof RegisterRoute
  '/payment': typeof PaymentRoute
  '/dashboard': typeof DashboardRoute
  '/chat/$slug': typeof ChatSlugRoute
}
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/register': typeof RegisterRoute
  '/payment': typeof PaymentRoute
  '/dashboard': typeof DashboardRoute
  '/chat/$slug': typeof ChatSlugRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/register' | '/payment' | '/dashboard' | '/chat/$slug'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/register' | '/payment' | '/dashboard' | '/chat/$slug'
  id: '__root__' | '/' | '/register' | '/payment' | '/dashboard' | '/chat/$slug'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren { IndexRoute: typeof IndexRoute; RegisterRoute: typeof RegisterRoute; PaymentRoute: typeof PaymentRoute; DashboardRoute: typeof DashboardRoute; ChatSlugRoute: typeof ChatSlugRoute }
declare module '@tanstack/react-router' { interface FileRoutesByPath {
  '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
  '/register': { id: '/register'; path: '/register'; fullPath: '/register'; preLoaderRoute: typeof RegisterRouteImport; parentRoute: typeof rootRouteImport }
  '/payment': { id: '/payment'; path: '/payment'; fullPath: '/payment'; preLoaderRoute: typeof PaymentRouteImport; parentRoute: typeof rootRouteImport }
  '/dashboard': { id: '/dashboard'; path: '/dashboard'; fullPath: '/dashboard'; preLoaderRoute: typeof DashboardRouteImport; parentRoute: typeof rootRouteImport }
  '/chat/$slug': { id: '/chat/$slug'; path: '/chat/$slug'; fullPath: '/chat/$slug'; preLoaderRoute: typeof ChatSlugRouteImport; parentRoute: typeof rootRouteImport }
}}
const rootRouteChildren: RootRouteChildren = { IndexRoute, RegisterRoute, PaymentRoute, DashboardRoute, ChatSlugRoute }
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' { interface Register { ssr: true; router: Awaited<ReturnType<typeof getRouter>>; config: Awaited<ReturnType<typeof startInstance.getOptions>> } }
