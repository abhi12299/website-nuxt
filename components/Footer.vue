<template>
  <section class="footer-wrapper pad-50 bg-lightblue style-2">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-4 col-12 widget">
          <nuxt-link to="/" class="logo">
            <img src="~/assets/png/logo.png" alt="logo" />
          </nuxt-link>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-5 col-5 widget footer-link-list-1">
          <ul class="widget-link">
            <li>
              <nuxt-link to="/">Home</nuxt-link>
            </li>

            <li>
              <nuxt-link to="/blog">Blog</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-4 col-5 widget">
          <ul class="widget-link">
            <li>
              <nuxt-link to="/about">About</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/contact">Contact</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="row pad-top-50">
        <div class="col-lg-3 col-md-4 widget social-share-container">
          <ul class="social-share list-inline">
            <li class="list-inline-item">
              <a
                target="_blank"
                rel="noopener"
                href="https://github.com/abhi12299"
              >
                <font-awesome-icon
                  :icon="['fab', 'github']"
                  class="icon"
                  title="Github"
                />
              </a>
            </li>
            <!-- <li class="list-inline-item">
              <a
                target="_blank"
                rel="noopener"
                href="https://stackoverflow.com/users/8174895/abhishek-mehandiratta"
              >
                <font-awesome-icon
                  :icon="['fab', 'stack-overflow']"
                  class="icon"
                  title="Stack Overflow"
                />
              </a>
            </li> -->
            <li class="list-inline-item">
              <a
                target="_blank"
                rel="noopener"
                href="mailto:abhi.9811206369@gmail.com"
              >
                <font-awesome-icon
                  :icon="['far', 'envelope']"
                  class="icon"
                  title="Email"
                />
              </a>
            </li>
            <li class="list-inline-item">
              <a
                href="https://www.linkedin.com/in/abhishek-mehandiratta-4269761a1/"
                target="_blank"
              >
                <font-awesome-icon
                  :icon="['fab', 'linkedin-in']"
                  class="icon"
                  title="LinkedIn"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.footer-wrapper .widget-over {
  background-color: #fff;
}

.footer-wrapper .logo img {
  max-width: 45%;
}

.footer-wrapper .icon {
  font-size: 1.5em;
}

.footer-wrapper .widget-over:after {
  content: '';
  height: 75px;
  width: 100%;
  background-color: #fff;
  top: 100%;
  left: 0;
  position: absolute;
}

.footer-wrapper .widget-over:before {
  content: '';
  height: 75px;
  width: 100%;
  background-color: #fff;
  bottom: 100%;
  left: 0;
  position: absolute;
}

.footer-wrapper .widget-over .subscribe-form {
  width: 100%;
  margin-bottom: 10px;
}

.footer-wrapper .widget-over .back-top {
  margin-top: 15px;
}

.footer-wrapper .social-share li {
  font-size: 16px;
  margin-right: 15px;
}

.footer-wrapper .social-share li a i {
  color: #333;
}

.widget-title {
  font-size: 14px;
  line-height: 44px;
  color: #000;
  font-weight: 500;
  margin-bottom: 30px;
  text-transform: capitalize;
}

.widget-title2 {
  font-size: 16px;
  letter-spacing: 1px;
  margin-top: 7px;
  display: inline-block;
  line-height: 26px;
  color: #000;
  font-weight: 500;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.widget-title3 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 35px;
  display: inline-block;
}

.footer-wrapper .widget-link-2 li a {
  margin-right: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #000;
}

.widget-link li {
  width: 100%;
  float: left;
  position: relative;
  display: block;
}

.widget-link li a {
  font-size: 16px;
  line-height: 45px;
  color: #000;
  font-weight: 300;
  cursor: pointer;
}

.footer-wrapper .widget-text {
  font-size: 16px;
  line-height: 34px;
  color: #000;
  font-weight: 300;
  letter-spacing: 0.2px;
  margin-top: 5px;
  margin-bottom: 15px;
  display: inline-block;
}

.widget p {
  font-size: 16px;
  line-height: 32px;
  color: #333;
  font-weight: 300;
}

.subscribe-form {
  border-bottom: 1px solid #ccc;
  width: 100%;
  margin-top: 25px;
  display: table;
}

.subscribe-form input {
  width: 90%;
  background: transparent;
  float: left;
  line-height: 40px;
  outline: none;
  border: 0;
  padding: 0;
  font-size: 12px;
  color: #555;
}

.subscribe-btn {
  float: right;
  width: 10%;
  background-color: transparent;
  text-align: right;
  color: #111;
  font-size: 16px;
  outline: none;
  border: 0;
  line-height: 40px;
  padding: 0;
}

.back-top {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  margin-top: 45px;
  display: block;
  letter-spacing: 1px;
}

.icon-back {
  border: 1px solid #ccc;
}

.icon-back img {
  width: 45px;
}

.footer-wrapper.style-2 .widget-link li a {
  font-size: 14px;
  line-height: 44px;
  color: #000;
  font-weight: 400;
  /* text-transform: uppercase; */
  letter-spacing: 0.4px;
}

.footer-wrapper.style-2 button i {
  color: #555;
  font-size: 12px;
}

.footer-wrapper p {
  font-size: 14px;
  line-height: 30px;
  color: #000;
  font-weight: 400;
  /* text-transform: uppercase; */
  letter-spacing: 0.4px;
  margin-right: 0;
}

.footer-wrapper.bgc-top:after {
  content: '';
  position: absolute;
  background-color: #f4f8fb;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 150%;
  z-index: -1;
}

.social-share li:not(:last-child)::after {
  content: '•';
}
.social-share li:not(:last-child) a {
  padding-right: 10px;
}

@media (min-width: 991px) {
  .footer-wrapper .col-lg-2 {
    -ms-flex: 0 0 16.666667%;
    flex: 0 0 19%;
    max-width: 19%;
  }
}

@media (max-width: 991px) {
  .footer-wrapper .social-share-container {
    text-align: center !important;
    margin: auto;
  }
}

@media (max-width: 767px) {
  .footer-link-list-1,
  .subscribe-form {
    margin-left: 10px;
  }

  .footer-wrapper .social-share-container {
    text-align: center !important;
  }

  .footer-wrapper .logo img {
    max-width: 20%;
  }
}
</style>
