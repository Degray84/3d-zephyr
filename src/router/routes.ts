import MainView from '@/views/MainView.vue';
const HomeView = () => import('@/views/common/HomeView.vue');
const ProductsView = () => import('@/views/common/ProductsView.vue');
const AboutView = () => import('@/views/common/HomeView.vue');

const NotFound = () => import('@/views/NotFound.vue');

export default [
  {
    path: '/',
    name: 'index',
    component: MainView,
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/products',
        name: 'products',
        component: ProductsView,
      },
      {
        path: '/about',
        name: 'about',
        component: AboutView,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound,
  },
];
