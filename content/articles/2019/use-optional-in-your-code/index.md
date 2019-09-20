---
title: '在代码中使用 Optional'
date: 2019-09-20
---

`Optional`类是 Java 8 提供的新特性。在日常 Coding 中能使代码变得更优雅和简洁。

## 动机

一句话概括，`Optional`类是为了更好的预防运行中出现`NullPointException`而生的。

例如这样的代码：

```java
class Foo {
  Bar bar = new Bar();
// getter and setter
// ...
}

class Bar {
  Buz buz = new Buz();
// getter and setter
// ...
}

class Buz {
  Cool cool = new Cool();
// getter and setter
// ...
}

class Cool {
  String str;
// getter and setter
// ...
}
```

如果想要取出一个`Foo`类型实例中层层包裹的 str 并保证过程是安全的，需要这么做：

```java
class Foo {

  String getStr(Foo foo) {
    if (foo.getBar() == null) {
      return null;
    }
    if (foo.getBar().getBuz() == null) {
      return null;
    }
    if (foo.getBar().getBuz().getCool() == null) {
      return null;
    }
    return foo.getBar().getBuz().getCool().getStr();
  }
}
```

为了避免出现`NullPointException`，开发者必须层层深入，层层取出中间的元素并判空。随着业务逻辑复杂度的加深，代码也会变得更加杂乱。这时候就需要一个更为优雅的方式来帮助避免 NPE 的发生——使用`Optional`类：

```java
class Foo {

  String getStr(Foo foo) {
    return Optional.of(foo)
      .map(Foo::getBar)
      .map(Bar::getBuz)
      .map(Buz::getCool)
      .map(Cool::getStr)
      .orElse(null);
  }
}
```

就如上面的代码所示，只需要一个简单的链式调用就可以实现相同的逻辑。这个方式可以让开发者将精力放在关心业务上的数据操作中，也能减少代码中的条件语句，提高可读性。

## 本质

`Optional` 类的实例实际上是一个容器。这个容器中可以保存两种值：对应类型`T`的值或是`null`。换句话说，就是容器有两种状态：有东西或者没有东西。

在打开这个容器的之前，是无法知道容器的状态的。这个时候，可以把容器中的“东西”看做是存在又不存在*叠加态*。可以对处于叠加态的“东西”进行一系列操作——直到要取出它为止。

> 实际上，如果放入一个已经确定的值到`Optional`容器中，是可以知道容器的状态的。但是在实际使用场景下，使用者应该认为并不知道容器是否为空。

在打开这个容器取出里面的“东西”的时候，需要制定一个*Plan B*来解决一个可能出现的问题——万一空了怎么办。一般来说有三种选择：默认值、另找一个新的值替代或是抛出异常。

当然，如果不需要关心容器中的“东西”是什么，只在乎容器是否为空的话，也可以直接把容器打开，并把是否为空作为一个参数使用，或是只在容器不为空的时候做一些操作。

## 使用

`Optional`容器的构造方法可以分为两种，一是可以使用`Optional.empty()`直接获得一个空的容器，二是可以使用`Optional.of(T value)`或`Optional.ofNullable(T value)`创建一个非空或可能为空的容器。

可以使用`isPresent()`方法获取容器的状态，例如：

```java
Optional<> empty = Optional.empty();
if(!empty.isPresent()){
  System.out.println("Container is empty!")
}
// -> Container is empty!

Optional<String> str = Optional.of("Hello World");
if(str.isPresent()){
  System.out.println("Container is not empty!")
}
// -> Container is not empty!
```

也可以使用`ifPresent(Consumer<? super T> consumer)`方法在容器不为空时执行一段表达式：

```java
Optional<String> str = Optional.of("Hello World");
str.ifPresent(System::out.println)
// -> Hello World
```

可以使用`get()`方法直接获取容器中的对象，也可以使用`orElse(T other)`、`orElseGet(Supplier<? extends T> other)`、`orElseThrow(Supplier<? extends X> exceptionSupplier) throws X extends Throwable`取出容器中的对象并在容器为空的时候用一个其他值替代或者抛出异常。例如：

```java
Optional.empty().orElse("Hello");
// -> "Hello"

Optional.empty().orElseGet(() -> new Foo());
// -> foo

Optional.empty().orElseThrow(() -> new RuntimeException());
// -> throw RuntimeException
```

除此之外，还可以对`Optional`类进行链式操作。

使用`filter`方法，可以判断`Optional`容器中的对象是否满足某一条件，如果满足则返回这个`Optional`容器，如果不满足则返回一个空容器。这个方法可以在一定程度上代替`if`，例如：

```java
Optional.of(foo)
  .filter(Foo::matchA).filter(Foo.matchB).filter(Util.matchC)
  .orElseThrow(() -> new RuntimeException());
```

使用`map`方法，对容器中的对象进行操作，并返回一个包含新对象的容器。例如：

```java
Optional.of(library)
  .map(Library::getBook)
  .map(Book::getAuthor)
  .ifPresent(Sysout.out::println);
```

类似的，`flatMap`方法也可以实现对容器中对象的操作，但返回的是新的对象本身。

## 总结

纵观 Java 8 提供的几个新特性：Lambda 表达式、Stream API 和 Optional 类，似乎都在向开发者提供使代码更加简洁的方案。这三个特性或多或少的让开发者使用链式调用的方式来实现代码，使更整洁也更方便。

### refs

- [Optional - Java Docs](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)
- [Tired of Null Pointer Exceptions? Consider Using Java SE 8's `Optional`!](https://www.oracle.com/technetwork/articles/java/java8-optional-2175753.html)
