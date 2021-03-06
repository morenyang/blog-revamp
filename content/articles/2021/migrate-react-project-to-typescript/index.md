---
title: '将 React 项目迁移到 TypeScript'
date: '2021-03-06'
categories:
  - React
  - Typescript
---

TypeScript 显然是前端的未来。它有着类型约束，能带来更好的开发体验。在庞大的项目中，能让开发者的效率大大提升。

当你习惯使用 TypeScript 后，你会发现你已经无法回到那个只用 JavaScript 的项目中去了，起码我是这样的。当我拿到这个维护了几年，纯 JavaScript 编写的 React 项目时，竟不知道应该从哪里开始改起。代码缺少注释，参数类型要查半天才能搞明白...我不希望新的代码还要忍受这种痛苦了！

于是，我做了一个大胆的决定：把它迁移到 TypeScript。

## 方案选择

对于迁移来说，摆在面前的策略大致有几种，它们的 effort 不同，达到的效果也不同。

### 整体搬迁到 TypeScript

实际上，我一开始的想法是一步到位将项目迁移到 TypeScript 。它需要我们做：

- 为各层级之间的 API 准备类型定义文件
- 为第三方 library 安装 `@types` 定义
- 将项目的各个组件从 JS 转换成 TS ，同时将刚才准备的那些类型定义 apply 上
- 将项目的测试转换到 TS

这个方案的效果显然是最好的，毕竟所有组件都成了 TS 。当然，你不需要手动将 JS 代码逐个重写，社区中有很多工具能帮助你完成这个步骤，例如 [TypeStat](https://github.com/JoshuaKGoldberg/TypeStat) 和 Airbnb 的 [ts-migrate](https://github.com/airbnb/ts-migrate) 。

但是这一步对于我的项目来说风险和时间成本还是过大，在用了自动化工具后还需要检查各个组件是否有什么小问题（_实际上我用 ts-migrate 跑了一遍效果还凑合_），同时还有几万行的测试需要处理，一时半会搞不定，于是打消了这种念头。

### 拆分不同的包，逐步迁移

得益于 `yarn` 和 `npm@7+` 的 workspace 功能，开发者可以很容易的将项目变成一个 [monorepo](https://classic.yarnpkg.com/en/docs/workspaces/) 。可以在当前的项目中新建一个子项目，并将新的组件用 TypeScript 编写，并在旧的项目中引用它。大致思路是：

- 用 [tsdx](https://github.com/formium/tsdx) 新建一个子 package ，新的功能使用 TypeScript 在这个包中编写 （至少一些通用的组件可以在里面）
- 在主 package 中引用新建的 TS pakcage
- 逐步将主 package 中的组件搬迁到 TS package
- 找个机会将主 package 中剩余的代码迁移到 TS ，并将之前拆出来的组件选择性的挪回去

这个方案比较适合组件之间耦合不那么深，同时公共组件拆分比较好的项目。如果有足够多的人手，至少可以整出一个公共的 UI Library 。

但是，这么做实在是太麻烦了，需要在不同项目之间切换和打包。对于一些 store 的东西也不是太好 handle 。同时，手头上的这个项目的组件和全局的状态耦合的太深了，组件的单元测试写的也和集成测试差不多，难以搬迁。

### 让项目支持 TypeScript 和 JavaScript 混编

让项目同时支持 TypeScript 和 JavaScript 的代码，可以保持原有的代码不改变，并在未来的代码中使用 TypeScript 。

> That’s one small step for man, one giant leap for project.

尽管在一个项目中同时使用两种语言看起来有点蠢，但是确实是迁移过程最平缓，代价最小的方式。毕竟，我们在很多项目里实际上也是同时用着这两种语言（只不过 TS 被提前编译）。

在一个普通的 nodejs 项目中，需要尽快将 `.ts` 文件编译成 `.js` 和 `.d.ts` 文件，以获得比较好的开发体验。但是现在我们用上了 [babel](https://babeljs.io/) 和 [webpack](https://webpack.js.org/) ，可以直接在修改配置，并让两类文件相互调用。

## 改造和实现

### 配置 TypeScript

首先将 `typescript` 加入项目的依赖中并安装。

```bash
yarn add typescript
```

然后加入 TypeScript 的配置文件：将 tsconfig.json 放到项目的根目录下。这里我直接使用 CRA 的配置：

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": ["src"]
}
```

你也可以使用 `tsc --init` 来生成。

### 配置 babel 和 webpack

将 babel 的 TypeScript 预设加入项目依赖中，并添加到 babel 的配置文件里。

```bash
yarn add @babel/preset-typescript --dev
```

```json
// .babelrc

{
  "presets": [
    // other presets
    // ...
    "@babel/typescript"
  ]
  // other settings
  // ...
}
```

修改 webpack 的配置，将 TypeScript 文件加入 `resolve` 和`babel-loader` 的 match 规则中。

```js
// webpack.config.js

export default {
  // other settings
  // ...
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // ...
          },
        },
      },
    ],
  },
}
```

### 引入类型定义的 package

上一步完成后，实际上已经可以在代码中使用 TypeScript 了。但这时候如果你去写一个 React 组件，就会发现类似 `Cannot find module 'react'.` 的报错。这就需要将一些你用到的 library 的类型定义加进来了。

```bash
yarn add @types/react @types/react-dom @types/node #@types/<package-used-in-your-project>
```

如果有必要，还可以添加 `webpack-env` 的类型定义：

```bash
yarn add @types/webpack-env --dev
```

### 你的一小步

接着，你就可以实现“你的一小步”——使用 TypeScript 编写第一个组件：

```tsx
import React from 'react'

const HelloWorld: React.FC = () => {
  return <div>Hello World</div>
}

export default HelloWorld
```

并在 `.js` 文件中引入它：

```jsx
// other component.js
import HelloWorld from '../components/HelloWorld.tsx'

const HomePage = () => {
  return (
    <div>
      <HelloWorld />
    </div>
  )
}
```

对于那些需要在 TypeScript 中使用 JavaScript 的情况，如果是简单的组件，可以考虑用 `ts-migrate` 直接转换成 TypeScript 。如果是比较复杂，一时半会改不过来的组件，就先用 `any` 类型代替。

## 总结

使用 TypeScript 开发的体验实在是太好了，特别是 IDE 有各种智能提示、不全和类型检查的报错的情况下，效率简直加倍。如果你现在还在使用 JavaScript 来开发，强烈建议你试着用用 TypeScript 。

本文介绍了我手头上一个项目的开始向 TypeScript 迁移的方案。我觉得最让人激动的事情是开始了那 “one small step” ，至少，我可以一小步一小步地前推动技术的升级。

### Refs

- [Migrating (to TypeScript) Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/migration/intro)
- [ts-migrate: A Tool for Migrating to TypeScript at Scale](https://medium.com/airbnb-engineering/ts-migrate-a-tool-for-migrating-to-typescript-at-scale-cd23bfeb5cc) (Airbnb)
- [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html) (TypeScript Handbook)
