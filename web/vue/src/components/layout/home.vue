<template lang='pug'>
  section.contain.grd-row
    .grd-row-col-3-6(v-html='left')
    .grd-row-col-3-6.txt--center
      img(src='static/gekko.jpg')
      p
        em The most valuable thing now is data...
</template>

<script>
import marked from '../../tools/marked';

const left = marked(`

## LED cryptoBOT

LED cryptoBOT is a Bitcoin and altcoin trading bot and a backtesting platform that
connects to popular Bitcoin exchanges. It is written in javascript
and runs on nodejs.

*LED cryptoBOT does work when it's configured correctly.*

`);

export default {
  data: () => {
    return {
      left
    }
  }
}
</script>
