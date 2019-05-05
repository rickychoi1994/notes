# 类型兼容性

[官方文档](https://www.tslang.cn/docs/handbook/type-compatibility.html)

## 类型推论

简单的例子

```typescript
let a = 'tom'
a = 1 // error 不能将类型'1'分配给类型'string'
```

声明一个变量 `a` 并赋值为 tom 时，ts 会认为 `a` 需要 `string` 类型的值，所以再给 `a` 赋值为数值时，就会报错

### 多类型联合

```typescript
let arr = [ 1, 'a' ]
```

此时，ts会推断 `arr` 类型为 `Array<number | string>`

### 上下文类型

ts 类型推论也可能按照相反的方向进行

```typescript
window.onmousedown = (event) => {
  console.log(event) // MouseEvent
}
```

## 类型兼容性

类型检测时，是深层次的递归检测，可以检测深层次的嵌套

```typescript
interface Info {
  name: string,
  info: {
    age: number
  }
}

let infos: Info

let infos1 = { name: 'tom', info: { age: 18 } }
let infos2 = { age: 18 }
let infos3 = { name: 'tom', age: 18 }

infos = infos1 // success
infos = infos2 // error 缺少name属性
infos = infos3 // error 缺少info属性
```

### 函数兼容性

#### 参数个数

赋值的函数参数个数要小于被赋值的函数的参数个数

```typescript
let x = (name: string) => 0
let y = (name: string, age: number) => 0

y = x
x = y // error
```

#### 参数类型

```typescript
let x = (a: number) => 0
let y = (b: string) => 0
y = x // error
```

#### 可选参数&剩余参数

比较函数兼容性的时候，可选参数与必须参数是可互换的。 源类型上有额外的可选参数不是错误，目标类型的可选参数在源类型里没有对应的参数也不是错误。

当一个函数有剩余参数时，它被当做无限个可选参数。

这对于类型系统来说是不稳定的，但从运行时的角度来看，可选参数一般来说是不强制的，因为对于大多数函数来说相当于传递了一些undefinded。

```typescript
const getSum = (arr: number[], callback: (...args: number[]) => number): number => {
  return callback(...args)
}

let res_a = getSum([1, 2, 3], (...args: number[]): number => args.reduce((a, b) => a + b, 0))
let res_b = getSum([1, 2, 3], (arg1: number, arg2: number, arg3: number): number => arg1 + arg2 + arg3)
```

```typescript
// 官方例子

function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
```

#### 函数参数双向协变

当比较函数参数类型时，只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。 这是不稳定的，因为调用者可能传入了一个具有更精确类型信息的函数，但是调用这个传入的函数的时候却使用了不是那么精确的类型信息。 实际上，这极少会发生错误，并且能够实现很多JavaScript里的常见模式。

```typescript
let funcA = (arg: number | string): void => {}
let funcB = (arg: number): void => {}

funcA = funcB
funcB = funcA
```

#### 函数重载

对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名。 这确保了目标函数可以在所有源函数可调用的地方调用。

```typescript
function merge (arg1: number, arg2: number): number
function merge (arg1: string, arg2: string): string

function merge (arg1: any, arg2: any) {
  return arg1 + arg2
}

function sum (arg1: number, arg2: number): number
function sum(arg1: any, arg2: any) {
  return arg1 + arg2
}

let func = merge
func = sum // error
```

### 枚举

枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。

```typescript
enum Status {
  On,
  Off,
}

enum Animal {
  Dog,
  Cat,
}

let a = Status.On
a = 3

a = Animal.Dog // error 不能将类型 'Animal.Dog' 分配给类型 'Status'
```

### 类

类与对象字面量和接口差不多，但有一点不同：类有静态部分和实例部分的类型。 比较两个类类型的对象时，只有实例的成员会被比较。 静态成员和构造函数不在比较的范围内。

```typescript
class Animal {
  public static age: number
  constructor(public name: string) {}
}

class People {
  public static age: string
  constructor(public name: string) {}
}

class Food {
  constructor(public name: number) {}
}

let animal: Animal
let people: People
let food: Food

animal = people
animal = food // error
```

:::tip
类的私有成员和受保护成员

类的私有成员和受保护成员会影响兼容性。 当检查类实例的兼容时，如果目标类型包含一个私有成员，那么源类型必须包含来自同一个类的这个私有成员。 同样地，这条规则也适用于包含受保护成员实例的类型检查。 这允许子类赋值给父类，但是不能赋值给其它有同样类型的类。
:::

```typescript
class Parent {
  // protected age: number
  private age: number
  constructor() {}
}

class Child extends Parent {
  constructor() {
    super()
  }
}

class Other {
  // protected age: number
  private age: number
  constructor() {}
}

const child: Parent = new Child()

const other: Parent = new Other() // error 不能将类型 'Other' 分配给类型 'Parent' 类型具有私有属性 'age'的单独声明

// protected
// 属性 'age' 受保护，但类型 'Other' 并不是从 'Parent' 派生的类
```

### 泛型

因为TypeScript是结构性的类型系统，类型参数只影响使用其做为类型一部分的结果类型。

```typescript
interface Data<T> {
  age: T
}

let data1: Data<number>
let data2: Data<string>

data1 = data2 // error
```
