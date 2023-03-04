import MainView from '@/views/MainView.vue';
import type { RouteComponent, RouteLocation } from 'vue-router';
const HomeView = () => import('@/views/common/HomePage.vue');
const ProductsView = () => import('@/views/common/ProductsPage.vue');
const AboutView = () => import('@/views/common/AboutPage.vue');

const CreateProductPage = () => import('@/views/admin/CreateProductPage.vue');
const ReviewProductsPage = () => import('@/views/admin/ReviewProductsPage.vue');

const NotFound = () => import('@/views/NotFound.vue');

const routes: RouteComponent[] = [
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
        path: '/new_product',
        name: 'new_product',
        props: (route: RouteLocation) => ({ query: route.query }),
        component: CreateProductPage,
      },
      {
        path: '/product_review',
        name: 'product_review',
        component: ReviewProductsPage,
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

export default routes;
