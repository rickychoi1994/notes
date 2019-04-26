module.exports = {
  base: '/notes/',
  title: 'Notes',
  description: 'study notes on ts',
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
            'class'
          ]
        }
      ]
    },
    lastUpdated: '最近一次更新时间'
  }
}
