# ts中的类

[官方文档](https://www.tslang.cn/docs/handbook/classes.html)

```typescript
class Point {
  public x: number
  public y: number
  constructor(x: number, y: nubmer) {
    this.x = x
    this.y = y
  }
  public getPosition() {
    return `(${this.x}, ${this.y})`
  }
}

const point = new Point(1, 2)
// Point {x: 1, y: 2}
```

```typescript
class Parent {
  public name: string
  constructor(name: string) {
    this.name = name
  }
}

class Child extends Parent {
  constructor(name: string) {
    super(name)
  }
}
```

## 修饰符

ts的类中有三个修饰符：`public(公共)`、`private(私有)`、`protected(受保护)`、`readonly(只读)`

```typescript
// public
class A {
  public name: string
  public func () {}
}

// private
class Parent {
  private name: string
  constructor(name: string) {
    this.name = name
  }
  private func () {}
}
let p = new Parent('tom')   // Parent {name: 'tom'}
p.name                      // error 属性 'age' 为私有属性，只能在类 'Parent' 中访问
Parent.age                  // 类型 'typeof Parent' 上不存在属性 'name'

class Child extends Parent {
  onstructor (name: string) {
    super(name)
    console.log(super.name) // error 通过 'super' 关键字只能访问基类的公共方法和受保护方法。
  }
}

// protected
class Parent {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
  protected getName () {
    return this.name
  }
}

class Child extends Parent {
  constructor(name: string) {
    super(name)
    console.log(super.name) // error 通过 "super" 关键字只能访问基类的公共方法和受保护方法。
  }
  public getName () {
    return this.name
  }
}

let p = new Child('tom')
p.name // error
p.getName() // tom

// readonly
class UserInfo {
  public readonly name: string
  constructor(name: string) {
    this.name = name
  }
}

const user = new UserInfo('tom')
console.log(user.name) // tom
user.name = 'jane' // Cannot assign to 'name' because it is a read-only property
```

::: tip
* 当成员被标记成 private时，它就不能在声明它的类的外部访问。

* protected修饰符与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问。
:::

## 参数属性

在参数前面加修饰符，即会把属性指定类型，又会把属性添加到实例上

```typescript
class A {
  constructor(public name:string) {}
}

const a = new A('tom')
a //A {name: 'tom'}
```

## 静态属性

静态属性存在于类本身上面而不是类的实例上

```typescript
class People {
  public static name: string = 'tom'
  public static getName () {
    return People.name
  }
}

const p = new People()
p.name // Property 'name' is a static member of type 'People'
People.name // tom
```

## 可选类属性

```typescript
class Info {
  public name: string
  public age?: number
  constructor(name: string, age?: number, public sex?: string) {
    this.name = name
    this.age = age
  }
}

const info = new Info('tom') // Info {sex: undefined, name: "tom", age: undefined}
const info = new Info('tom', 18) // Info {sex: undefined, name: "jane", age: 18}
const info = new Info('tom', 18, 'man') // Info {sex: "man", name: "jane", age: 18}
```

## 存取器

ts支持通过 `getters/setters` 来截取对对象成员的访问

```typescript
class People {
  public name: string
  constructor(name: string) {
    this.name = name
  }
  set peopleName (value) {
    this.name = value
  }
  get peopleName () {
    return this.name
  }
}

let p = new People('tom')
p.peopleName          // tom
p.peopleName = 'jane' // jane
```

## 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 abstract关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```typescript
abstract class People {
  constructor(public name: string) {}
  public abstract printName(): void
}

let p = new People() // error 无法创建抽象类的实例

class Man extends People {
  constructor(name: string) {
    super(name)
    this.name = name
  }
  public printName () {
    return this.name
  }
}

let m = new Man('tom')
m.printName() // tom
```

::: warning
* 非抽象类不会自动继承抽象类上的抽象成员，需要手动在非抽象类中实现一次
* 抽象方法和抽象存取器都不能包含代码块，只需要指定它的属性名、方法名、方法参数和返回值类型
* 存值器不需要指定返回值类型，否则会报错
:::

```typescript
abstract class People {
  public abstract name: string
  abstract get insideName(): string
  abstract set insideName(value: string)
}

class P extends People {
  public name: string
  public insideName: string
}
```

## 实例属性

当定义一个类，并创建实例后，实例的类型就是创建它的类，也就是说，定义的类，既是一个值，也是一个类型

```typescript
class People {
  constructor(public name: string) {}
}

let p = new People('tom')
// p 的类型就是 People类
```

## 类-类型接口

使用接口可以强制定义一个类的内容必须包含某些内容

```typescript
interface Food {
  type: string
}

// 使用 implements 关键字
class FoodClass implements Food {
  public type: string
}

// 接口检测的是使用该接口定义的类创建的实例
```

## 接口继承类

接口继承类，会继承类的成员，但不包括其实(只继承成员及其类型)

```typescript
class A {
  protected name: string
}

interface I extends A {}

class B implements I {
  public name: string
}
// error  类 'B' 错误实现接口 'I'。属性 'name' 受保护，但类型 'B' 并不是从 'A' 派生的类

// 正确的实现
class B extends A implements I {
  public name: string
}
```

接口会继承类中被private protected 修饰的成员，当接口继承的类包含被这两种修饰符修饰的成员时，接口只能被这个
类或它的子类实现

## 在泛型中使用类类型

定义一个方法，指定参数是类类型，方法的返回值是类创建的实例，返回值类型是类创建的实例的类型（也就是这个类）

```typescript
const create = <T>(c: { new (): T }): T => {
  return new c()
}
// 被eslent转化
const create = <T>(c: new () => T): T => {
  return new c()
}

class Infos {
  public age: number
  constructor() {
    this.age = 18
  }
  public getName () {
    return Infos.name
  }
}

create<Infos>(Infos)
// Infos {age: 18}
```
