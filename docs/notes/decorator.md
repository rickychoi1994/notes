# 装饰器

[官方文档](https://www.tslang.cn/docs/handbook/decorators.html)

随着TypeScript和ES6里引入了类，在一些场景下我们需要额外的特性来支持标注或修改类及其成员。 装饰器（Decorators）为我们在类的声明及成员上通过元编程语法添加标注提供了一种方式。Javascript里的装饰器目前处在 建议征集的第二阶段，但在TypeScript里已做为一项实验性特性予以支持。

:::warning
注意  装饰器是一项实验性特性，在未来的版本中可能会发生改变。
:::

若要启用实验性的装饰器特性，你必须在命令行或tsconfig.json里启用experimentalDecorators编译器选项：

tsconfig.json:

```typescript
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

## 装饰器

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。 装饰器使用 `@expression` 这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

```typescript
function getName() {
  // ...
}

@getName()
```

## 装饰器工厂

如果要定制一个修饰器如何应用到一个声明上，得写一个装饰器工厂函数。 装饰器工厂就是一个简单的函数，它返回一个表达式，以供装饰器在运行时调用。

```typescript
function color(value: string) { // 这是一个装饰器工厂
  return function (target) {    //  这是装饰器
    // do something with "target" and "value"...
  }
}
```

## 装饰器组合

* 书写在同一行上：

```typescript
@f @g x
```

* 书写的多行上：

```typescript
@f
@g
x
```

在TypeScript里，当多个装饰器应用在一个声明上时会进行如下步骤的操作：

1. 由上至下依次对装饰器表达式求值。
2. 求值的结果会被当作函数，由下至上依次调用。

```typescript
function setName() {
  console.log('get setName')
  return function (target) {
    console.log('set Name')
  }
}

function setAge() {
  console.log('get setAge')
  return function (target) {
    console.log('set Age')
  }
}

@setName()
@setAge()
class ClassA {}

// get setName
// get setAge
// set Age
// set Name
```

## 装饰器求值

类中不同声明上的装饰器将按以下规定的顺序应用：

1. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
2. 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
3. 参数装饰器应用到构造函数。
4. 类装饰器应用到类。

## 类装饰器

类装饰器在类声明之前被声明（紧靠着类声明）。 类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。

类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数：

```typescript
let sign = null

function setName(name: string) {
  return function (target: new() => any) {
    sign = target
  }
}

@setName('demo')
class ClassDec {
  constructor() {}
}

sign === ClassDec // true
sign === Class.prototype.constructor // true
```

通过类装饰器可以修改类的原型对象和构造函数：

```typescript
function addName(constructor: new() => any) {
  constructor.prototype.name = 'jane'
}

@addName
class ClassDec {}
let d = new ClassDec()

d.name // Error 'ClassDec' 不存在属性 'name'

// 可以通过声明合并解决问题
class ClassDec {}
interface ClassDec {
  name: string;
}

d.name // 'jane'
```

如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明：

```typescript
function decotator<T extends new(...arg: any[]) => {}>(target: T) {
  return class extends target {
    newProperty = 'new Property'
    hello = 'hello'
  }
}

@decotator
class Greeter {
  public property = 'property'
  public hello: string
  constructor(m: string) {
    this.hello = m
  }
}

new Greeter('world')

// class_1 {
//   hello: 'hello',
//   newProperty: 'new Property',
//   property: 'property'
// }

function decotator(target: any): any {
  return class {
    newProperty = 'new Property'
    hello = 'hello'
  }
}

@decotator
class Greeter {
  public property = 'property'
  public hello: string
  constructor(m: string) {
    this.hello = m
  }
}

new Greeter('world')
// class_1 {
//   hello: 'hello',
//   newProperty: 'new Property',
// }
```

类装饰器可以用来修改类的实现。

:::warning
注意  如果你要返回一个新的构造函数，你必须注意处理好原来的原型链。 在运行时的装饰器调用逻辑中 不会为你做这些。
:::

## 方法装饰器

方法装饰器声明在一个方法的声明之前（紧靠着方法声明）。 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。

方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的属性描述符。

:::warning
注意  如果代码输出目标版本小于ES5，属性描述符将会是undefined。
:::

:::tip
属性描述符

对象可以设置属性，如果属性值是函数，那么这个函数称为方法。每个属性和方法被定义的时候都伴随着三个属性描述符：

1. configurable 可配置
2. writeable 可写
3. enumerable 写枚举

如果要修改这三个属性描述符需要用到 `Object.defineProperty()`，它有三个参数，第一个参数为目标对象，第二个参数为属性名或方法名，第三个方法是一个对象，它用来设置属性描述符，这个对象还有四个值，


`Object.defineProperty()` 有三个参数：

1. 目标对象
2. 属性名或方法名
3. 一个对象

第三个参数对象它有四个值，用来设置属性描述符：
1. value 给属性名设置的值，如果它是一个函数，则这个属性被称为方法
2. configurable
3. writeable
4. enumerable
:::

```typescript
// 定义一个接口可以有任意多个属性
interface ObjWithAnyKeys {
  [key: string]: any
}

let obj: ObjWithAnyKeys = {}

Object.defineProperty(obj, 'name', {
  value: 'jane',
  configurable: true,
  writeable: true,
  enumerable: true
})

// 当设置 configurable 的值为 true 时，这个对象将不会再配置。(操作不可逆)
```

```typescript
function enumerable(bool: boolean) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = bool
  }
}

