import Vue from 'vue'
import VueRouter from 'vue-router'
import Signin from '../views/Signin'
import Signup from '../views/Signup'
import MainPage from '../views/MainPage'
import Profile from '../views/Profile'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Signin',
        component: Signin
    },
    {
        path: '/Signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/MainPage',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/Profile',
        name: 'Profile',
        component: Profile
    },
]

const router = new VueRouter({
    routes
})

export default router