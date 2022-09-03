<template>
  <nav class="navbar fixed-bottom navbar-dark bg-dark sponsor-banner">
    <img src="../assets/rocket.png" class="rocket">
    <a class="container-fluid text-decoration-none" href="https://apps.apple.com/gb/app/orbitz/id1630650820" target="_blank">
      <div class="navbar-brand">
        Sponsored by Orbitz</div>
      <div class="ml-auto navbar-brand" href="https://apps.apple.com/gb/app/orbitz/id1630650820">
        Download from the App Store for free!</div>
    </a>
  </nav>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');

.sponsor-banner {
  font-family: 'Staatliches', cursive;
  background-image: url("../assets/starfield.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.rocket {
  height: 32px;
  position: absolute;
  left: -10%;
  animation: zoom 6s ease-in-out infinite;
}

@keyframes zoom {
  60% {
    left: -10%;
  }

  100% {
    left: 110%;
  }
}
</style>