class ClassDec {
  constructor(public age: number) {}

  @enumerable(false)
  getAge () {
    return this.age
  }
}

let dec = new ClassDec(18)
// ClassDec {age: 18}

// 现在在装饰器传入的是 false，当遍历实例时，只能得到 age 属性，是得不到 getAge 的。
```

如果方法装饰器返回一个值，它会被用作方法的属性描述符。

:::warning
注意  如果代码输出目标版本小于ES5返回值会被忽略。
:::

```typescript
// 修改一下装饰器，让它返回一个对象
function enumerable(bool: boolean):any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    return {
      value () {
        return 'not age'
      },
      enumerable: bool
    }
  }
}

// 此时在实例上使用 getAge 得到的是 'not age'，而不是原来的 this.age
```

## 访问器装饰器

访问器装饰器声明在一个访问器的声明之前（紧靠着访问器声明）。 访问器装饰器应用于访问器的 属性描述符并且可以用来监视，修改或替换一个访问器的定义。

:::warning
注意  TypeScript不允许同时装饰一个成员的get和set访问器。取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。这是因为，在装饰器应用于一个属性描述符时，它联合了get和set访问器，而不是分开声明的。
:::

访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 成员的属性描述符。

:::warning
注意  如果代码输出目标版本小于ES5，Property Descriptor将会是undefined。
:::

```typescript
function enumerable(bool: boolean) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = bool
  }
}

class ClassDec {
  private _name: string
  constructor(name: string) {
    this._name = name
  }

  @enumerable(false)
  get name() {
    return this._name
  }
  set name(name) {
    this._name = name
  }
}

let dec = new ClassDec('jane')

// 此时装饰器传入的是 false，当遍历实例时，只能得到 _name 属性，不能得到 name
```

如果访问器装饰器返回一个值，它会被用作方法的属性描述符。

:::warning
注意  如果代码输出目标版本小于ES5返回值会被忽略。
:::

## 属性装饰器

属性装饰器声明在一个属性声明之前（紧靠着属性声明）。

属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。

:::warning
注意  属性描述符不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。返回值也会被忽略。因此，属性装饰器只能用来监视类中是否声明了某个名字的属性。
:::

```typescript
function printPropertyName(target: any, propertyName: string) {
  console.log(propertyName) // name
}

class ClassDec {
  @printPropertyName
  public name: string
}
```

## 参数装饰器

参数装饰器声明在一个参数声明之前（紧靠着参数声明）。

参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 参数在函数参数列表中的索引。

:::warning
注意  参数装饰器只能用来监视一个方法的参数是否被传入。
:::

参数装饰器的返回值会被忽略。

```typescript
function required(target: any, propertyName: string, index: number) {
  console.log(`修饰的是${propertyName}的第${index + 1}个参数`)
}

class ClassDec {
  public name: string = 'jane'
  public age: number = 18
  public getInfo(prefix: string, @reuqired infoType: string): any {
    return prefix + ' ' + this[infoType]
  }
}

interface ClassDec {
  [key: string]: string | number | Function
}

let dec = new ClassDec()

dec,getInfo('a', 'name')

// 修饰的是 getInfo 的第 2 个参数
```
