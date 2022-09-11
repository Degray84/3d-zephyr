interface Tab {
  route: string;
  label: string;
  icon?: string;
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
