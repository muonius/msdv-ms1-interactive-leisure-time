<script>
  export let step;
  import { fade } from "svelte/transition";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let width;
  let height;
  $: square = width / 10;
  $: gap = square / 10;
  $: womenWidth = (width * 0.9) / 10;
  $: womenHeight = width / 10;

  import { tweened } from "svelte/motion";

  $: tweenedX = tweened(width / 2 - square / 2, {
    duration: 1000,
    easing: cubicOut,
  });

  $: tweenedY = tweened(height + square, {
    duration: 1000,
    easing: cubicOut,
  });

  $: tweenedX2 = tweened((width * 5) / 6 - square / 2, {
    duration: 1000,
    easing: cubicOut,
  });

  $: tweenedY2 = tweened(height + square, {
    duration: 1000,
    easing: cubicOut,
  });

  $: tweenedX3 = tweened(width + square, {
    duration: 1000,
    easing: cubicOut,
  });

  $: tweenedY3 = tweened(height / 2 - square / 2, {
    duration: 1000,
    easing: cubicOut,
  });

  const menUp = function () {
    tweenedY.set(height / 2 - square / 2);
  };

  const menSide = function () {
    tweenedX.set(width / 6 - square / 2);
  };

  const womenUp = function () {
    tweenedY2.set(height / 2 - square / 2);
  };

  const womenSide = function () {
    tweenedX2.set((width * 4.8) / 6 - square / 2);
  };
  const leisureOverlap = function () {
    tweenedX.set(width / 2 - square / 2);
    tweenedX2.set(width / 2 - square / 2);
  };

  const womenSecond = function () {
    tweenedX3.set((width * 4.8) / 6 - square / 2 + square + gap);
    tweenedY3.set(height / 2 - square / 2);
    womenWidth = width / 10;
  };

  const unpaidOverlap = function () {
    tweenedX.set(width / 2 - square / 2);
    tweenedX2.set(width / 2 - square / 2);
    tweenedX3.set(width / 2 - square / 2 + square + gap);
  };

  const moveTo52 = function () {
    tweenedY.set(0 - square * 2);
    tweenedY2.set(0 - square * 2);
    tweenedY3.set(0 - square * 2);
    // const squares = document.querySelectorAll(".fivetwo");
    // squares.setAttribute("class", "show");
  };

  $: {
    if (step == 0) {
      menUp();
      // console.log(Array(53).join(1).split(""));
    }
    if (step == 1) {
      menSide();
      womenUp();
      // tweenedX.set(4.5);
    }
    if (step == 2) {
      leisureOverlap();
    }

    if (step == 3) {
      menSide();
      womenSide();
      womenSecond();
    }

    if (step == 4) {
      unpaidOverlap();
    }

    if (step == 5) {
      moveTo52();
    }
  }

  //   import * as d3 from "d3";
  import { scaleBand } from "d3-scale";
  import { extent, min, max } from "d3-array";

  const margin = { top: 30, bottom: 30, left: 30, right: 30 };

  let domains = [];
  for (let i = 0; i < 52; i++) {
    domains.push(i);
  }

  $: xScale = scaleBand()
    .domain(domains)
    .range([margin.left, width - margin.right])
    .padding(0.1);
</script>

<section>
  <div class="filter">
    <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
      <svg width={width + margin.right + margin.left} {height}>
        <rect class="test" x="0" y="0" {width} {height} rx="15" />
        <!-- <text class=active==false x={xScale($tweenedX)} y={yScale($tweenedY) - 20}>Men</text> -->
        {#if step == 1}
          <text x={$tweenedX + square / 3} y={$tweenedY - gap}>Men</text>
          <text x={$tweenedX2 + square / 4} y={$tweenedY2 - gap}>Women</text>
        {/if}

        {#if step == 3}
          <text x={$tweenedX + square / 3} y={$tweenedY - gap}>Men</text>
          <text
            x={$tweenedX3 + square / 4}
            y={$tweenedY3 - gap}
            text-anchor="top">Women</text
          >
        {/if}
        <rect
          class="men"
          x={$tweenedX}
          y={$tweenedY}
          width={square}
          height={square}
          stroke={step == 0 ? "black" : step <= 2 ? "#AFBAFC" : "orange"}
          fill="transparent"
          stroke-width="5px"
        />

        <rect
          class="women"
          x={$tweenedX2}
          y={$tweenedY2}
          width={womenWidth}
          height={womenHeight}
          fill={step <= 2 ? "#AFBAFC" : "orange"}
          stroke-width="20px"
        />

        <rect
          class="women"
          opacity={step >= 3 ? 1 : 0}
          x={$tweenedX3}
          y={$tweenedY3}
          width={womenWidth}
          height={womenHeight}
          fill="orange"
          stroke-width="20px"
        />
        {#if step == 5}
          {#each domains as domain, index (index)}
            <rect
              class={step == 5 ? "show" : ""}
              filter="url(#watercolor-2)"
              x={xScale(domain)}
              y={height / 2 - square / 12}
              width={square / 8}
              height={square / 8}
              stroke="black"
              fill="transparent"
              stroke-width="1.5px"
            />
          {/each}
        {/if}
      </svg>
    </div>
  </div>
</section>

<style>
  /* The fixed chart */
  /* svg {
    overflow: "auto";
  } */

  .test {
    filter: url(#paper);
    opacity: 0.5;
  }

  .chart {
    background: whitesmoke;
    height: 80vh;
    max-width: 100%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    position: sticky;
    top: 10%;
    margin: auto;
  }
  .show {
    opacity: 0.8;
  }

  #show {
    opacity: 0.8;
  }

  .men,
  .women {
    filter: url(#watercolor-2);
    opacity: 1;
  }

  /* in:fly={{ y: 200, duration: 3000 }}
out:fade */
</style>
