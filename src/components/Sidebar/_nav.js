export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      title: true,
      name: 'Components',
      wrapper: {
        element: '',
        attributes: {}
      },
    },
    {
      name: 'Purchase Orders',
      url: '/purchase-order',
      icon: 'icon-docs',
      children: [
        {
          name: 'New',
          url: '/purchase-order/new',
          icon: 'icon-plus'
        },
        {
          name: 'Search',
          url: '/purchase-order/search',
          icon: 'icon-magnifier'
        }
      ]
    }
  ]
};
