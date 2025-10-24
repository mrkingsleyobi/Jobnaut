<template>
  <div class="layout">
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>JobNaut</h1>
        </div>
        <div class="nav-links">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/jobs">Jobs</NuxtLink>
          <NuxtLink to="/profile">Profile</NuxtLink>
        </div>
      </nav>
    </header>
    <main class="main-content">
      <slot />
    </main>
    <footer class="footer">
      <p>&copy; 2025 JobNaut. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
// Default layout component
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h1 {
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #34495e;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #34495e;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>