# 接口

[官方文档](https://www.tslang.cn/docs/handbook/interfaces.html)

## 基本用法

把所有成员组合起来，用来封装一定功能的集合

```typescript
interface NameInfo {
// interface name must start with a capitalized I 命名必须用大写的 I 开头，可在tslint rules配置
// interface-name: [ true, 'never-prefix' ](从来不需要前缀)
  firstName: string,
  lastName: string
}

const getFullName ({ firstName, lastName }: NameInfo): string => {
  return `${firstName} ${lastName}`
}

getFullName({ firstName: 'Park', lastName: 'ChoRong' }) // Park ChoRong
// 若此时传入的属性值不是 string 类型，则会报错
```

## 可选属性&只读属性

```typescript
interface Vegetable {
  color?: string,        // 定义可选属性在属性的冒号前面加一个 ?
  readonly type: string  // 定义只读属性在属性名前面加 readonly
}

// 只读属性不可修改
let vegetableinfo: Vegetable = {
  type: 'tomato'
}

vegetableinfo.type = 'potato' // error

// 只读数组
interface ArrInter {
  0: number,
  readonly 1: string
}

let arr: ArrInter = [1, 'a']
arr[1] = 'b'                  // error
```

## 多余属性检查

```typescript
interface Vegetable {
  color: string,
  type: string
}

const getVegetables = ({ color, type }: Vegetable) => {
  return `A ${color ? (color + ' ') : ' '} ${type}`
}

getVegetables ({
  // 这里需要按照属性名的首字母排序，若不需要可以在tslint rules中关闭
  // object-literal-sort-keys: [false]
  type: 'tomato',
  color: 'red'
})
// A red tomato

getVegetables ({
  type: 'tomato',
  color: 'red',
  size: 2        // error
})
// 当传入的参数个数超过接口定义的个数会报错
```

## 绕过多余属性检查

### 解决方法：类型断言

类型断言，告诉程序传入的就是合格的参数

```typescript
getVegetables ({
  type: 'tomato',
  color: 'red',
  size: 2
} as Vegetable)
```

### 解决方法：索引签名

索引签名，在接口中用 `[]` 包裹一个自定义名称指定为 `string` 类型表示一个属性名，指定属性为 `any` 类型

```typescript
interface Vegetable {
  color: string,
  type: string,
  [prop: string]: any
}
```

### 解决方法：类型兼容性

类型兼容性，传入的对象必须包含方法所需要的属性名，可多不可少

```typescript
const vegetableinfo = {
  type: 'tomato',
  color: 'red',
  size: 2
}

getVegetables(vegetableinfo)
```

## 定义函数结构

```typescript
interface addFunc {
  // 参数结构
  (num1: number, num2: number): number //返回值类型
}
// tslint 推荐用类型别名的形式
==> type addFunc (num1: number, num2: number) => number

const add: addFunc = (n1, n2) => n1 + n2
// 参数名不必相同，位置和个数一致即可
```

## 定义索引类型

```typescript
interface RoleDic {
  [id: number]: string
}
const role: RoleDic = {
  '123': 'abc' // error
}

interface RoleDic {
  [id: string]: string
}
const role: RoleDic = {
  '123': 'abc',
  123: 'abc' // js中指定的属性名如果是数值，会被转换为字符串
}
```

## 接口继承

```typescript
interface A {
  color: string
}

interface B extends A {
  radius: number
}

const b: B = {
  color: 'red',
  radius: 1
}
```

## 混合类型接口

```typescript
interface Counter {
  (): void,
  count: number
}

const getCounter = (): Counter => {
  const c = () => { c.count++ }
  c.count = 0
  return c
}

const counter: Counter = getCounter()

counter()
counter.count // 1

counter()
counter.count // 2

counter()
counter.count // 3
```
