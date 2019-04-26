# ES6中的类 - 进阶

## 继承

在es6之前

```javascript
function Food () {
  this.type = 'food'
}
Food.prototype.getType = function () {
  return this.type
}
function Vegetables (name) {
  this.name = name
}
Vegetables.prototype = new Food()

tomato.getType() // food
```

在es6中

```javascript
class Parent {
  constructor (name) {
    this.name = name
  }
  getName () {
    return this.name
  }
  static getSelfName () {
    return this.name
  }
}

class Child extends Parent {
  constructor (name, age) {
    // 只有子类中调用了super后，子类才能使用this，给super传参相当于给父类传参
    super(name)
    this.age = age
  }
}

const c = new Child('Tom', 18)

console.log(c) // Child {name: "Tom", age: 19}
console.log(c.getName()) // Tom
console.log(c instanceof Child) // true
console.log(c instanceof Parent) // true
```

::: tip
子类可以继承父类的静态方法，相当于在子类中又将父类的静态方法定义了一遍，所以，子类继承的静态方法中的this指向的是子类

如果想获取一个类的父类，可以用 `Object.getPrototypeOf()`
:::

## super函数

super函数有两种使用方式

作为函数使用：super代表父类的constructor，子类中的constructor必须调用super，而且调用super后才能使用this。
子类继承父类后，父类中的this指向的是子类的实例

作为对象使用：
* 在普通方法中，指向的是父类的原型对象
* 在静态方法中，指向的是父类

```javascript
class Parent {
  constructor () {
    this.type = 'parent'
  }
  getName () {
    return this.type
  }
}
Parent.getType = () => {
  return 'is parent'
}

class Child extends Parent {
  constructor () {
    super()
    console.log('constructor:', super.getName()) // parent
  }

  getParentName () {
    console.log('getParentName:', super.getName()) // parent
  }

  getParentType () {
    console.log('getParentType:', super.getType()) // error not a funciton
  }

  static getParentType () {
    console.log('getParentType:', super.getType()) // is parent
  }
}

const c = new Child()
Child.getParentType() // is parent
```

## prototype & __proto__

`__proto__` 指向的是对应的构造函数的 `prototype`

```javascript
var obj = new Object()
obj.__proto__ === Object.prototype // true
```

::: tip
* 子类的 `__proto__` 指向的是父类本身

* 子类的 `prototype` 属性的 `__proto__` 指向的是父类的 `prototype`

* 实例的 `__proto__` 的 `__proto__` 指向的是父类实例的 `__proto__`
:::

## 原生构造函数的继承

原生构造函数：`Number` 、`String` 、`Boolean` 、`Array` 、`Date` 、`Function` 、`Error` 、`Object` 、`RegExp`

在es6中(es6之前无法继承原生构造函数)

```javascript
class CustomArray extends Array {
  constructor (...args) {
    super(...args)
  }
}

const arr = new CustomArray(3)

console.log(arr) // [empty x 3]

arr.fill(1) // [1, 1, 1]

arr.join('_') // 1_1_1
```
