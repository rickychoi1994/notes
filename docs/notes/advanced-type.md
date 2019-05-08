# 高级类型

[官方文档](https://www.tslang.cn/docs/handbook/advanced-types.html)

## 交叉类型

使用 `&` ，将多个类型合并为一个类型

```typescript
const merge = <T, U>(arg1: T, arg2: U): T & U => {
  let res = {} as T & U
  res = Object.assign(arg1, arg2)
  return res
}
```

## 联合类型

使用 `|` ，表示一个值可以是几种类型之一

```typescript
const getLength = (content: string | number): number => {
  if ((content as string).length) {
    return (content as string).length
  } else {
    return content.toString().length
  }
}
```

## 类型保护

```typescript
let valueList = [ 123, 'abc' ]

function getRandomValue() {
  const num = Math.random * 10
  if (num < 5) {
    return valueList[1]
  } else {
    return valueList[0]
  }
}

let item = getRandomValue()

// if (item.length) {    // 类型 'string | number' 上不存在属性“length”
//   console.log(item.length)
// } else {
//   console.log(item.toFixed())
// }
// 若想使这段代码正常运行，需要使用类型断言

if ((item as string).length) {
  console.log((item as string).length)
} else {
  console.log((item as number).toFixed())
}
```

### 用户自定义类型保护

为了不多次使用类型断言，并且为了检查过类型就能在之后的每个分支里清楚知道类型，要定义一个类型保护，简单地定义一个函数，它的返回值是一个 类型谓词

```typescript
function isString(value: string | number): value is string {
  return typeof value === 'string'
}

```

在上面的函数里 `value is string` 就是类型谓词，谓词为 `parameterName is Type` 这种形式，`parameterName` 必须是来自于当前函数签名里的一个参数名。

```typescript
if (isString(item)) {
  console.log(item.length) // item: string
} else {
  console.log(item.toFixed()) // item: number
}
```

### typeof类型保护

ts 可以将 `typeof value === 'string'` 识别成一个类型保护，也就是说直接在代码里检查类型了。不用再去抽象成一个函数。

```typescript
if (typeof item === 'string') {
  console.log(item.length)
} else {
  console.log(item.toFixed())
}
```

typeof类型保护只有两种形式能被识别：

* `typeof v === 'typename'` 和 `typeof v !== 'typename'`
* `typename` 必须是 `number`、`string`、`boolean` 或 `symbol`

### instanceof类型保护

`instanceof` 类型保护是通过构造函数来细化类型的一种方式。

```typescript
class CreatedByClass1 {
  public age: number = 18
  constructor() {}
}

class CreatedByClass2 {
  public name: string = 'jane'
  constructor() {}
}

function getRandom() {
  return Math.random() < 0.5 ? new CreatedByClass1() : new CreatedByClass2()
}

let item = getRandom()

if (item instanceof CreatedByClass1) {
  console.log(item.age)  // item: CreatedByClass1
} else {
  console.log(item.name) // item: CreatedByClass2
}
```

## null undefined

ts 具有两种特殊的类型，`null` 和 `undefined`，它们分别是具有值 `null` 和 `undefined`。默认情况下，类型检查器认为null和undefined可以赋值给任何类型。`null` 与 `undefined` 是所有其它类型的一个有效值。这也意味着，你阻止不了将它们赋值给其它类型，就算是你想要阻止这种情况也不行。

`--strictNullChecks` 标记可以解决此错误：当声明一个变量时，它不会自动地包含 `null` 或 `undefined`。可以使用联合类型明确的包含它们。

```typescript
let s = 'foo'
s = null // error 'null' 不能赋值给 'string'

let sn: string | null = 'bar'
sn = null

sn = undefined // error undefined 不能赋值给 'string | null'
```

使用 `--strictNullChecks` 后，可选参数和可选属性都会被自动加上 `| undefined`

:::warning
注意，按照JavaScript的语义，TypeScript会把 `null` 和 `undefined` 区别对待。` string | null`， `string | undefined` 和 `string | undefined | null` 是不同的类型。
:::

## 类型保护和类型断言

由于可以为null的类型是通过联合类型实现，那么需要使用类型保护来去除 null。

```typescript
function getLengh(value: string | null): number {
  // if (value === null) {
  //   return 0
  // } else {
  //   return value.length
  // }

  // 简化后
  return (value || '').length
}
```

如果编译器不能够去除 null或 undefined，你可以使用类型断言手动去除。 语法是添加 `!` 后缀：

```typescript
function getSplicedStr(num: number | null): string {
  function getRes(prefix: string) {
    return prefix + num!.toFixed().toString()
  }
  num = num || 0.1
  return getRes('jane-')
}

getSpliceStr(3.14) // jane-3
```

## 类型别名

类型别名会给一个类型起一个新名字。类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```typescript
type Name = string
let name: Name = 'jane' // name: string
```

类型别名也可以是泛型：

```typescript
type Container<T> = { value: T }

let content: Container<string> = {
  value: 'abc'
}

let content2: Container<number> = {
  value: 123
}
```

类型别名页可以在属性里引用自己：

```typescript
type Tree<T> = {
  value: T,
  child?: Tree<T>
}

let tree: Tree<string> = {
  value: 'a',
  child: {
    value: 'b',
    child: {
      value: 'c'
      // child  可以一直循环下去
    }
  }
}
```

然而，类型别名不能出现在声明右侧的任何地方。

```typescript
type Yikes = Array<Yikes> // error
```

## 接口 vs 类型别名

类型别名可以像接口一样；然而，仍有一些细微差别。

* 接口创建了一个新的名字，可以在其它任何地方使用。类型别名并不创建新名字，比如：错误信息就不会使用别名。
* 另一个重要区别是类型别名不能被 extends和 implements（自己也不能 extends和 implements其它类型）
  因为 软件中的对象应该对于扩展是开放的，但是对于修改是封闭的，应该尽量去使用接口代替类型别名。
* 另一方面，如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名。

```typescript
type Alias = {
  num: number
}

interface Interface {
  num: number,
}

let _alias: Alias = {
  num: 123
}

let _interface: Interface = {
  num: 321
}

_alias = _interface // 没问题
```

## 字符串字面量类型

字符串字面量类型允许你指定字符串必须的固定值。

```typescript
type Name = 'Jane'
let name1: Name = 'Jane'
let name2: Name = 'tom' // error 不能将类型 'tom' 分配给类型 'Jane'
```

## 数字字面量类型

```typescript
type Age = 18

interface Info {
  name: string,
  age: Age,
}

let info: Info = {
  name: 'jane',
  age: 18
  // age: 20 // error 不能将类型 '20' 分配给类型 '18'
}
```

## 枚举成员类型

在枚举一节里提到，当每个枚举成员都是用字面量初始化的时候枚举成员是具有类型的。

在谈及"单例类型"的时候，多数是指枚举成员类型和数字/字符串字面量类型。

[枚举类型](https://rickychoi1994.github.io/notes/notes/enum.html#%E6%9E%9A%E4%B8%BE%E6%88%90%E5%91%98%E7%B1%BB%E5%9E%8B-%E8%81%94%E5%90%88%E6%9E%9A%E4%B8%BE)

## 可辨识联合

可以合并单例类型，联合类型，类型保护和类型别名来创建一个叫做 可辨识联合的高级模式，它也称做 标签联合 或 代数数据类型。可辨识联合在函数式编程很有用处。 一些语言会自动辨识联合；而TypeScript则基于已有的JavaScript模式。 它具有3个要素：

1. 具有普通的单例类型属性 — 可辨识的特征。
2. 一个类型别名包含了那些类型的联合 — 联合。
3. 此属性上的类型保护。

```typescript
interface Square {
    kind: "square",
    size: number,
}
interface Rectangle {
    kind: "rectangle",
    width: number,
    height: number,
}
interface Circle {
    kind: "circle",
    radius: number,
}
```

上面声明了将要联合的接口。每个接口都有 `kind` 属性但有不同的字符串字面量类型。kind属性称做 可辨识的特征 或 标签。其它的属性则特定于各个接口。 注意，目前各个接口间是没有联系的。 下面我们把它们联合到一起：

```typescript
type Shape = Square | Rectangle | Circle
```

现在使用可辨识联合:

```typescript
function area(s: Shape) {
    switch (s.kind) {
        case 'square': return s.size * s.size;
        case 'rectangle': return s.height * s.width;
        case 'circle': return Math.PI * s.radius ** 2;
    }
}
```

## 完整性检查

当没有涵盖所有可辨识联合的变化时，想让编译器可以提示。 比如，如果添加了 Triangle 到 Shape，同时还需要更新 area:

```typescript
type Shape = Square | Rectangle | Circle | Triangle

function area(s: Shape) {
    switch (s.kind) {
        case 'square': return s.size * s.size
        case 'rectangle': return s.height * s.width
        case 'circle': return Math.PI * s.radius ** 2 // ** es7的幂运算符 ** 2 平方 ** 3 立方
    }
    // should error here - we didn't handle case "triangle"
}
```

有两种方式可以实现。 首先是启用 `--strictNullChecks` 并且指定一个返回值类型：

```typescript
function area(s: Shape): number { // error: returns number | undefined
    switch (s.kind) {
        case 'square': return s.size * s.size
        case 'rectangle': return s.height * s.width
        case 'circle': return Math.PI * s.radius ** 2
    }
}
```

因为 switch没有包涵所有情况，所以TypeScript认为这个函数有时候会返回 `undefined`。 如果明确地指定了返回值类型为 `number`，那么会看到一个错误，因为实际上返回值的类型为 `number | undefined`。 然而，这种方法存在些微妙之处且 `--strictNullChecks` 对旧代码支持不好。

第二种方法使用 `never类型`，编译器用它来进行完整性检查：

```typescript
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default: return assertNever(s); // error here if there are missing cases
    }
}
```

这里， assertNever 检查 s 是否为`never类型`—即为除去所有可能情况后剩下的类型。 如果忘记了某个case，那么 s将具有一个真实的类型并且会得到一个错误。 这种方式需要定义一个额外的函数，但是在忘记某个case的时候也更加明显。

## 多态的this类型

多态的 `this类型` 表示的是某个包含类或接口的子类型。这被称作 `F-bounded` 多态性。它能很容易的表现连贯接口间的继承。在下面的例子中，每个操作之后都返回 `this类型`：

```typescript
class Counter {
  constructor(public count: number = 0) {}
  public add(value: number) {
    this.count += value
    return this
  }
  public substract(value: number) {
    this.count -= value
    return this
  }
}

let counter = new Counter(2) // Counter {count: 2}
counter.add(3).substract(1)  // Counter {count: 4}

// 由于这个类使用了 this类型，你可以继承它，新的类可以直接使用之前的方法，不需要做任何的改变。
class PowCounter extends Counter {
  constructor(public count: number = 0) {
    super(count)
  }
  public pow(value: number) {
    this.count = this.count ** value
    return this
  }
}

let powCounter = new PowCounter(3)     // PowCounter {count: 3}
powCounter.pow(3).add(1).substract(10) // PowCounter {count: 18}
```

## 索引类型

使用索引类型，编译器就能够检查使用了动态属性名的代码。例如，一个常见的JavaScript模式是从对象中选取属性的子集。

```typescript
function pluck(o, names) {
  return names.map(n => o[n])
}
```

### 索引类型查询操作符

`keyof T` ，对于任何类型 T， keyof T的结果为 T上已知的公共属性名的联合。

```typescript
interface Info {
  name: string;
  age: number;
}

let infoProp: keyof Info // infoProp = 'name' | 'age'
infoProp = 'name'
infoProp = 'age'
infoProp = 'sex' // error 不能将类型“"sex"”分配给类型“"name" | "age"”
```

```typescript
let infoObj = {
  name: 'jane',
  age: 18,
}

function getValue<T, K extends keyof T>(obj: T, names: K[]): Array<T[K]> {
  return names.map((n) => obj[n])
}

let values = getValue(infoObj, [ 'name', 'age' ])
// [ 'jane', 18 ]
```

`keyof` 会返回类型不为 `never` 、`null` 、`undefined` 类型的属性名的联合

```typescript
interface Type {
  a: never;
  b: never;
  c: string;
  d: number;
  e: undefined;
  f: null;
  g: object
}

type Test = Type[keyof Type]
// type Test = string | number | object
```

### 索引访问操作符

`T[K]`

```typescript
type NameTypes = Info['name'] // type NameTypes = string

function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]
}
```

### 索引类型和字符串索引签名

```typescript
interface Obj<T> {
  [key: string]: T
}

let keys: keyof Obj<number> // keys: string | number
let values: Obj<number>['foo'] // values: number
```

## 映射类型

从旧类型中创建新类型的一种方式。新类型以相同的类型去转换旧类型里每个属性。

```typescript
interface Info {
  name: string;
  age: number;
  sex: string;
}
// 若此时想把Info里的属性变为只读或可选需要给每个属性加readonly或?
interface Info {
  readonly name: string;
  readonly age: number;
  readonly sex: string;
}
interface Info {
  name?: string;
  age?: number;
  sex?: string;
}

// 使用映射类型后就不需要这么麻烦了
type InfoPartial<T> = {
  [P in keyof T]: T[P]
}
type InfoReadonly<T> = {
  readonly [P in keyof T]: T[p]
}

// 可选属性
type partialInfo = InfoPartial<Info>
// 只读属性
type readonlyInfo = InfoReadonly<Info>
```

### 增加和移除特定修饰符

```typescript
type RemoveReadonly<T> = {
  -readonly [P in keyof T]+?: T[P]
}
```

:::tip
TypeScript 中内置的映射类型

* Readonly
* Partial
* Pick
* Record

Readonly，Partial 和 Pick 是同态的，但 Record 不是。 因为 Record 并不需要输入类型来拷贝属性，所以它不属于同态(同态是两个代数结构（例如群、环、或者向量空间）之间的保持结构不变的映射)。
:::

```typescript
// Pick
interface Info {
  name: string;
  age: number;
  address: string;
}

let info: Info = {
  name: 'jane',
  age: 18,
  address: 'abc',
}

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const res: any = []
  keys.map((key) => {
    res[key] = obj[key]
  })
  return res
}

let result = pick(info, [ 'name', 'address' ]) // [name: "jane", address: "abc"]
```

```typescript
// Record
function mapObject<K extends string | number, T, U>(obj: Record<K, T>, f: (x: T) => U): Record<K, U> {
  const res: any = {}
  for (const key in obj) {
    res[key] = f(obj[key])
  }
  return res
}

let names = { 0: 'hello', 1: 'world', 2: 'bye' }
let lengths = mapObject(names, (s) => s.length) // {0: 5, 1: 5, 2: 3}
```

#### 由映射类型进行推断

拆包的过程

```typescript
// 对类型的属性包装
type Proxy<T> = {
  get(): T,
  set(value: T): void
}
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>
}

function proxify<T>(obj: T): Proxify<T> {
  const result = {} as Proxify<T>
  for (const key in obj) {
    result[key] = {
      get: () => obj[key],
      set: (value) => obj[key] = value
    }
  }
  return result
}

let props = {
  name: 'jane',
  age: 18,
}

let proxyProps = proxify(props)
proxyProps.name.get() // jane
proxyProps.name.set('tom')
proxyProps.name.get() // tom

// 拆包
function unproxify<T>(t: Proxify<T>): T {
  const result = {} as T
  for (const key in t) {
    result[key] = t[key].get()
  }
  return result
}

let originalProps = unproxify(proxyProps)
// {name: "jane", age: 18}
```

:::warning
注意这个拆包推断只适用于同态的映射类型。 如果映射类型不是同态的，那么需要给拆包函数一个明确的类型参数。
:::

## 条件类型

条件类型会以一个条件表达式进行类型关系检测，从而在两种类型中选择其一：

```typescript
T extends U ? X : Y
```

若T能够赋值给U，那么类型是X，否则为Y。

```typescript
type Type<T> = T exteds string ? string : number
let index: Type<'a'> // index: string
```

当检测的类型是一个联合类型时，条件类型被称为分布式条件类型。

```typescript
type TypeName<T> = T extends any ? T : never
type Type = TypeName<string | number>
// type Type = string | number
```

### 条件类型和映射类型结合使用

```typescript
type Type<T> = {
  [P in keyof T]: T[P] extends Function ? P : never
}[keyof T]

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void
}

type Test = Type<Part>
//  type Test = "updatePart"
```

与联合类型和交叉类型相似，有条件类型不允许递归地引用自己。

```typescript
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T  // error
```

### 条件类型中的类型推断

条件类型的extends子语句中，允许出现 `infer` 声明，它会引入一个待推断的类型变量。

```typescript
// T[number] 索引访问类型，获取的是值的类型
type Type<T> = T extends any[] ? T[number] : T
type Test1 = Type<string[]> // type Test1 = string
type Test2 = Type<string>   // type Test2 = string

type Type<T> = T extends Array<infer U> ? U : T
type Test1 = Type<string[]> // type Test1 = string
type Test2 = Type<string>   // type Test2 = string
```

:::tip
Typescript 内置的条件类型

* `Exclude<T, U>` -- 从T中剔除可以赋值给U的类型。
* `Extract<T, U>` -- 提取T中可以赋值给U的类型。
* `NonNullable<T>` -- 从T中剔除null和undefined。
* `ReturnType<T>` -- 获取函数返回值类型。
* `InstanceType<T>` -- 获取构造函数类型的实例类型。
:::

```typescript
// Exclude
type Type = Exclude<'a' | 'b' | 'c', 'c'>  // type Type = "a" | "b"
// Extract
type Type = Extract<'a' | 'b' | 'c', 'c' | 'b'>  // type Type = "b" | "c"
// NonNullable
type Type = NonNullable<string | number | null | undefined>  // type Type = string | number
// ReturnType
type Type = ReturnType<() => string>  // type Type = string
// InstanceType
class C {
  public name: string
  constructor() {}
}

type Type = InstanceType<typeof C> // type Type = C
type Type = InstanceType<any>      // any
type Type = InstanceType<never>    // any
type Type = InstanceType<string>   // error
```
## 更新
keyof 和 映射类型在2.9版本的升级，用number和symbol命名属性。

```typescript
const stringIndex = 'a'
const numberIndex = 1
const symbolIndex = Symbol()

type Obj = {
  [stringIndex]: string,
  [numberIndex]: number,
  [symbolIndex]: symbol,
}

type keysType = keyof Obj // type keysType = 'a' | 1 | typeof symbolIndex

type ReadonlyTypes<T> = {
  readonly [P in keyof T]: T[P]
}

let objs: ReadonlyTypes<Obj> = {
  a: 'aa',
  1: 11,
  [symbolIndex]: Symbol()
}
```

在3.1版本中，元组和数组上的映射对象类型现在会生成新的元组/数组，而非创建一个新的类型并且这个类型上具有如push()，pop()和length这样的成员。

```typescript
type MapToPromise<T> = {
  [P in keyof T]: Promise<T[P]>
}
type Tuple = [number, string, boolean]
type promiseTuple = MapToPromise<Tuple>
// [ Promise<number>, Promise<string>, Promise<boolean> ]

let tuple: promiseTuple = [
  new Promise((resolve, reject) => resolve(1)),
  new Promise((resolve, reject) => resolve('a')),
  new Promise((resolve, reject) => resolve(false)),
]
```

## unknown类型

1. 任何类型都可以赋值给unknown类型

```typescript
let value1: unknown
value1 = 'a'
value1 = 123
```

2. 如果没有类型断言或基于控制流的类型细化时，unknown不可以赋值给其它类型，只能赋值给它自身和any类型

```typescript
let value2: unknown
let value3: string
value3 = value2 // error
```

3. 如果没有类型断言或基于控制流的类型细化时，unknown不能进行任何操作

```typescript
let value4: unknown
value4 += 1 // error
```

4. unknown与任何其它类型组成的交叉类型，都等于其它类型

```typescript
type type = string & unknown   // string
type type = number & unknown   // number
type type = string[] & unknown // string[]
type type = unknown & unknown  // unknown
```

5. unknown与任何其它类型组成的联合类型，都等于unknown类型(除any外)

```typescript
type type = string | unknown   // unknown
type type = string[] | unknown // unknown
type type = number | unknown   // unknown
type type = any | unknown      // any
```

6. never类型是unknown类型的子类型

```typescript
type type = never extends unknown ? true : false // true
```

7. keyof unknown 等于 never类型

```typescript
type type = keyof unknown // never
```

8. 只能对unknown进行等或不等操作

```typescript
function f(x: unknown) {
    x == 5;
    x !== 10;
    x >= 0;  // Error
    x + 1;   // Error
    x * 2;   // Error
    -x;      // Error
    +x;      // Error
}
```

9. unknown类型的值不能访问其属性、不能作为函数调用、不能作为类创建实例

```typescript
function f(x: unknown) {
    x.foo;    // Error
    x[5];     // Error
    x();      // Error
    new x();  // Error
}
```

10. 使用映射类型时，如果遍历的是unknown类型时，则不会映射任何属性

```typescript
type Type<T> = {
  [ P in keyof T]: number
}

type type = Type<unknown> // {}
```
