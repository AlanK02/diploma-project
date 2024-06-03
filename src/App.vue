<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/newLogo.png" />

    <div class="wrapper">
      <div class="mini-logo">
        <img src="@/assets/logoLight.png" alt="">
      </div>
      <nav class="nav">
        <RouterLink class="nav-link" to="/medical-org-actions">Medical Organization Actions</RouterLink>
        <RouterLink class="nav-link" to="/medical-org-sign-up">Organization Sign-up</RouterLink>
        <RouterLink class="nav-link" to="/user-sign-up">User Sign-up</RouterLink>
        <RouterLink class="nav-link" to="/admin-approve-organization">Admin page</RouterLink>
        <RouterLink class="nav-link" to="/user-actions">User actions</RouterLink>
        <RouterLink class="nav-link" to="/doctor-actions">Doctor actions</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

header {
  display: flex;
  position: relative;
  width: 100%;
  margin-bottom: 200px;
}

.mini-logo {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 50%;
}

.mini-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 50px;
  left: calc(50% + 140px);
  transform: translateX(-50%);
}

.wrapper {
  flex-grow: 1;
  position: fixed;
  top: 0;
  left: 0;
  min-width: 280px;
  max-width: 280px;
  display: flex;
  background: white;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
}

.nav {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-link {
  color: var(--dark-gray, #333);
  text-decoration: none;
  width: 100%;
  padding: 0.5rem 1rem;
  height: 50px;
  font-size: 15px;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid transparent;
  text-wrap: nowrap;
  display: flex;
  align-items: center;
}

.nav-link:hover,
.nav-link:focus {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
}

:root {
  --light-gray: #f9f9f9;
  --dark-gray: #333;
}
</style>
