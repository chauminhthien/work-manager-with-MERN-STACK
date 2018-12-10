export default  [
  {icon: 'mdi mdi-av-timer', caption: 'Dashboard', link: '/'},
  {icon: 'fa fa-user', caption: 'Users', link: '/users'},
  
  {icon: 'ti-user', caption: 'Group user', link: '/group-user', admin: 0},
  {
    icon: 'ti-bar-chart', caption: 'Report', admin: 1,
    children: [
      {icon: 'ti-layout-width-default', caption: 'Project', link: '/report/project'},
      {icon: 'ti-layout-width-default', caption: 'Task', link: '/report/task'},
      {icon: 'ti-layout-width-default', caption: 'Login', link: '/report/login'},
    ]
  },
  {
    icon: 'ti-layout-grid3', caption: 'Categories',
    children: [
      {icon: 'ti-layout-width-default', caption: 'Category task', link: '/categories/cate-task'}
    ]
  }
];