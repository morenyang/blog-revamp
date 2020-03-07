---
title: 'JS学习笔记 : 箭头函数'
date: '2019-10-06'
description: 'What about this?'
categories:
  - Javascript
---

箭头函数`=>`是 ES6 引入的新特性。但说到底，讨论箭头函数，很多时候实质上是在讨论`this`。

## 动机 : 更简短的函数

引入箭头函数的一个很大的动机就是使函数看起来更简短。

在 ES6 中，开发者可以使用一个参数，一个`=>`和一个由参数推出结果的表达式来构建一个函数：

```js
const arr = [1, 2, 3]

// ES5
const twiceArr = arr.map(function(i) {
  return i * 2
})

// ES6
const _twiceArr = arr.map(i => i * 2)
```

如果这个函数是空参或多个参数，需要将参数列表用`()`包裹：

```js
const getEmptyArray = () => []

const sum = (a, b) => a + b
```

如果可以由参数简单地推出一个对象作为返回值，需要将表达式用`()`包裹，否则引擎会把它当做函数体处理：

```js
const getHeadItems = ([first, second, third]) => ({ first, second, third })

getHeadItems([1, 2, 3, 4])
// -> {first: 1, second: 2, third: 3}
```

如果结果不能直接使用一行表达式推出，需要使用`{}`包裹函数体并添加`return`：

```js
const foo = ({ bar, baz }) => {
  const isBarEmpty = bar.isEmpty()
  if (isBarEmpty) {
    return baz
  }
  return baz * bar.times
}
```

以上是箭头函数的基本语法。使用箭头函数确实能使函数写起来和看起来变得更简洁——当然，这仅限于简单的函数中——如果把一个十几二十行的函数用箭头函数书写，那这些不带括号的家伙很有可能在阅读的时候让人感到迷惑。因此，不要只是为了使函数变得更简洁而使用箭头函数，还需要考虑一下函数的复杂度。

## 动机 : 不绑定`this`

除了简洁之外，箭头函数更重要的特性是，**它没有也不会拥有属于自己的`this`值**。箭头函数中的`this`值继承自**包围的作用域**。

换句话说，箭头函数不应该被当做一个**函数**看待，而应该被认为是一句**表达式**。

这个特性在一些情况下能使代码更简洁更符合直觉。先来看一个例子，这样的 hack 会经常出现在代码中：

```js
function Timer() {
  this.times = 0
  const _self = this
  setInterval(function increase() {
    _self.times++
  }, 1000)
}
```

在上面的例子中，`increase`函数想要表达的真实意图应该是`this.times++`，但由于`function`函数总会自带`this`作用域，不得依赖一个中间变量`_self`来使内部函数获取外部函数的`this`。

如果使用箭头函数，就可以去掉`this`作用域的 hack：

```js
function AnotherTimer() {
  this.times = 0
  setInterval(() => this.times++, 1000)
}
```

这看起来十分美好而且简洁。

当然，这只是事物美好的一面，在某项不合适场景下使用箭头函数可能会引发一些混乱，例如下面这个例子：

```js
const foo = {
  bar: () => {
    this.baz()
  },
  baz: () => {
    console.log('Hello')
  },
}

foo.bar()
// Uncaught TypeError: this.baz is not a function
```

这是由于`foo.bar`函数的`this`作用域并没有指向`foo`，而是从包围的作用域中词法继承，也就是这是`this`指向全局作用域。

上文中说到，箭头函数不会拥有自己的`this`。因此，不论`call`、`apply`还是`bind`，都无法将`this`绑定到一个箭头函数上：

```js
const sum = () => this.a + this.b

const foo = sum.bind({ a: 1, b: 2 })

foo()
// -> NaN
```

在使用箭头函数的时候，还有几点需要注意的，如果把箭头函数当做是一个表达式的话会更好理解一些：

- 在箭头函数中**没有自己的`arguemnts`数组**，它同样继承自父层。当然，在 ES6 中，你可以使用 rest parameter，或是赋予参数默认值。
- 箭头函数不能用作构造器，也就是不能使用`new`关键字进行实例化。
- 箭头函数没有`prototype`属性。
- 箭头函数不能用作生成器，`yield`关键字通常不能在箭头函数中使用（除非是嵌套在允许使用的函数内）。

## 最后

箭头函数的存在一定是美好的，它提供了简洁的方式来实现一个函数，并解决了某些场景下不需要函数自身`this`变量的问题。但在实际使用时，仍然需要根据实际情况来决定。除了箭头函数外，ES6 中还提供了更多与函数有关的特性或语法，都可以搭配使用。

## 参考

- [Arrow function expressions - MDN
  ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- 《你不知道的 JavaScript 下卷》第二部分 2.8 章
