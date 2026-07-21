import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '../views/CatalogView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import ProductFormView from '../views/ProductFormView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'catalog', component: CatalogView },
    { path: '/products/new', name: 'product-new', component: ProductFormView },
    { path: '/products/:id/edit', name: 'product-edit', component: ProductFormView },
    { path: '/products/:id', name: 'product-detail', component: ProductDetailView },
  ],
})
