<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logoMain.png" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/medical-org-actions">Medical Organization Actions</RouterLink>
        <RouterLink to="/medical-org-sign-up">Organization Sign-up</RouterLink>
        <RouterLink to="/user-sign-up">User Sign-up</RouterLink>
        <RouterLink to="/admin-approve-organization">Admin page</RouterLink>
        <RouterLink to="/user-actions">User actions</RouterLink>
        <RouterLink to="/doctor-actions">Doctor actions</RouterLink>

      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  background-color: var(--light-gray, #f9f9f9);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: block;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.wrapper {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: var(--dark-gray, #333);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  border: 1px solid transparent;
}

nav a:hover, nav a:focus {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
}

@media (min-width: 768px) {
  header {
    padding: 1rem 5rem;
  }
}

:root {
  --light-gray: #f9f9f9;
  --dark-gray: #333;
}
</style>

