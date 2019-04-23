# 函数

## 函数类型

### 完成的函数类型

```typescript
let add = (x: number, y: number) => number
add = (arg1: number, arg2: number): number => arg1 + arg2

// 也可以不指定返回值类型
add = (arg1: number, arg2: number) => arg1 + arg2
```

::: tip
如果函数中使用了函数体之外定义的变量，这个变量的类型是不体现在这个函数类型定义中的

```typescript
let arg3 = 3
add = (arg1: number, arg2: number): number => arg1 + arg2 + arg3
```
:::

### 使用接口定义函数类型

```typescript
interface add {
  (x: number, y: number): number
}
```

### 使用类型别名

```typescript
type add = (x: number, y: number) => number
let addFunc: add
addFunc = (arg1: number, arg2: number) => arg1 + arg2
```

## 参数

### 可选参数

```typescript
// 在参数后面加一个 ?
type AddFunction = (arg1: number, arg2: number, arg3?:number) => number

let addFunction: AddFunction
addFunction = (x: number, y: number) => x + y
addFunction = (x: number, y: nubmer, z: number) => x + y + z
```

### 默认参数

```typescript
let addFunction = (x: number, y: number = 3) => x + y

// 默认参数可以不设置类型，ts会根据默认值的类型设置参数类型
let addFunction = (x: number, y = 3) => x + y
```

### 剩余参数

```javascript
// 在es6之前获取参数列表 用 arguments 类数组对象
function handleData () {
  if (arguments.length === 1) return arguments[0] * 2
  else if (arguments.length === 2) return arguments[0] * arguments[1]
  else return Array.prototype.slice.apply(arguments).join('_')
}
```

```javascript
// 在es6中
const handleData = (...args) => {
  // args 数组
}
```

```typescript
// 在ts中的处理
// 用...args来接受剩余参数,es6中...args是一个数组，所以设置类型为number[]
const handleData = (arg1: number, ...args: number[]) => {
  //
}
```

## 重载

::: tip
所谓重载，就是一组相同的函数名，有不同个数的参数，在使用时调用一个函数名，传入不同参数，根据你的参数个数，来决定使用不同的函数。js中是没有重载的，因为后定义的函数会覆盖前面的同名函数。
:::

```typescript
// ts 重载只能用function来定义
function handleData(x: number): number[]
function handleData(x: string): string[]

function handleData (x: any) {
  if (typeof x === 'string') return x.split('')
  else x.toString().split('').map(item => Number(item))
}
```
