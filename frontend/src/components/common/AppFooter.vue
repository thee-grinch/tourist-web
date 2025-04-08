<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3 class="footer-title">Kenya Travel</h3>
          <p class="footer-text">
            Discover the beauty and diversity of Kenya with our expertly curated travel experiences.
          </p>
        </div>

        <div class="footer-col">
          <h3 class="footer-title">Quick Links</h3>
          <ul class="footer-links">
            <li><RouterLink to="/" class="footer-link">Home</RouterLink></li>
            <li><RouterLink to="/destinations" class="footer-link">Destinations</RouterLink></li>
            <li><RouterLink to="/about" class="footer-link">About Us</RouterLink></li>
            <li><RouterLink to="/contact" class="footer-link">Contact</RouterLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-title">Contact Us</h3>
          <ul class="footer-contact">
            <li class="flex items-center">
              <!-- <EnvelopeIcon class="h-5 w-5 mr-2" /> -->
              <span>info@kenyatravel.com</span>
            </li>
            <li class="flex items-center">
              <!-- <PhoneIcon class="h-5 w-5 mr-2" /> -->
              <span>+254 700 123 456</span>
            </li>
            <li class="flex items-center">
              <!-- <MapPinIcon class="h-5 w-5 mr-2" /> -->
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-title">Follow Us</h3>
          <div class="footer-social">
            <a href="#" class="social-link">
              <!-- <FacebookIcon class="h-6 w-6" /> -->
            </a>
            <a href="#" class="social-link">
              <!-- <TwitterIcon class="h-6 w-6" /> -->
            </a>
            <a href="#" class="social-link">
              <!-- <InstagramIcon class="h-6 w-6" /> -->
            </a>
            <a href="#" class="social-link">
              <!-- <YoutubeIcon class="h-6 w-6" /> -->
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">&copy; {{ currentYear }} Kenya Travel. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// import {
//   EnvelopeIcon,
//   PhoneIcon,
//   MapPinIcon,
//   // FacebookIcon,
//   TwitterIcon,
//   InstagramIcon,
//   // YoutubeIcon,
// } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
@use '@/assets/scss/_variables' as *;


.app-footer {
  background-color: $gray-900;
  color: $white;
  padding: $spacing-12 0 $spacing-6;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-8;
  margin-bottom: $spacing-8;

  @media (min-width: $breakpoint-sm) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.footer-col {
  h3 {
    color: $white;
    margin-bottom: $spacing-4;
    font-size: $font-size-lg;
  }
}

.footer-text {
  color: $gray-400;
  margin-bottom: $spacing-4;
}

.footer-links {
  list-style: none;

  li {
    margin-bottom: $spacing-2;
  }
}

.footer-link {
  color: $gray-400;
  transition: color 0.2s ease;

  &:hover {
    color: $primary;
    text-decoration: none;
  }
}

.footer-contact {
  list-style: none;

  li {
    margin-bottom: $spacing-2;
    color: $gray-400;
  }
}

.footer-social {
  display: flex;
  gap: $spacing-4;
}

.social-link {
  color: $gray-400;
  transition: color 0.2s ease;

  &:hover {
    color: $primary;
  }
}

.footer-bottom {
  border-top: 1px solid $gray-700;
  padding-top: $spacing-4;
  text-align: center;
}

.copyright {
  color: $gray-500;
  font-size: $font-size-sm;
}
</style>
