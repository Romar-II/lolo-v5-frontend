import { createRouter, createWebHistory } from 'vue-router'
import FeedView from "@/views/FeedView.vue";
import FeedSettings from "@/views/FeedSettings.vue";

const routes = [

  {
    path: '/feed',
    name: 'feed',
    component: FeedView
  },
  {
    path: '/feed/settings',
    name: 'feedsettings',
    component: FeedSettings
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
