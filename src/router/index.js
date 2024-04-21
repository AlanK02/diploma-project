import { createRouter, createWebHistory } from 'vue-router'
import UserSignUp from '@/components/UserSignUp.vue'
import MedicalOrgSignUp from '@/components/MedicalOrgSignUp.vue'
import MedicalOrgActions from '@/components/MedicalOrgActions.vue'
import AdminApproveOrganization from '@/components/AdminApproveOrganization.vue'
import UserActions from '@/components/UserActions.vue'
import DoctorActions from '@/components/DoctorActions.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user-actions',
      name: 'UserActions',
      component: UserActions
    },
    {
      path: '/doctor-actions',
      name: 'DoctorActions',
      component: DoctorActions
    },
    {
      path: '/user-sign-up',
      name: 'UserSignUp',
      component: UserSignUp
    },
    {
      path: '/medical-org-sign-up',
      name: 'MedicalOrgSignUp',
      component: MedicalOrgSignUp
    },
    {
      path: '/medical-org-actions',
      name: 'MedicalOrgActions',
      component: MedicalOrgActions
    },
    {
      path: '/admin-approve-organization',
      name: 'AdminApproveOrganization',
      component: AdminApproveOrganization
    },
  ]
})

export default router
