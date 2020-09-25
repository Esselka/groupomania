import Vue from 'vue'
import VueRouter from 'vue-router'
import Signin from '../views/Signin'
import Signup from '../views/Signup'
import MainPage from '../views/MainPage'
import Profile from '../views/Profile'
import CreatePost from '../views/CreatePost'
import PostID from '../views/PostID'

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
    {
        path: '/CreatePost',
        name: 'CreatePost',
        component: CreatePost
    },
    {
        path: '/post/:slug',
        name: 'PostID',
        component: PostID
    }
]

const router = new VueRouter({
    routes
})

export default router