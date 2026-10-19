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
        <div class="paw-icon">🐾</div>
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

<style scoped>
.landing-page {
  min-height: 100vh;
  color: #243047;
  background: #f8fafc;
  font-family: Arial, sans-serif;
}

/* Barra de navegación */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 8%;
  background: #ffffff;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #0f766e;
}

.nav-buttons,
.hero-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Botones */
.btn {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.2s ease;
}

.btn-primary {
  color: #ffffff;
  background: #0f766e;
}

 /*FIXME: El botón iniciar sesión solo cambia de color, mientras el otro sube, debo hacer que queden al mismo estilo */
.btn-primary:hover {
  background: #115e59;
  transform: translateY(-2px);
}

.btn-outline {
  color: #0f766e;
  border: 1px solid #0f766e;
  background: transparent;
}

.btn-outline:hover { /*FIXME: */
  background: #ccfbf1;
}

/* Sección principal */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  padding: 80px 10%;
  background: linear-gradient(135deg, #9cf5f0, #f0fdfa);
}

.hero-content {
  max-width: 600px;
}

.badge {
  display: inline-block;
  margin-bottom: 20px;
  padding: 8px 14px;
  border-radius: 20px;
  color: #0f766e;
  background: #ccfbf1;
  font-size: 14px;
}

.hero h1 {
  margin: 0 0 20px;
  font-size: clamp(36px, 5vw, 58px);
  line-height: 1.15;
}

.hero h1 span {
  color: #0f766e;
}

.hero-content > p {
  margin-bottom: 30px;
  color: #64748b;
  font-size: 18px;
  line-height: 1.8;
}

/* Ilustración decorativa */
.hero-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: #99f6e4;
}

.pet-emoji {
  font-size: 130px;
}

.paw-icon {
  position: absolute;
  top: 25px;
  right: 25px;
  font-size: 40px;
  opacity: 0.7;
}

.floating-card {
  position: absolute;
  right: -35px;
  bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 25px #0f172a15;
}

.floating-card > span {
  font-size: 28px;
}

.floating-card strong,
.floating-card small {
  display: block;
}

.floating-card small {
  margin-top: 5px;
  color: #64748b;
}

/* Beneficios */
.benefits {
  padding: 70px 8%;
  text-align: center;
}

.benefits h2 {
  font-size: 32px;
}

.section-description {
  margin-bottom: 40px;
  color: #64748b;
  line-height: 1.6;
}

.benefit-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.card {
  padding: 30px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 42px;
}

.card h3 {
  margin-top: 18px;
  color: #0f766e;
}

.card p {
  color: #64748b;
  line-height: 1.7;
}

/* Pie de página */
.footer {
  padding: 24px;
  color: #64748b;
  background: linear-gradient(135deg, #9cf5f0, #f0fdfa);
  text-align: center;
  font-size: 14px;
}

/* Adaptación para móviles */
@media (max-width: 800px) {
  .hero {
    flex-direction: column;
    padding: 55px 7%;
    text-align: center;
  }

  .hero-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-image {
    width: 240px;
    height: 240px;
    margin: 10px 20px 30px;
  }

  .pet-emoji {
    font-size: 100px;
  }

  .floating-card {
    right: -20px;
  }

  .benefit-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 18px 5%;
  }

  .logo {
    font-size: 19px;
  }

  .nav-buttons {
    gap: 6px;
  }

  .nav-buttons .btn {
    padding: 9px 10px;
    font-size: 12px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero-content > p {
    font-size: 16px;
  }

  .benefits h2 {
    font-size: 26px;
  }
}
</style>
```