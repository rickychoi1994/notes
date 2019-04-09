# 基础类型

## 布尔类型
```typescript
let bool: boolean = true
```

## 数值类型
```typescript
let num: number = 123
```

## 字符串类型
```typescript
let str: string = 'abc'

// 支持模板字符串
str = `abc${ num }`
```

## 数组类型

指定为数组类型数组
```typescript
let arr: number[]
let arr: Array<number>
arr = [ 1, 2, 3 ]
```

指定为 字符串 或者 数值 类型的数组
```typescript
let arr: (string | number)[]
arr = [ '1', 2 ]
```

## 元组类型

必须按照指定的类型顺序放入元素，并且长度固定，超出长度的元素为越界元素，是不被允许的
```typescript
let tuple: [ number, string, boolean ] // length = 3
tuple = [ 1, 'a', true ]
```

## 枚举类型
通过 enum 来定义枚举类型
```typescript
enum Roles {
  SUPER_ADMIN,  // 0
  ADMIN,  // 1
  USER  // 2
}

// { 0: 'SUPER_ADMIN', 1: 'ADMIN', 2: 'USER', SUPER_ADMIN: 0, ADMIN: 1, USER: 2 }
```

可以指定每一项的序列号，若指定序列号的下一项没有指定序列号，则下一项的序列号 +1
```typescript
enum Roles {
  SUPER_ADMIN,  // 0
  ADMIN: 4,  // 4
  USER,  //5
}
```

## any 类型

指定变量为 any 类型后可以给它赋值为任意类型的值
```typescript
let value: any
value = true
value = 123
value = 'abc'
let arr: any[] = [ 1, '2', true ]
```

## void 类型

表示无类型即任何类型都不是
若函数没有指定的返回值则返回的类型就是 void
```typescript
const consoleText = (text): void => {
  console.log(text)
}
```

## null undefined

是其它类型的子类型，可以赋值给其它类型

## never 类型

表示永远都不存在的值的类型
是任意类型的子类型，可以赋值给任意类型

## object 类型

```typescript
let obj = {
  name: 'tom'
}
```

## 类型断言

手动指定一个值的类型

::: tip 类型断言的两种方法
1. <类型>value
2. value as 类型
:::

```typescript
const getLength = (target: number | string): number => {
  if (<string>target.length || (target as string).length === 0) {
    return (target as string).length
  } else {
    return target.toString().length
  }
}
```
