---
title: '三百行代码构建玩具级MVVM框架'
date: 2019-09-06
draft: true
---

MVVM 是目前前端框架中最流行的设计模式之一。Angular、Vue 都使用了这种设计模式。听起来似乎很高端，但实现起来是否十分繁琐呢？其实只需要三百行代码就能实现一个类似 Vue 的玩具级 MVVM 框架。

## VM 是什么

在讨论如何实现 MVVM 前，需要先明白 VM 是什么。

VM 是 MVVM“核心”。在 MVVM 模式下，View 和 Model 之间并没有直接联系，而是由 VM 来维护二者之间的状态统一。当 View 中绑定的数据改变时，会由 VM 自动更新对应的 Model；当 Model 中的数据改变时，也会由 VM 来更新与之对应的视图。

这种方式被称为双向数据绑定。ViewModel 就是实现 View 和 Model 中状态同步的一个机器。在这个模式下，开发者可以更专注于如何实现业务细节，只需要定义业务需要的数据，再根据数据定义与之对应的视图，以及事件响应的逻辑，而不需要关心如何操作 DOM、如何实现数据与视图统一的问题。

## 如何响应变化

响应变化是 MVVM 框架中很重要的一步。JS 中的 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 可以帮助这一步的实现。

> `Object.defineProperty(obj, prop, descriptor)`

`Object.defineProperty` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

在这个方法中，可以为属性定义`getter`和`setter`方法。因此，只需要在属性的`setter`方法中加入更新 DOM 节点的操作就能实现一个简单的视图响应：

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return val
    },
    set(newValue) {
      // update dom
      // domElement.value = newValue;
      val = newValue
    },
  })
}
```

通过以上的代码，可以实现在对象中的某个字段发生改变时，去更新与之对应的 DOM 节点。现在的问题是，如何知道有哪些 DOM 节点需要更新。

## 如何绑定依赖

可以使用一个巧妙地方法来解决这个问题。某个属性中需要去响应变化的地方，也一定会在生成的时候访问这个字段。换句话说，就是在生成 DOM 节点的时候会调用其依赖字段的`getter`方法。

那么这个问题就好办了——只需要在字段`getter`中加入收集依赖的方法，并在字段`setter`中逐个通知这些收集到的依赖即可。

这一步的实现逻辑大致是这样的：

1. 某处依赖（可以理解成 DOM）节点生成时，为其创建一个更新依赖的方法
2. 将一个全局变量`depTarget`指向这个方法
3. 在这个方法中获取被依赖字段的值
4. 在访问被依赖字段的同时，将这个方法从`depTarget`中取出，加入字段的`deps`数组中
5. 获取值被依赖字段值后，将`depTarget`置为空，返回该字段的值
6. 在字段的值改变时，调用绑定的依赖

依据这个思路，可以完善上文中的`defineReactive`方法：

```js
function defineReactive(obj, key, value) {
  const deps = []
  const _this = this
  this.observe(value)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      depTarget && deps.push(depTarget)
      return value
    },
    set(newVal) {
      if (newVal === value) {
        return
      }
      _this.observe(newVal)
      value = newVal
      deps.forEach(watcher => watcher.update())
    },
  })
}
```

为了添加依赖和响应字段变化，可以实现如下的`watcher`类：

```js
class Watcher {
  constructor(instance, path, cb) {
    this.instance = instance
    this.path = path
    this.cb = cb
    this.value = this.getValue()
  }

  getValue() {
    depTarget = this
    let value = _.get(this.instance.$data, this.path)
    depTarget = null
    return value
  }

  update() {
    let newValue = _.get(this.instance.$data, this.path)
    if (newValue === this.value) {
      return
    }
    this.cb(newValue)
    this.value = newValue
  }
}
```

同时，可以将`defineReactive`包装在一个`Observer`类中：

```js
let depTarget = null

class Observer {
  constructor(data) {
    this.observe(data)
  }

  observe(data) {
    if (!data || typeof data !== 'object') {
      return
    }
    if (Array.isArray(data)) {
      data.forEach(value => this.observe(value))
    } else {
      Object.keys(data).forEach(key =>
        this.defineReactive(data, key, data[key])
      )
    }
  }

  defineReactive(obj, key, value) {
    // ...
  }
}
```

在上述的实例中，VM 的响应式功能已经被实现。当一个`Watcher`实例被创建时，会为其调用的 Model 中的字段添加一个依赖；当这个字段的值改变时，依赖就会被调用。现在只需要在依赖中实现更新 DOM 的逻辑，并为 DOM 添加更新值的方法，就能形成双向数据绑定的完整闭环。
