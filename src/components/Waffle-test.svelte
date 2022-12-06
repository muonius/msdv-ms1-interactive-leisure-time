<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import Slider from "@bulatdashiev/svelte-slider";
  import { annotate } from "https://unpkg.com/rough-notation?module";
  import { svg } from "d3";

  let data;

  let value = [18, 100];

  let comparison = {
    Men: { Leisure: 13, "Unpaid care work": 10, "Paid work or study": 4 },
    Women: { Leisure: 12, "Unpaid care work": 10, "Paid work or study": 4 },
  };

  let diff = {
    Leisure: 0,
    "Unpaid care work": 0,
    "Paid work or study": 0,
  };

  let waffle;
  let leisureDiff, unpaidDiff, paidDiff;

  //Section 2: Create Waffle Chart
  let columns = 52,
    rows = 48,
    squareSize = 8,
    squareValue = 1,
    gap = 2,
    total = rows * columns,
    category = [
      "Leisure",
      "Unpaid care work",
      "Paid work or study",
      "Personal care",
      "Other",
    ],
    width = squareSize * columns + columns * gap + 25,
    height = squareSize * rows + rows * gap + 25;

  let waffleData = [],
    // let newData,
    uniqueAge,
    colorWaffleScale,
    yWaffleScale;

  function drawWaffle(data, data2, age) {
    let newData = data2.filter((d) => d.age <= age);
    waffle = d3
      .select("#waffle")
      .append("svg")
      .attr("id", data[0].toLowerCase())

      .attr("width", width)
      .attr("height", height);

    waffle
      .append("g")
      .selectAll("rect")
      .data(newData)
      .join("rect")
      .attr("class", "watercolor")
      .attr("opacity", 0.8)
      .attr("filter", "url(#watercolor-3)")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", (d) => colorWaffleScale(d.category))
      .attr("x", function (d, i) {
        //group n squares for column
        let colIndex = Math.floor(i % columns);
        return colIndex * squareSize + colIndex * gap;
      })
      .attr("y", (d) => yWaffleScale(d.age));
  }

  function prepareData(data) {
    //Preparere data
    const sumstat = d3.groups(data[1], (d) => d.age);
    sumstat.forEach((age) => {
      age[1].forEach(function (d, i) {
        d.week = +d.week;
        d.units = Math.floor(d.week / squareValue);
        waffleData = waffleData.concat(
          Array(d.units + 1)
            .join(1)
            .split("")
            .map(function () {
              return {
                gender: data[0],
                age: +age[0],
                squareValue: squareValue,
                units: d.units,
                category: d.category,
              };
            })
        );
      });
    });

    // console.log(waffleData)
    uniqueAge = waffleData
      .map((d) => d.age)
      .reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      }, []);
  }

  function initializeLayout() {
    //initalize Layout
    yWaffleScale = d3
      .scaleBand()
      .range([0, height])
      .domain(uniqueAge)
      .padding(0.1);

    colorWaffleScale = d3
      .scaleOrdinal()
      .domain(category)
      .range(["#AFBAFC", "#FBBE85", "#92C5E1", "#F47F33", "#FEF793"]);
  }

  function calculator(data, sliderValue, comparison) {
    const gender = Object.keys(comparison);
    gender.forEach((g) => {
      let para = Object.keys(comparison[g]);
      para.forEach((p) => {
        comparison[g][p] = data
          .filter(
            (d) => d.gender == g && d.age <= sliderValue && d.category == p
          )
          .reduce((acc, curr) => {
            acc += Number(curr.week);
            return acc;
          }, 0);

        diff[p] = Math.abs(comparison["Men"][p] - comparison["Women"][p]);
      });
    });

    let summary = document.querySelector("#summary");
    summary.innerHTML = `<p>By age of <span>${sliderValue}</span>,women have ${diff["Leisure"]} weeks less leisure time and ${diff["Unpaid care work"]} weeks more unpaid care time than men. They also have ${diff["Paid work or study"]} weeks less paid work or study.</p>`;
  }

  function clearLayout() {
    d3.selectAll("#waffle").html("");
  }
  onMount(async () => {
    var slider = document.getElementById("slider");
    var output = document.getElementById("title");
    output.innerHTML = `<h4>Slide to Compare Time Spent at The Age of <span class="highlight">${slider.value}</span></h4>`; // Display the default slider value
    let summary = document.querySelector("#summary");
    summary.innerHTML = `<p>On average, at the age of <span>18</span>, women have 1 weeks less leisure time than men.`;

    data = await d3.csv(
      "https://raw.githubusercontent.com/muonius/msdv-major-studio-1/18a455a8578d79f5f265193eca5e591df8c0caf8/03_interactive_project/data/age.csv"
    );
    const dataGender = d3.groups(data, (d) => d.gender);
    // Initial setup
    dataGender.forEach((data) => {
      prepareData(data);
      console.log(waffleData);
      initializeLayout();
      drawWaffle(data, waffleData, 18);
    });
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
      const waffleGender = d3.groups(waffleData, (d) => d.gender);
      waffleGender.forEach((d) => {
        drawWaffle(d, d[1], this.value);
      });

      if (this.value > 18) {
        calculator(data, this.value, comparison);
      } else {
        summary.innerHTML = `<p>On average, at the age of <span>18</span>, women have 1 weeks less leisure time than men.</p>`;
      }
    };
    const n1 = document.querySelector(".highlight");
    const a2 = annotate(n1, { type: "underline", color: "red" });
  });
</script>

<!-- <Filter /> -->
<div class="waffle">
  <div class="title">
    <h4>
      Slide to Compare Time Spent at The Age of <span class="highlight"
        >{value}</span
      >
    </h4>
    <Slider min="18" max="65" step="1" bind:value />
  </div>
  <div class="slidecontainer">
    <span>18</span><input
      type="range"
      min="18"
      max="65"
      value="18"
      class="slider"
      id="slider"
      on:input={() => {
        clearLayout();
        initializeLayout();
      }}
    /><span>65</span>
  </div>
  <div id="summary" />
  <div class="test">
    <svg>
      <g>
        {#each waffleData as waffle, index (index)}
          <rect
            x="50"
            y={yWaffleScale(waffle.age)}
            width={squareSize}
            height={squareSize}
            fill="black"
          />
        {/each}
      </g>
    </svg>
  </div>
</div>

<style>
  #title {
    padding-top: 1rem;
  }
  .waffle {
    background: whitesmoke;
    height: 80vh;
    max-width: 100%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    top: 10%;
    margin: auto;
  }

  .slider {
    -webkit-appearance: none;
    width: 40%;
    height: 4px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider:hover {
    opacity: 1;
  }

  /* .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #04aa6d;
    cursor: pointer;
  } */

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #04aa6d;
    cursor: pointer;
  }
</style>
