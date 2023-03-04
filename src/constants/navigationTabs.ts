interface Tab {
  route: string;
  label: string;
  icon?: string;
  separator?: boolean;
}

const TABS: Readonly<Tab>[] = [
  {
    route: 'home',
    label: 'home',
    icon: 'home',
  },
  {
    route: 'products',
    label: 'products',
    icon: 'storefront',
  },
  {
    route: 'product_review',
    label: 'product_review',
    icon: 'inventory',
  },
  {
    route: 'new_product',
    label: 'new_product',
    icon: 'add',
  },
  {
    route: 'about',
    label: 'about',
    icon: 'person',
  },
];
export default TABS;
