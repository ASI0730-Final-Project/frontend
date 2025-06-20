<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-section">
        <div class="footer-brand">
          <h2 class="footer-title">GigU</h2>
          <p class="footer-subtitle">{{ t('footer.tagline') }}</p>
        </div>
      </div>
      
      <div class="footer-section">
        <div class="footer-links">
          <h3 class="footer-heading">{{ t('footer.quickLinks') }}</h3>
          <ul class="footer-list">
            <li><a href="#" class="footer-link">{{ t('toolbar.home') }}</a></li>
            <li><a href="#" class="footer-link">{{ t('toolbar.gigs') }}</a></li>
            <li><a href="#" class="footer-link">{{ t('toolbar.login') }}</a></li>
            <li><a href="#" class="footer-link">{{ t('toolbar.register') }}</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-section">
        <div class="footer-info">
          <h3 class="footer-heading">{{ t('footer.about') }}</h3>
          <p class="footer-description">{{ t('footer.description') }}</p>
        </div>
      </div>
      
      <div class="footer-section">
        <div class="footer-contact">
          <h3 class="footer-heading">{{ t('footer.contact') }}</h3>
          <div class="contact-info">
            <p class="contact-item">
              <i class="pi pi-envelope"></i>
              <span>info@gigu.com</span>
            </p>
            <p class="contact-item">
              <i class="pi pi-phone"></i>
              <span>+1 (555) 123-4567</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">{{ t('footer.copyright') }}</p>
        <div class="footer-social">
          <a href="#" class="social-link" aria-label="Facebook">
            <i class="pi pi-facebook"></i>
          </a>
          <a href="#" class="social-link" aria-label="Twitter">
            <i class="pi pi-twitter"></i>
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <i class="pi pi-instagram"></i>
          </a>
          <a href="#" class="social-link" aria-label="LinkedIn">
            <i class="pi pi-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #23242a 0%, #18191d 100%);
  color: #fff;
  padding: 3rem 0 1rem 0;
  margin-top: auto;
  border-top: 1px solid #35344a;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  margin-bottom: 1rem;
}

.footer-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #7b1fa2, #b39ddb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
  margin: 0;
  font-weight: 500;
}

.footer-heading {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7b1fa2;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #bdbdbd;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #7b1fa2;
  transform: translateX(5px);
}

.footer-description {
  color: #bdbdbd;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #bdbdbd;
  font-size: 1rem;
  margin: 0;
}

.contact-item i {
  color: #7b1fa2;
  font-size: 1.1rem;
  width: 20px;
}

.footer-bottom {
  border-top: 1px solid #35344a;
  padding-top: 1.5rem;
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #bdbdbd;
  font-size: 0.9rem;
  margin: 0;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #35344a;
  color: #bdbdbd;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.social-link:hover {
  background: #7b1fa2;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(123, 31, 162, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .app-footer {
    padding: 2rem 0 1rem 0;
  }
  
  .footer-container {
    padding: 0 1rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .footer-title {
    font-size: 2rem;
  }
  
  .footer-bottom-content {
    padding: 0 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .footer-social {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-title {
    font-size: 1.8rem;
  }
  
  .footer-subtitle {
    font-size: 1rem;
  }
  
  .footer-heading {
    font-size: 1.1rem;
  }
  
  .social-link {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}
</style>
