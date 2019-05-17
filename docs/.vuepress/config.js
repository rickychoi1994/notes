module.exports = {
  base: '/notes/',
  title: 'TypeScript',
  description: 'TypeScript 个人学习笔记',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Github', link: 'https://github.com/rickychoi1994/notes'  }
    ],
    sidebar: {
      '/notes/': [
        {
          // title: '基础类型',
          collapsable: false,
          children: [
            '',
            'symbol',
            'interface',
            'function',
            'generics',
            'es6-class-1',
            'es6-class-2',
            'class',
            'enum',
            'inference-compatibility',
            'advanced-type',
            'es6-module',
            'ts-module',
            'merging',
            'decortaor'
          ]
        }
      ]
    },
    lastUpdated: '最近一次更新时间'
  }
}
