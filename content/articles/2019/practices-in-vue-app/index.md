---
title: '如何更好地构建 Vue 应用'
date: 2019-10-01
---

作为当今很流行的用于构建前端界面的库，Vue 常被冠以“上手容易”、“适合初学者”的名号，可能很多小白选手练习一个月就被抓去做大项目了。

然而，由于 Vue 的代码风格过于灵活，实现同一个目标常常有多种方案，很容易自己给自己挖坑——当 PO 要加需求，或者是心血来潮想要优化代码的时候，才发现掉进了一个无底洞。

本文将介绍一些 Vue 应用的实践方案供小白参考。在*遵守代码规范*的前提下，可以尝试 follow 文中提出的一些思路，让自己的代码更加可读、更加有条理。

## 理解 `view = f(data)`

在开始之前，先要介绍一个简单的思路。这对理解应用是如何运行的有一些帮助。

这实际上是 React 中的公式，但一些情况下，在 Vue 中也适用。这个函数表达的意思是：视图长什么样，是根据组件的`render`函数（也就是模板）和组件的状态（state）来决定的。由于应用运行时，`render`函数不会改变，因此，给定一个 data，就能推算出一个唯一的 view。

在这个公式下，可以近似的认为，这些类似 MVVM 架构的界面库做的就是一件事：根据数据绘制出对应的视图，当数据更新时，重绘视图。

> 实际上，Vue 是如何决定是否重绘，以及决定重绘哪一些节点，有其复杂的逻辑。感兴趣的同学可以去看一看 MVVM 框架的实现原理。

带着这个思路，可以上道了。

## 减少数据来源

减少数据来源指的是，减少应用中带有**业务数据**的组件。

在构建一个区块级组件（区块拆分的粒度就见仁见智了）时，应该只在最顶级的组件（可以称为 Container 组件）中存放业务数据、和后端进行交互，并将所有会对业务数据有影响的其他数据和逻辑放在这里。而其子组件则只负责根据父组件提供的参数绘制界面，并将用户触发的动作传递给父组件。

这么做是为了应用中的数据组织更简单，避免在 debug 和重构代码时，因为找不到数据来源而浪费时间。另外，这样的模式可以使视图组件复用率更高——例如一些表格页面、图表组件就可以抽象出来，在使用时只需要赋予几个参数即可。

如果在应用中使用了 Vuex 这种单一 Store，也应该尽量只在 Container 组件中与 Store 进行绑定以及调用 actions。

## 合理使用`methods`与`computed`

在应用中，每一个`methods`中的方法应该只 handle 用户的操作，并尽量少的更改`data`中的内容，而需要计算得来的内容则全部放在`computed`中。

这里其实牵扯到数据依赖的问题，举个具体的例子：某个组件拥有用户输入的数字`A`，以及一个 Tabs。当用户选择`Tab 1`的时候就显示`1 * A`的值，当用户选择`Tab 2`的时候就显示`2 * A`的值。这里假设 Tabs 绑定的值是`B`，显示的值是`C`，有一些同学会这么写：

```js
export default {
  data() {
    return {
      a: 1,
      b: 1,
      c: 1,
    }
  },
  methods: {
    handleTabChange(val) {
      this.b = val
      this.c = val * a
    },
  },
}
```

这种做法完全没有问题，但是如果影响`C`的变量变多，则必须要在每个方法中都去重复计算，在未来需求变化或重构时很可能带来不必要的麻烦。针对这种 case，应该先理清变量之间的依赖，把可以确定的计算放到`computed`中。这个例子中，可以由`A`和`B`推出`C`，因此这么写会更好：

```js
export default {
  data() {
    return {
      a: 1,
      b: 1,
    }
  },
  computed: {
    c() {
      return a * b
    },
  },
  methods: {
    handleTabChange(val) {
      this.b = val
    },
  },
}
```

这里只是举一个简单的例子，实际的应用中这些数据与数据间的相互依赖很有可能会非常复杂。因此，让函数的功能专一，让值的推导更清晰是有很大必要的。

如果使用了 Vuex，也可以通过定义`getters`来实现值的推导。

## 抽取计算函数

这其实还是一个与`computed`和`methods`有关的问题。如果某个`computed`属性的计算过程很复杂，经常会有同学这写成这样：

```js
export default {
  data() {
    return {
      list: [
        // something...
      ],
      bar: {
        // somethind
      },
      baz: false,
    }
  },
  computed: {
    groupedList() {
      return this.getGroupedList()
    },
  },
  methods: {
    getGroupedList() {
      // do something with this.list, this.bar and this.baz
    },
  },
}
```

但实际上并不推荐这么做——在实践中应更倾向于认为，`methods`中的方法是为了响应用户动作和组件生命周期而声明的。这类纯计算函数如果过长或过于复杂，推荐抽取到单独的 util 文件中，不进更清晰明了，便于迁移和复用，也摆脱了对组件的依赖，并方便测试。

## 为 action 添加返回值

在 Vue 中，action 被用作执行异步请求并提交结果给到 mutation。在实际应用中，很可能需要在异步任务执行完后在执行一些动作，例如显示一个消息提示，由于不应该在 store 中做任何与数据无关的事情，因此这个动作需要在组件中完成。

如果 action 没有任何返回，如下面这个例子：

```js
// store.actions
foo ({commit}){
    api.fetchList()
     .then(res => {
        commit('UPDATE_LIST', res)
        console.log('update store')
     })
}

// component
export default {
    methods: {
        async cool(){
            await this.$store.dispatch('foo')
            console.log('success')
        }
    }
}

// output:
// -> success
// -> update store
```

当`cool`执行时，会先输出`success`再输出`update store`，与实际的业务不符。为了避免可能出现的这种 case，推荐将所有 action 都加入**异步**返回值：

```js
// store.actions
const actions = {
  bar({ commit }) {
    // return Promise
    return api.fetchList().then(res => {
      commit('UPDATE_LIST', res)
      console.log('update store')
    })
  },
}

// component
export default {
  methods: {
    async cool() {
      await this.$store.dispatch('bar')
      console.log('success')
    },
  },
}

// output:
// -> update store
// -> success
```

这样，就能保证在任何情况下，都有方法知道某个 action 是否执行，同时也更方便进行异常处理。

## 最后

以上就是这次分享的几个 Vue 开发过程中的比较好的实践，希望对各位小白有帮助。另外要说的是，不论何时都应该先 follow 自己团队内部的代码规范，以及一些通用的规范和实践，毕竟拥有好的代码风格习惯，才是代码高质量的基础。

Vue 官方有一个[Style Guide](https://vuejs.org/v2/style-guide/)，各位同学也可以参考一下。
