<template lang='pug'>
  footer.p2.bg--off-white
    .contain
      p
        em Use LED CryptoBot at your own risk.
      p Using this LED Bot v{{ version.gekko }} and LED CryptoBot UI v{{ version.ui }}.
</template>

<script>
const gekkoPackage = require('../../../../../package.json');
const uiPackage = require('../../../package.json');

export default {
  data: () => {
    return {
      version: {
        gekko: gekkoPackage.version,
        ui: uiPackage.version
      }
    }
  }
}
</script>
