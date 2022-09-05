<template>
  <nav class="navbar fixed-bottom navbar-dark bg-dark sponsor-banner">
    <img src="../assets/rocket.png" class="rocket">
    <a class="container-fluid text-decoration-none" href="https://apps.apple.com/gb/app/orbitz/id1630650820"
      target="_blank">
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

.rocket {
  height: 32px;
  position: absolute;
  left: -64px;
  animation: zoom 6s ease-in-out infinite;
}

@keyframes zoom {
  60% {
    left: -64px;
  }

  100% {
    left: 110%;
  }
}
</style>