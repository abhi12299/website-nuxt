<template>
  <section class="top-header style-four bg-pattern">
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-sm-12 text-center">
          <h1 class="title-stroke">Hi</h1>
        </div>
        <div class="col-lg-6 col-md-10 offset-md-1 offset-lg-3 text-center">
          <p>
            I'm Abhishek Mehandiratta. I am a
            <b>Web Developer</b>
          </p>

          <ul class="social-icons light list-inline">
            <li class="list-inline-item">
              <div class="social-icons-surround">
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://github.com/abhi12299"
                >
                  <font-awesome-icon
                    :icon="['fab', 'github']"
                    size="3x"
                    class="icon"
                    title="Github"
                  />
                </a>
              </div>
            </li>
            <li class="list-inline-item">
              <div class="social-icons-surround">
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://stackoverflow.com/users/8174895/abhishek-mehandiratta"
                >
                  <font-awesome-icon
                    :icon="['fab', 'stack-overflow']"
                    size="3x"
                    class="icon"
                    title="Stack Overflow"
                  />
                </a>
              </div>
            </li>

            <li class="list-inline-item">
              <div class="social-icons-surround">
                <a
                  target="_blank"
                  rel="noopener"
                  href="mailto:abhi.9811206369@gmail.com"
                >
                  <font-awesome-icon
                    :icon="['far', 'envelope']"
                    size="3x"
                    class="icon"
                    title="Email"
                  />
                </a>
              </div>
            </li>
            <li class="list-inline-item">
              <div class="social-icons-surround">
                <a href="Abhishek.pdf" download="AbhishekCV">
                  <font-awesome-icon
                    :icon="['far', 'file-pdf']"
                    size="3x"
                    class="icon"
                    title="CV"
                  />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'IntroHeader'
}
</script>

<style scoped>
.top-header h1 {
  font-size: 50px;
  line-height: 70px;
  color: #000;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 25px;
}
.top-header p {
  font-size: 30px;
  color: #000;
  font-weight: 300;
  line-height: 48px;
  margin-bottom: 10px;
}
.top-header p b {
  font-weight: 700;
}

.top-header.style-four {
  margin: 30px 30px 0 30px;
  background-color: #f4f8fb;
  padding-top: 170px;
  padding-bottom: 130px;
}
.top-header h1.title-stroke {
  line-height: 150px;
  font-size: 150px;
  -webkit-text-stroke: 4px #999;
  -webkit-text-fill-color: #333;
}
.top-header.style-four p {
  margin-top: 5px;
  line-height: 54px;
  margin-bottom: 10px;
  display: inline-block;
}

.social-icons {
  margin-top: 32px;
}
.social-icons li:not(:last-child) {
  margin-right: 20px;
}
.social-icons li:not(:last-child) a {
  padding-right: 25px;
  border-right: 1px solid grey;
}
.social-icons li a {
  display: inline-block;
  text-align: center;
}

/* RESPONSIVE SECTION */
@media (max-width: 1400px) {
  .top-header h1 {
    margin-top: 20px;
    font-size: 50px;
  }
}

@media (max-width: 1024px) {
  .top-header h1 {
    font-size: 46px;
    margin-bottom: 20px;
  }
}

@media (max-width: 991px) {
  .top-header.style-four {
    padding-top: 100px;
    padding-bottom: 100px;
  }
  .top-header.style-four {
    margin: 25px 15px 0 15px;
  }
}

@media (max-width: 580px) {
  .top-header h1 {
    font-size: 36px;
    line-height: 50px;
  }
  .top-header p {
    font-size: 22px;
    line-height: 32px;
  }
  .top-header.style-four p {
    font-size: 24px;
    line-height: 34px;
  }
}

@media (max-width: 380px) {
  .top-header h1 {
    font-size: 34px;
    line-height: 40px;
  }
  .top-header p {
    font-size: 22px;
    line-height: 32px;
  }
  .top-header.style-four p {
    font-size: 24px;
    line-height: 34px;
  }
  .social-icons li:not(:last-child) {
    margin-right: 10px;
  }
  .social-icons li:not(:last-child) a {
    padding-right: 15px;
  }
}

@media (max-width: 310px) {
  .social-icons li:not(:last-child) {
    margin-right: 3px;
  }
  .social-icons li:not(:last-child) a {
    padding-right: 7px;
  }
}
</style>
