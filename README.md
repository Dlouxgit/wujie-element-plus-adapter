# wujie-element-plus-adapter

wujie 接入 element-plus 子应用时，子应用需要做的内容封装。
目的是为了对子应用屏蔽细节，不再繁琐适配。

包含以下内容：

- popover 样式的修复以及应用崩溃修复

- 子应用初始化执行的事件监听
  + main-route-change

- 子应用初始化执行的事件派发
  + sub-route-register

- 子应用路由切换执行的事件派发
  + sub-route-change

## 使用

调用 subAppInit，传入四个属性，会判断是否处于 wujie 环境下，不在 wujie 下则仅调用 init 方法。

```
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { router, changeRoutes } from './router';
import { subAppInit, type ISubAppInit } from 'wujie-element-plus-adapter';

const getApp = () => {
  return createApp(App);
};

let subRouter = router;

const init = (app?: ReturnType<typeof createApp>) => {
  if (!app) {
    app = getApp();
  }
  changeRoutes();
  app.use(createPinia());
  subRouter = router;
  app.use(router);
  app.use(i18n);
  app.mount('#app');
};

const namespace = 'saas';

subAppInit({
  init,
  getApp,
  getRouter: () => subRouter,
  namespace
} as unknown as ISubAppInit);

```

## License

[MIT](./LICENSE) License © 2023-PRESENT