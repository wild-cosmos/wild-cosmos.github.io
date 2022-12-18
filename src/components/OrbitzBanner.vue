<template>
  <nav class="navbar fixed-bottom navbar-dark bg-dark sponsor-banner">
    <img src="../assets/rocket.png" class="rocket">
    <a class="container-fluid text-decoration-none" href="https://apps.apple.com/gb/app/orbitz/id1630650820"
       target="_blank"
    >
      <div class="navbar-brand py-0">
        Sponsored by Orbitz</div>
      <div class="ms-auto me-0 py-0 navbar-brand" href="https://apps.apple.com/gb/app/orbitz/id1630650820">
        Download
        <span class="d-none d-sm-inline">
          from the App Store
        </span>
        for free!
      </div>
    </a>
  </nav>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');

.sponsor-banner {
  font-family: 'Staatliches', sans-serif;
  background-image: url("../assets/starfield.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.sponsor-banner .container-fluid {
  z-index: 10;
}

.rocket {
  height: 32px;
  position: absolute;
  left: -64px;
  animation: zoom2 15s ease-in-out infinite;
  z-index: 11;
}

@keyframes zoom {
  60% {
    left: -64px;
  }

  100% {
    left: 110%;
  }
}

@keyframes zoom2 {
  0% {
  }

  28% {
    height: 32px;
    z-index: 11;
    left: -64px;
    transform: scale(1);
  }

  40% {
    transform: scale(1);
    left: 110%;
    height: 32px;
    z-index: 11;
  }

  70% {
    transform: scale(-1);
    height: 20px;
    left: 110%;
    z-index: 9;
  }

  85% {
    transform: scale(-1);
    height: 20px;
    left: -64px;
    z-index: 9;
  }

  100% {
    transform: scale(1);
    height: 32px;
  }
}

</style>
