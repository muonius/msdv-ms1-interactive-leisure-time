<script>
  export let step;
  import { fade } from "svelte/transition";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let data = [
    { foo: 1, bar: 1 },
    { foo: 6, bar: 7 },
    { foo: 2, bar: 4 },
  ];

  $: womenWidth = 90;
  $: womenHeight = 100;

  import { tweened } from "svelte/motion";
  const tweenedY = tweened(0, {
    duration: 1000,
    easing: cubicOut,
  });

  const tweenedY2 = tweened(0, {
    duration: 1000,
    easing: cubicOut,
  });

  const tweenedX = tweened(4.5, {
    duration: 1000,
    easing: cubicOut,
  });

  const tweenedX2 = tweened(8, {
    duration: 1000,
    easing: cubicOut,
  });

  const tweenedX3 = tweened(11, {
    duration: 1000,
    easing: cubicOut,
  });

  const menUp = function () {
    tweenedY.set(6);
  };

  const menSide = function () {
    tweenedX.set(1);
  };

  const womenUp = function () {
    tweenedY2.set(6);
  };

  const womenSide = function () {
    tweenedX2.set(8);
  };
  const leisureOverlap = function () {
    tweenedX.set(4);
    tweenedX2.set(4);
  };

  const womenSecond = function () {
    tweenedX3.set(9);
    womenWidth = 100;
  };

  const unpaidOverlap = function () {
    tweenedX.set(4);
    tweenedX2.set(4);
    tweenedX3.set(5);
  };

  const moveTo52 = function () {
    tweenedY.set(0);
    tweenedY2.set(0);
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
  import { scaleLinear } from "d3-scale";
  import { extent, min, max } from "d3-array";

  let width = 400;
  let height = 400;
  let square = 100;
  const margin = { top: 30, bottom: 30, left: 30, right: 30 };

  $: xScale = scaleLinear().domain([0, 10]).range([0, width]);

  $: yScale = scaleLinear().domain([0, 10]).range([height, 0]);
</script>

<section>
  <div class="filter" />
  <div class="chart" bind:offsetWidth={width} bind:offsetHeight={height}>
    <svg width={width + margin.right + margin.left} {height}>
      <!-- <text class=active==false x={xScale($tweenedX)} y={yScale($tweenedY) - 20}>Men</text> -->
      <rect
        class="men"
        x={xScale($tweenedX)}
        y={yScale($tweenedY)}
        width={100}
        height={100}
        stroke={step == 0 ? "black" : step <= 2 ? "#AFBAFC" : "orange"}
        fill="transparent"
        stroke-width="5px"
      />

      <rect
        class="women"
        x={xScale($tweenedX2)}
        y={yScale($tweenedY2)}
        width={womenWidth}
        height={womenHeight}
        fill={step <= 2 ? "#AFBAFC" : "orange"}
        stroke-width="20px"
      />

      <rect
        class="women"
        x={xScale($tweenedX3)}
        y={yScale($tweenedY2)}
        width={womenWidth}
        height={womenHeight}
        fill={step <= 2 ? "#AFBAFC" : "orange"}
        stroke-width="20px"
      />
      {#if step == 5}
        {#each Array(52) as _, index (index)}
          <rect
            in:fly={{ y: 200 }}
            out:fade
            class={step == 5 ? "show" : ""}
            opacity="0"
            filter="url(#watercolor-1)"
            x={9 * index + 5 * index}
            y={height / 2}
            width="9"
            height="9"
            stroke="black"
            fill="transparent"
            stroke-width="1.5px"
          />
        {/each}
      {/if}
    </svg>
  </div>
</section>

<style>
  /* The fixed chart */
  .chart {
    background: whitesmoke;
    height: 80vh;
    max-width: 100%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 10%;
    margin: auto;
  }

  .show {
    opacity: 1;
  }

  .men,
  .women {
    filter: url(#watercolor-2);
    opacity: 1;
  }
</style>
