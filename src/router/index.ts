import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue'), meta: { title: 'Главная' } },
    { path: '/test/:id', name: 'test', component: () => import('@/pages/TestPage.vue'), meta: { title: 'Тест' } },
    { path: '/history', name: 'history', component: () => import('@/pages/HistoryPage.vue'), meta: { title: 'История' } },
    { path: '/attempt/:attemptId', name: 'attempt', component: () => import('@/pages/AttemptPage.vue'), meta: { title: 'Попытка' } },
  ],
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title ?? 'Daily Frontend Tests'} | Daily Frontend Tests`
  next()
})

export default router
