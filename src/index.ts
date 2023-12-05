import { usePopperContainerId } from 'element-plus'
import type { createApp } from 'vue'
import type { Router } from 'vue-router'

function fixElementPlusTeleportCrash() {
  const { id, selector } = usePopperContainerId()
  if (!document.body.querySelector(selector.value)) {
    const container = createContainer(id.value)
    return () => {
      container.remove()
    }
  }
  return () => ({})
}

function createContainer(id: string) {
  const container = document.createElement('div')
  container.id = id
  document.body.appendChild(container)
  return container
}

export interface ISubAppInit {
  init: (app?: ReturnType<typeof createApp>) => void
  getApp: () => ReturnType<typeof createApp>
  getRouter: () => Router
  namespace: string
}

type TSubAppInit = (appInit: ISubAppInit) => void

let SUB_NAMESPACE = ''

export const subAppInit: TSubAppInit = ({
  init,
  getApp,
  getRouter,
  namespace,
}) => {
  if (window.__POWERED_BY_WUJIE__) {
    let mainAppPath = ''

    SUB_NAMESPACE = namespace

    let app: ReturnType<typeof createApp> | null = null
    let dispose: () => void

    window.__WUJIE_MOUNT = () => {
      app = getApp()
      init(app)
      dispose = fixElementPlusTeleportCrash()
      const router = getRouter()
      window.$wujie?.bus.$on('main-route-change', ({ path, ...query }: { path: string, query: Record<string, string> }) => {
        mainAppPath = `${path.replace(`/${SUB_NAMESPACE}`, '')}`
        router.replace({ path: mainAppPath, ...query })
      })

      router.beforeEach((to) => {
        if (to.path !== mainAppPath)
          window.$wujie?.bus.$emit('sub-route-change', SUB_NAMESPACE, to)
        else
          mainAppPath = ''
      })
      const routes = router.getRoutes()
      window.$wujie?.bus.$emit('sub-route-register', SUB_NAMESPACE, routes)
    }
    window.__WUJIE_UNMOUNT = () => {
      app?.unmount()
      dispose()
    }
    // module脚本异步加载，应用主动调用生命周期
    window.__WUJIE.mount()
  }
  else {
    init()
  }
}

declare global {
  interface Window {
    // 是否存在无界
    __POWERED_BY_WUJIE__?: boolean
    // 子应用mount函数
    __WUJIE_MOUNT: () => void
    // 子应用unmount函数
    __WUJIE_UNMOUNT: () => void
    // 子应用无界实例
    __WUJIE: { mount: () => void }
    // 注入对象
    $wujie: {
      bus: {
        $on: (eve: string, ...args: unknown[]) => void
        $emit: (eve: string, ...args: unknown[]) => void
      }
      shadowRoot?: ShadowRoot
      props?: {
        jump (q: { url?: string, name?: string }): void
        [key: string]: unknown
      }
      location?: { [key: string]: unknown }
    }
  }
}
