# 泛型

泛型就是在编译期间不确定方法的类型(广泛之意思)，在方法调用时，由程序员指定泛型具体指向什么类型

## 简单使用
```typescript
const getArray = (value: any, times: number = 5) : any[] => {
  return new Array(times).fill(value)
}
getArray('abc', 4).map(item => item.length)
// [ 3, 3, 3, 3]
getArray(2, 3).map(item => item.length)
// [ undefined, undefined, undefined ]
// number没有length属性, 但是方法并没有报错

const getArray = <T>(value: T, times: nubmer = 5): T[] => {
  return new Array(times).fill(value)
}
getArray<number>(2, 3).map(item => item.length)
// 现在tslint会提示，类型“number”上不存在属性“length”
```

一般在定义前面用 `<>`包裹一个大写字母，这个大写字母就是泛型变量；若有多个泛型变量可用 `,` 隔开。

调用时在函数名后括号前指定泛型变量的类型。

```typescript
const getArray = <T, U>(arg1: T, arg2: U, times: number): [T, U][] => {
  return new Array(times).fill([arg1, arg2])
}
// 若不指定泛型类型，ts编译器会根据传入的值来判断泛型变量的类型
getArray(1, 'a', 3)
```

## 泛型类型

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样

```typescript
// 在类型定义中的使用
let getArray: <T>(arg: T, times: number) => T[]
getArray = (arg: any, times: number) => {
  return new Array(times).fill(arg)
}

// 在类型别名中的使用
type GetArray = <T>(arg: T, times: nubmer) => T[]
let getArray: GetArray = (arg: any, times: number) => {
  return new Array(times).fill(arg)
}

// 在接口中的使用
interface GetArray {
  <T>(arg: T, times: number): T[]
}

interface GetArray<T> { // 将泛型变量提升到最外层，接口里的任何地方都能使用这个泛型变量
  (arg: T, times: nubmer): T[],
  array: T[]
}
```

## 泛型类

```typescript
// 泛型类看上去与泛型接口差不多。 泛型类使用<>括起泛型类型，跟在类名后面。
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) { return x + y }
```

::: warning
类有两部分：静态部分和实例部分。 泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型
:::

## 泛型约束

在之前的例子中，我们要访问value的length属性，但是编译器并不能证明每种类型都有length属性，所以就报错了。

为此需要对泛型变量列出约束要求，使用 `extends` 关键字来实现约束

```typescript
interface ValueWithLength { // 要求传入的arg有length属性
  length: number
}

const getArray = <T extends ValueWithLength>(arg: T, times: number): T[] => {
  return new Array(times).fill(arg)
}

getArray([1, 2], 3)
getArray('abc', 3)
getArray({
  length: 2
}, 3)

getArray(123, 3) // 报错
```

## 在泛型约束中使用类型参数

```typescript
let obj = {
  a: '1',
  b: '2'
}

const getProps = (object, propName) => {
  return object[propName]
}

getProps(obj, 'a') // '1'
getProps(obj, 'c') // undefined  但是编译器并没有报错

// 使用约束
// keyof 返回对象所有属性名组成的数组
const getprops = <T, K extends keyof T>(object: T, propName: K) => {
  return object[propName]
}

getProps(obj, 'c')
// 类型“"c"”的参数不能赋给类型“"a" | "b"”的参数
```
