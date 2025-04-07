<template>
  <div style="display: grid; place-items: center; height: 100vh">
    <div>
      <img
        src="/favicon.svg"
        alt="Banger Logo"
        style="
          width: 80px;
          height: 80px;
          animation: pulse 1.5s infinite ease-in-out;
          display: block;
          margin-inline: auto;
        "
      />
      <p style="margin-top: 20px; color: #999; font-size: 18px">
        Carregando...
      </p>
    </div>
  </div>
</template>
<style>
@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}
</style>
