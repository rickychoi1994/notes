# Symbol

[官方文档](https://www.tslang.cn/docs/handbook/symbols.html)

::: tip
symbol表示一种独一无二的值
:::

```typescript
const s1 = Symbol('name')
const s2 = Symbol('name')
s1 === s2 // false
```
symbol([description]) 可传入一个参数 (symbol 的描述)，参数为 number 或 string。当参数为 number 类型时，在 symbol 内部会调用 toString() 方法将 number 转换为 string。

symbol 值不能和其它类型的值进行运算

symbol 可以转换为 `字符串` 和 `布尔值`

```typescript
symbol.toString()  // 'symbol()'
Boolean(symbol)    // true
!symbol            // false
```

## 作为属性名

在es6中对象可以将变量或表达式作为属性名
```typescript
let prop = 'name'
const info = {
  [prop]: 'abc',
  [`my${prop}is`]: '123'
}

// {
//   name: 'abc',
//   mynameis: '123'
// }
```

将symbol值作为属性名
```typescript
const name = symbol('name')
const info = {
  [name]: 'abc',
  age: 16
}

info.[name] // abc
info.name // error
```

::: warning
以symbol值作为属性名不能用点运算符，因为点运算符后面总是字符串，导致info的属性名实际上是一个字符串，而不是一个symbol值，所以不会读取sumbol作为标识名所指代的那个值
:::

::: tip
遍历对象中的symbol值要用 `Object.getOwnPropertySymbols()` 或 `Reflect.ownKeys()` (会返回对象中的所有属性名)
:::

## Symbol.for()和Symbol.keyFor()

Symbol.for() 方法会根据给定的 key 从全局symbol注册表中找到对应的symbol值，找到了就返回它，反之新建一个与该键关联的symbol值并放入全局symbol注册表中

全局范围：`当前页面、iframe、Service Worker`

```typescript
const s1 = Symbol.for('name')
const s2 = Symbol.for('name')

s1 === s2         // true
Symbol.keyFor(s2) // name
```

为了防止冲突，最好给要放入Symbol 注册表中的symbol值带上键前缀

```typescript
Symbol.for('mdn.foo')
Symbol.for('mdn.bar')
```

## Symbol内置的11个属性

symbol.species 构造函数用以创建派生对象

```typescript
class C extends Array {
  constructor (...args) {
    super(...args)
  }

  static get [Symbol.species] () {
    return Array
  }
}

const c = new C(1, 2, 3)           // [1, 2, 3]
const a = c.map(item => item + 1)  // [2, 3, 4]

a instanceof C                     // false
a instanceof Array                 // true
```

::: tip
在es6中如果没设置 `symbol.species` 则  `a instanceof C` 结果为 `true`

在typescript中无论设置与否结果都是 `false`
:::
