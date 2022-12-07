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

  let colorWaffleScale = d3
    .scaleOrdinal()
    .domain(category)
    .range(["#AFBAFC", "#FBBE85", "#92C5E1", "#F47F33", "#FEF793"]);

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
    // console.log(stackedData);
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
      .attr("fill", (d) => colorStackScale(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => d)
      .join("rect")
      // .attr("opacity", "0.8")
      .attr("filter", "url(#watercolor-2)")
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
      function check(data) {
        return typeof data === "number" ? `${data * 100}%` : data;
      }
      let html = "";
      for (const key in datum.data) {
        html += `<table><tr><td><strong>${key}:</strong></td><td>${check(
          datum.data[key]
        )}</td></tr></table>`;
      }

      tooltip.html(html).style("color", "black");

      // console.log(event.pageX);
      tooltip.style("top", `${event.clientY - 5}px`);
      tooltip.style("left", event.clientX + "px");

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
      .range(["#FEF793", "#F47F33", "#92C5E1", "#FBBE85", "#AFBAFC"]);

    xStackScale = d3
      .scaleBand()
      .domain(["Men", "Women"])
      .range([0, width2])
      .padding([0.05]);

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

<div class="country">
  <div>
    <h4>
      This is how men and women spend their time differently around the world.
    </h4>
  </div>

  <div class="legend">
    <svg viewBox="0 0 900 40" transform="translate(400,0)">
      {#each category as c, index (index)}
        <rect
          y={0}
          x={20 * index + 70 * index}
          width={8}
          height={8}
          fill={colorWaffleScale(c)}
        />
        <text
          y={8}
          x={12 + 20 * index + 70 * index}
          font-size="0.6rem"
          dominant-baseline="text-top"
          text-anchor="top">{category3[index]}</text
        >
      {/each}
    </svg>
  </div>

  <div id="stack" />
  <div id="tooltip">
    <div id="tooltip-country" />
    <div id="tooltip-category" />
    <div id="tooltip-ratio" />
  </div>
</div>

<style>
  .country {
    position: relative;
    padding-top: 1rem;
    background: whitesmoke;
    /* height: 90vh; */
    max-width: 100%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    top: 10%;
    margin: auto;
  }

  #tooltip {
    opacity: 0;
    position: absolute;
    top: 10px;
    /* right: 50px;  */
    width: 15em;
    padding: 0.5em 0.5em;
    /* justify-content: space-between; */
    background: #fff;
    text-align: center;
    line-height: 1.4em;
    font-size: 0.8em;
    border: 1px solid #ddd;
    z-index: 100;
    pointer-events: none;
    /* background:red */
  }
</style>
