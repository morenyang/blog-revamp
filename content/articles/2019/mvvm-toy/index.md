---
title: '三百行代码构建玩具级 MVVM 框架'
date: 2019-09-14
categories:
  - Javascript
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

## 依赖收集

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

## 制作解析器

实际上，由于定义`template`方式的不同，解析器的实现方式也各不相同。为了方便，本文直接将 template 写在`public/index.html`中，在解析时直接取出 DOM 节点进行操作。

在把 template 解析成预期格式（可以直接是 DOM，也可以是 JSX 经过`createElement`生成的对象）并存入变量之后，就可以遍历 template 中的每个子节点，进行解析并绑定数据和相应方法。

以下面的代码为例。拿到一个不是`textNode`的节点之后，遍历节点的各个属性：

- 如果属性名是以`:model`开头的，为其绑定`value`属性并添加`input`的 event handler。
- 如果属性名是以`:`开头的，就对这个节点的对应属性绑定对应的值。
- 如果属性名是以`@`开头的，则对这个节点添加对应的 event handler。
- 如果都不满足，则将原属性绑定到节点上

```js
function isModel(attr) {
  return attr.startsWith(':model')
}

function isBindValue(attr) {
  return attr.startsWith(':')
}

function isCustomEvent(attr) {
  return attr.startsWith('@')
}

const createdNode = document.createElement(node.tagName)

// 遍历属性
node.getAttributeNames().forEach(attr => {
  const attrValue = node.getAttribute(attr)
  // 检测这个属性是不是绑定或 event
  if (isModel(attr)) {
    resolveModel(createdNode, attrValue, vm)
    return
  }
  if (isBindValue(attr)) {
    const [, valueName] = attr.split(':')
    resolveBind(createdNode, attrValue, vm, valueName)
    return
  }
  if (isCustomEvent(attr)) {
    const [, eventName] = attr.split('@')
    resolveEvent(createdNode, attrValue, vm, eventName)
    return
  }
  // 如果不是绑定或者event 则将原attr绑定到dom节点
  createdNode.setAttribute(attr, attrValue || '')
})
```

绑定自定义事件，将传入的 event handler 的`this`作用域指向 vm 实例。

```js
function resolveEvent(element, exp, instance, eventName) {
  element.addEventListener(eventName, e => instance[exp].call(instance, e))
}
```

添加属性绑定，为每处绑定创建一个`Watcher`实例，响应变化的方法就是`newVal => { element[valueName] = newVal }`。每当依赖的字段改变时，都会将新值设到对应的属性上。

```js
function resolveBind(element, exp, instance, valueName) {
  // 创建一个 watcher， watcher创建时会把回调函数和instance绑定到exp对象的订阅中
  new Watcher(instance, exp, nVal => {
    element[valueName] = nVal
  })

  element[valueName] = _.get(instance.$data, exp)
}
```

双向数据绑定的实现。实际上就是绑定`value`属性，并添加`input`的 handler。

```
function resolveModel(element, exp, instance) {
  this.resolveBind(element, exp, instance, 'value')
  element.addEventListener('input', e => {
    console.debug(e)
    let value = e.target.value
    _.set(instance.$data, exp, value)
  })
}
```

如果拿到的是`textNode`节点，则可以根据正则表达式替换对应的值，并为其添加响应。

```js
// 处理textNode
let content = node.textContent || ''
const createdNode = document.createTextNode(content)
// 匹配 {{}}
if (/\{\{(.+?)\}\}/.test(content)) {
  resolveText(createdNode, content, this.vm)
}

function resolveText(element, content, instance) {
  const _rawContent = content
  let reg = /\{\{(.+?)\}\}/
  let expr

  // 重新渲染textNode的逻辑
  function reRenderText() {
    let _content = _rawContent
    let _expr

    while ((_expr = _content.match(reg))) {
      // 替换模板值 {{ path }} -> real value
      _content = _content.replace(
        _expr[0],
        _.get(instance.$data, _expr[1].trim())
      )
    }
    element.textContent = _content
  }

  while ((expr = content.match(reg))) {
    const valPath = expr[1].trim()
    // 替换模板值 {{ path }} -> real value
    content = content.replace(expr[0], _.get(instance.$data, valPath))
    // 绑定watcher到 exp的数据上 当数据改变时，会触发Text重绘
    new Watcher(instance, valPath, reRenderText)
    element.textContent = content
  }
}
```

