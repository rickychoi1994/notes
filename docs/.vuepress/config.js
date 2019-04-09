module.exports = {
  base: '/notes/',
  title: 'Notes',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Github', link: 'https://github.com'  }
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
