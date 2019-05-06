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