由于这些节点是嵌套的，在实际实现中需要对`compile`方法进行递归调用。

根据上文的`Observer`类、`Watcher`类和`Compiler`类，已经能基本实现 MVVM 框架中 View 与 Model 相互响应的闭环。现在，只需要创建一个入口即可完成这个玩具级 MVVM 框架。

## VM 的创建者

先花几秒钟思考一下，为 MVVM 框架创建一个入口，需要收集什么参数？

其实看一看 MVVM 四个大字就不难想到，要构建一个 VM，需要提供 View 和 Model——以及更新 Model 所需要的事件。为了方便使用，还可以提供一个类似 Vue 的`computed`属性。

依据这个思路，可以为这个 MVVM 类写一个构造函数出来：

```js
class MVVM {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data || {}
    const computed = options.computed
    const methods = options.methods
  }
}
```

在将所需要的值保存成变量后，通过`Observer`类将`$data`变为响应式。

```js
new Observer(this.$data)
```

处理`computed`，利用`Object.defineProperty`方法，将`computed`中的字段直接绑定到`instance.$data`上，并把字段的`this`指向这个实例。

```js
computed && this.bindComputed(computed, this)

function bindComputed(computed, _this) {
  Object.keys(computed).forEach(key => {
    Object.defineProperty(_this.$data, key, {
      enumerable: true,
      configurable: true,
      get() {
        return computed[key].call(_this)
      },
    })
  })
}
```

处理`methods`，原理类似，将`methods`中的字段绑定到实例上，并修改`this`的引用。

```js
methods && this.bindMethods(methods, _this)

function bindMethods(methods, _this) {
  Object.keys(methods).forEach(key => {
    Object.defineProperty(_this, key, {
      get() {
        return methods[key].bind(_this)
      },
    })
  })
}
```

接下来将`instance.$data`中的字段绑定到实例上。

```js
this.proxyData(this.$data)

function proxyData(data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get() {
        return data[key]
      },
      set(val) {
        data[key] = val
      },
    })
  })
}
```

至此，MVVM 框架的数据部分已经准备好了，只需要解析 template，并将上面定义的字段和方法与视图绑定就能完成。还记得上文中提到的`Compiler`类吗，调用它！

```js
new Compiler(this.$el, this)
```

声明 template 并在入口文件中调用它。

```html
<div id="app">
  <div class="wrapper">
    <input :model="msg" />
    <p>the value is {{ msg }}</p>
    <p>length: {{ msgLength }}</p>
    <button @click="reverse">reverse</button>
  </div>
</div>
```

```js
import MVVM from './mvvm'

const vm = new MVVM({
  el: document.getElementById('app'),
  data: {
    msg: 'Hello World!',
  },
  computed: {
    msgLength() {
      return this.msg.length
    },
  },
  methods: {
    reverse() {
      this.msg = this.msg.split('').reverse().join('')
    },
  },
})
```

## 总结

现在，一个简单的 MVVM 框架已经实现了。实现这个玩具级 MVVM 框架的难点和巧妙点都在`defineReactive`方法中。如果能理解依赖是如何被绑定的以及他们如何响应变化，那么理解这个框架的工作原理也不会太难。

本文中的完整代码可以在[Github](https://github.com/morenyang/mvvm-toy)上找到，有兴趣的小伙伴们可以点开代码参考。

### _refs_

- 知乎上的某几篇文章，现在时间久了也想不起来了。可以去知乎或掘金上搜相关关键字。
- [Reactivity in Depth - Vue.js](https://vuejs.org/v2/guide/reactivity.html)
