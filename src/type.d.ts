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
