<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const currentYear = new Date().getFullYear()

function changeLanguage(lang) {
  locale.value = lang
  localStorage.setItem('selectedLang', lang)
}
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content container">
      <div class="footer-columns">
        <div class="column">
          <h4>Categories</h4>
          <ul>
            <li>{{ t('categories.programming') }}</li>
            <li>{{ t('categories.data') }}</li>
            <li>{{ t('categories.business') }}</li>
            <li>{{ t('categories.design') }}</li>
            <li>{{ t('categories.video') }}</li>
            <li>{{ t('categories.music') }}</li>
            <li>{{ t('categories.writing') }}</li>
            <li>{{ t('categories.photo') }}</li>
            <li>{{ t('categories.marketing') }}</li>
          </ul>
        </div>
        <div class="column">
          <h4>ABOUT</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Intellectual Property Claims</li>
          </ul>
        </div>
        <div class="column">
          <h4>SUPPORT</h4>
          <ul>
            <li>Help & Support</li>
            <li>Buying</li>
            <li>Selling</li>
          </ul>
        </div>
        <div class="column">
          <h4>COMMUNITY</h4>
          <ul>
            <li>Invite a Friend</li>
            <li>Become a Seller</li>
            <li>Customer Success Stories</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <img src="/src/components/icons/logo.png" alt="GigU Logo" class="logo" />
        <span>© GigU {{ currentYear }}</span>
        <div class="language-selector">
          <i class="pi pi-globe"></i>
          <select class="language-select" v-model="locale" @change="changeLanguage(locale)">
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #f5f5f5;
  padding: 40px 20px;
  border-top: 1px solid #eee;
  color: #444;
  font-size: 14px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 40px;
}

.column {
  flex: 1 1 200px;
  margin-bottom: 20px;
}

.column h4 {
  margin-bottom: 10px;
  font-weight: 600;
}

.column ul {
  list-style: none;
  padding: 0;
}

.column ul li {
  margin-bottom: 8px;
  color: #666;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ddd;
  padding-top: 20px;
  flex-wrap: wrap;
}

.logo {
  height: 32px;
  margin-right: 10px;
}

.language-selector {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.language-selector .pi {
  margin-right: 6px;
}
</style>
