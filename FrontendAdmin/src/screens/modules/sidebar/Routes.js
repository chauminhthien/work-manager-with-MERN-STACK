export default  [
  {icon: 'mdi mdi-av-timer', caption: 'Dashboard', link: '/'},
  {icon: 'fa fa-user', caption: 'Users', link: '/users'},
  {icon: 'ti-user', caption: 'Group user', link: '/group-user', admin: 0},
  {
    icon: 'ti-layout-grid3', caption: 'Categories',
    children: [
      {icon: 'ti-layout-width-default', caption: 'Category task', link: '/categories/cate-task'}
    ]
  }
];