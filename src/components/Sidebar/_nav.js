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
        , {
          name: 'My Orders',
          url: '/purchase-order/mine',
          icon: 'icon-doc'
        },
        {
          name: 'New',
          url: '/purchase-order/new',
          icon: 'icon-plus'
        },
        {
          name: 'Find',
          url: '/purchase-order/find',
          icon: 'icon-magnifier'
        }
      ]
    }
  ]
};
