```vue
<template>
  <main class="landing-page">
    <nav class="navbar">
      <div class="logo">🐾 CRM Vet</div>

      <div class="nav-buttons">
        <router-link to="/login" class="btn btn-outline">
          Iniciar sesión
        </router-link>

        <router-link :to="{ name: 'sign_up' }" class="btn btn-primary">
          Registrarse
        </router-link>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-content">
        <span class="badge">🐶 Cuidamos de quienes más quieres</span>

        <h1>
          Bienvenido a <span>CRM Vet</span>
        </h1>

        <p>
          Una plataforma para el manejo de mascotas.
          Organiza su información, administra sus cuidados
          y mantén todo lo importante en un solo lugar.
        </p>

        <div class="hero-buttons">
          <router-link :to="{ name: 'sign_up' }" class="btn btn-primary">
            Comenzar ahora →
          </router-link>

          <a href="#beneficios" class="btn btn-outline">
            Conocer más
          </a>
        </div>
      </div>

      <div class="hero-image">
        <div class="pet-emoji">🐕</div>
        <div class="floating-card">
          <span>❤️</span>
          <div>
            <strong>Su bienestar importa</strong>
            <small>Todo para tus mascotas</small>
          </div>
        </div>
      </div>
    </section>

    <section id="beneficios" class="benefits">
      <h2>Todo lo que necesitas en un solo lugar</h2>
      <p class="section-description">
        Herramientas para facilitar el cuidado y la administración
        de tus mascotas.
      </p>

      <div class="benefit-cards">
        <article class="card">
          <div class="card-icon">🐕</div>
          <h3>Gestión de mascotas</h3>
          <p>
            Organiza la información y los datos importantes
            de cada mascota.
          </p>
        </article>

        <article class="card">
          <div class="card-icon">🩺</div>
          <h3>Atención veterinaria</h3>
          <p>
            Facilita la administración de servicios y cuidados
            veterinarios.
          </p>
        </article>

        <article class="card">
          <div class="card-icon">📅</div>
          <h3>Gestión de servicios</h3>
          <p>
            Mantén organizadas las citas y los servicios
            relacionados con tus mascotas.
          </p>
        </article>
      </div>
    </section>

    <footer class="footer">
      <p>© 2026 CRM Vet · El bienestar de tus mascotas es nuestra prioridad.</p>
    </footer>
  </main>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped src="@/assets/css/Landing_page.css"></style>
