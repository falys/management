import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout'




export const constantRoutes = [
    {
        path: '/login',
        component: () => import('../views/login/index.vue'),
        meta: { title: '登录' }
    },
    // {
    //     path: '/forget',
    //     component: () => import('@/views/login/forget'),
    //     hidden: true
    // },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: '/dashboard',
                component: () => import('../views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: { title: '系统首页' }
            }
        ]
    },
    // {
    //     path: '',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/user/list',
    //             component: () => import('../views/user/list.vue'),
    //             meta: { title: '用户管理' }
    //         }
    //     ]
    // },
    // {
    //     path: '',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/roles/list',
    //             component: () => import('../views/roles/list.vue'),
    //             meta: { title: '角色管理' }
    //         },
    //         {
    //             path: '/roles/member',
    //             component: () => import('../views/roles/member.vue'),
    //             meta: { title: '角色成员' }
    //         }
    //     ]
    // },
    // {
    //     path: '',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/permission/list',
    //             component: () => import('../views/permission/list.vue'),
    //             meta: { title: '用户管理' }
    //         }
    //     ]
    // },
    // {
    //     path: '',
    //     component: Layout,
    //     children: [
    //         {
    //             path: '/user/list',
    //             component: () => import('../views/user/list.vue'),
    //             meta: { title: '用户管理' }
    //         }
    //     ]
    // }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})


const router = createRouter()

export default router
