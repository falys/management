import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import './common/directives';
import 'babel-polyfill';

Vue.config.productionTip = false;
Vue.use(ElementUI);

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {

    // determine whether the user has logged in
    const token = sessionStorage.getItem('token')

    if (token) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
        } else {
            if (store.state.permission.buttons instanceof Array === false || store.state.permission.buttons.length < 1 )
            {
                store.dispatch('getButtons')
            }

            if (store.state.permission.asynRouters instanceof Array === false || store.state.permission.asynRouters.length < 1 ) {
                store.dispatch('getAsynRoutes').then(() => {
                    for (const v of store.state.permission.asynRouters) {
                        router.options.routes.push(v)
                        router.addRoutes(router.options.routes)
                    }
                    console.log(router)
                    next({ ...to, replace: true })
                    next()
                })
            } else {
                next()
            }
            next()
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login`)
        }
    }
})



// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
