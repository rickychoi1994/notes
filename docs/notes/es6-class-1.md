# ES6中的类 - 基础

在es6没有发布之前，可以通过构造函数来创建实例对象

```javascript
function Point(x, y) {
  this.x = x
  this.y = y
}
// this指向创建的实例

Point.prototype.getPosition = function () {
  return '(' + this.x + ', ' + this.y + ')'
}

var p = new Point(1, 3)
p // Point {x: 1, y: 3}
p.getPosition() //(1, 3)
```

在es6中的类

```javascript
class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  getPosition () {
    return `(${this.x}, ${this.y})`
  }
}

let p = new Point(1, 3)
p // Point {x: 1, y: 3}
p.getPosition() //(1, 3)
```

::: warning
在es6中用类来创建实例必须用 `new`

判断一个属性是不是实例自身的可以用 `实例.hasOwnProperty(属性名)`，若返回值为 `true` 则是，反之不是

判断实例是不是有 `getPosition` 方法，也可以用这个方法，但返回值为 `false`

因为实例的方法是继承于类的
:::

## 取值函数和存值函数

在es6之前

```javascript
var info = {
  _age: 18,
  set age (newValue) {
    if (newValue > 18) {
      console.log('大于18')
    } else {
      console.log('小于或等于18')
    }
  },
  get age () {
    return this._age
  }
}

info.age // 18
info.age = 17 // 小于或等于18
```

在es6的类中

```javascript
class Info {
  constructor (age) {
    this._age = age
  }

  set age (newAge) {
    console.log('new age:', newAge)
    this._age = newAge
  }

  get age () {
    return this._age
  }
}

let info = new Info(18)
info.age = 17 // new age 17
info.age // 17
```

## class 表达式

函数有两种定义形式

```javascript
// 1.
const func = function () {}
// 2.
function func () {}
```

类也有两种定义形式

```javascript
// 1.
class Info {
  constructor () {}
}
// 2.
const Info = class c {
  constructor () {}
}
// 最终，类的名字是 Info 并不是 c，所以可以省略 class 后的名字
const Info = class {
  constructor () {}
}
```

## 静态方法

定义类时，定义在类里的方法都会被创建的实例继承，若不希望方法被实例继承，可以用 `static` 来实现

```javascript
class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  getPosition () {
    return `(${this.x}, ${this.y})`
  }

  static getClassName () {
    return Point.name
  }
}

let p = new Point(1, 3)
p.getPosition() // (1, 3)

p.getClassName() // error --- p.getClassName is not a function
// 类的静态方法实例是继承不了的，只能类自身来调用
Point.getClassName() // Point
```

## 实例属性的其它写法

```javascript
class Point {
  z = 0
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}
let p = new Point(1, 3)
p // Point {z: 0, x: 1, y:3}
```

## 静态属性

目前es6只有静态方法和没有静态属性，但可以通过技巧来实现

```javascript
class Point {
  constructor () {
    this.x = 0
  }

  // 在新的提案中提到可以这样来实现静态属性，暂未通过
  // static y = 2
}

Point.y = 2
let p = new Point()
p.x // 0
p.y // undefined
```

## 私有方法

只希望方法在模块内部使用并不暴露给使用者，es6并没有提供私有方法和私有属性，但可以通过一些技巧来实现

1. 用命名来区分，这样做的意义并不大
```javascript
class Point {
  func1 () {}

  // 定义为私有方法，但还是可以调用的
  _func2 () {}
}
```

2. 将私有方法移出模块

```javascript
const _func2 = () => {}

class Point {
  // 若想从外部调用类内部的方法可以写成这样
  func1 () {
    _func2.call(this)
  }
}
```

3. 利用Symbol值

在 `a.js` 中

```javascript
const func1 = Symbol('func1')

export default class Point {
  static [func1] () {}
}
```

在 `b.js` 中

```javascript
import Point from 'a.js'

let p = new Point()
```

因为Symbol值是特性，所以在没有导出symbol值的外部无法调用以symbol值为名的函数

## 私有属性

::: danger
在新的提案中，可以用 `#` 号来定义私有属性，但没有发布，暂时还无法使用
:::

```javascript
class Point {
  #ownProp = 1
}
```

### new.target属性

new.target属性会返回 `new` 命令作用于的构造函数

```javascript
function Point() {
  console.log(new.target)
}

let p = new Point()
// console 结果
// ƒ Point () {
//   console.log(new.target)
// }

// 若直接调用
let p2 = Point() // undefined
```

在es6的类中

```javascript
class Point {
  constructor () {
    console.log(new.target)
  }
}

let p = new Point()

// console 结果
// class Point {
//   constructor () {
//     console.log(new.target)
//   }
// }
```

可以利用这个特点来实现，定义一个类，但不能直接使用这个类来创建实例，只能通过这个类的子类来创建实例

```javascript
class Parent {
  constructor () {
    if (new.target === Parent) {
      throw new Error('不能创建实例')
    }
  }
}

class Child extends Parent {
  constructor () {
    super()
  }
}

let p = new Child()

// console 结果
// let p = new Parent()
// class Child extends Parent{
//   constructor () {
//     super()
//   }
// }

let p2 = new Parent() // 抛出错误信息
```
