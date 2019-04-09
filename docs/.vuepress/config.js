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
            ''
          ]
        }
      ]
    }
  }
}
