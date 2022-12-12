<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  let data;

  let category = [
    "Leisure",
    "Unpaid care work",
    "Paid work or study",
    "Personal care",
    "Other",
  ];

  let category3 = [
    "Leisure",
    "Unpaid care",
    "Paid work/study",
    "Personal",
    "Other",
  ];

  let colors = ["#AFBAFC", "#efcfe3", "#b392ac", "#adc178", "#bbd0ff"];
  let colorWaffleScale = d3.scaleOrdinal().domain(category).range(colors);

  let margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width2 = 180 - margin.left - margin.right,
    height2 = 180 - margin.top - margin.bottom,
    category2 = [
      "Other",
      "Personal care",
      "Paid work or study",
      "Unpaid care work",
      "Leisure",
    ];

  let xStackScale, yStackScale, colorStackScale, stackGenerator;

  function drawData(d) {
    const stackedData = stackGenerator(d[1]);
    console.log(stackedData[0]);
    const svg = d3
      .select("#stack")
      .append("svg")
      .attr("class", d[0])
      .attr("width", width2 + margin.left + margin.right)
      .attr("height", height2 + margin.top + margin.bottom)
      // .attr("viewBox", "0 0 160 160")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // .attr("transform", `translate(10) rotate(45)`)
    const stacks = svg
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join("g")
      .attr("fill", "none")
      .attr("fill", (d) => colorStackScale(d.key))
      .attr("stroke", (d) => colorStackScale(d.key))
      .attr("stroke-width", "4px")
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d, i) => d)
      .join("rect")
      // .attr("opacity", "0.8")
      .attr("filter", "url(#watercolor-2)")
      .style("fill", (d) => {
        if (d.data.Gender == "Men") {
          return "none";
        }
      })
      .style("stroke-width", (d) => {
        if (d.data.Gender == "Women") {
          return "2px";
        }
      })
      .attr("x", (d) => xStackScale(d.data.Gender))
      .attr("y", (d) => yStackScale(d[1]))
      .attr("height", (d) => yStackScale(d[0]) - yStackScale(d[1]))
      .attr("width", xStackScale.bandwidth());

    const labels = svg
      .append("text")
      .text(d[0])
      .attr("x", 20)
      .attr("y", height2)
      .attr("dy", 15);

    stacks.on("mouseover", onMouseEnter).on("mouseleave", onMouseLeave);

    const tooltip = d3.select("#tooltip");

    function onMouseEnter(event, datum) {
      function checkData(data) {
        return isNaN(data) ? data : `${parseInt(data * 100)}%`;
      }
      let html = "";
      for (const key in datum.data) {
        html += `<table><tr><td><strong>${key}:</strong></td><td>${checkData(
          datum.data[key]
        )}</td></tr></table>`;
      }

      tooltip.html(html).style("color", "black");

      const x = event.pageX;
      const y = event.pageY;

      tooltip.style("top", `${event.clientY + 100}px`);
      tooltip.style("left", `${event.clientX - 100}px`);

      // tooltip.style(
      //   "transform",

      //   `translate(` + `calc(-5% + ${x}px),` + `calc(5% + ${y}px)` + `)`
      // );

      tooltip.style("opacity", 1);
    }

    function onMouseLeave(event) {
      d3.select(this);
      tooltip.style("opacity", 0);
      tooltip.html("");
    }
  }

  function initializeLayout() {
    colorStackScale = d3
      .scaleOrdinal()
      .domain(category2)
      .range(colors.reverse());

    xStackScale = d3
      .scaleBand()
      .domain(["Men", "Women"])
      .range([0, width2])
      .padding([0.01]);

    yStackScale = d3.scaleLinear().domain([0, 1]).range([height2, 0]);
  }

  onMount(async () => {
    data = await d3.csv(
      "https://raw.githubusercontent.com/muonius/msdv-major-studio-1/master/03_interactive_project/data/country.csv"
    );
    // console.log(data);
    const sumstat = d3.groups(data, (d) => d.Country);
    stackGenerator = d3.stack().keys(category2);
    initializeLayout();
    sumstat.forEach((d) => {
      drawData(d);
    });
  });
</script>

<div class="container">
  <div class="overlay">
    <!-- <svg width="100%" height="165vh" class="test" /> -->
  </div>
  <div class="country">
    <div>
      <h4>
        This is how men and women spend their time differently around the world.
      </h4>
    </div>

    <div class="legend">
      <svg viewBox="0 0 900 20">
        {#each category as c, index (index)}
          <rect
            y={0}
            x={180 + 120 * index}
            width={10}
            height={10}
            fill={colorWaffleScale(c)}
          />
          <text
            y={8}
            x={200 + 120 * index}
            font-size="0.7rem"
            dominant-baseline="text-top"
            text-anchor="top">{category3[index]}</text
          >
        {/each}
      </svg>
    </div>

    <div id="stack" />
    <div id="tooltip" />
  </div>
</div>

<style>
  .overlay {
    filter: url(#paper);
    overflow: hidden;
    opacity: 0.5;
    height: 190vh;
    margin: auto;
  }

  .container {
    overflow: auto;
    position: relative;
    display: block;
    /* flex-direction: column;
    justify-content: space-between; */
    height: 140vh;
    max-width: 95%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    /* top: 10%; */
    margin: auto;
    height: 180vh;
    /* padding-bottom: 2rem; */
    /* z-index: 10000; */
  }

  .country {
    position: absolute;
    padding-top: 1rem;
    /* background: whitesmoke; */
    /* height: 90vh; */
    max-width: 95%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  #tooltip {
    opacity: 0;
    position: absolute;
    top: 10px;
    /* right: 50px;  */
    width: 14em;
    padding: 0.5em 0.5em;
    /* justify-content: space-between; */
    background: #fff;
    text-align: center;
    line-height: 1.4em;
    font-size: 0.8em;
    border: 1px solid #ddd;
    z-index: 100;
    pointer-events: none;

    font-size: 0.9em;
  }
</style>
