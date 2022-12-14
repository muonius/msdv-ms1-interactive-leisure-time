<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { annotate } from "https://unpkg.com/rough-notation?module";

  let data;
  let slider;
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
    squareSize = 7,
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
    category2 = [
      "Leisure",
      "Unpaid care",
      "Paid work/study",
      "Personal",
      "Other",
    ],
    colors = ["#AFBAFC", "#efcfe3", "#b392ac", "#adc178", "#bbd0ff"],
    // colors = ["#4a4e69", "#FBBE85", "#386641", "#e07a5f", "#adc178"],
    margin = 40,
    width = squareSize * columns + columns * gap + margin,
    height = squareSize * rows + rows * gap;

  let waffleData = [],
    // let newData,
    uniqueAge,
    colorWaffleScale,
    yWaffleScale;

  colorWaffleScale = d3.scaleOrdinal().domain(category).range(colors);

  function drawWaffle(data, data2, age) {
    let newData = data2.filter((d) => d.age <= age);
    waffle = d3
      .select("#waffle")
      .append("svg")
      .attr("id", data[0].toLowerCase())

      .attr("width", width)
      .attr("height", height + margin);

    waffle
      .append("g")
      .selectAll("rect")
      .data(newData)
      .join("rect")
      .attr("class", "watercolor")
      // .attr("opacity", 0.8)
      .attr("filter", "url(#watercolor-3)")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", (d) => colorWaffleScale(d.category))
      // .attr("stroke", (d) => colorWaffleScale(d.category))
      // .attr("stroke-width", data[0] == "Men" ? "1.5px" : "0.5px")
      // .style("fill", (d) => {
      //   if (data[0] == "Men") {
      //     return "none";
      //   }
      // })
      .attr("x", function (d, i) {
        //group n squares for column
        let colIndex = Math.floor(i % columns);
        return colIndex * squareSize + colIndex * gap;
      })
      .attr("y", (d) => yWaffleScale(d.age) + 25);

    waffle.append("g").append("text").text(data[0]).attr("x", 0).attr("y", 10);
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
    summary.innerHTML = `<p>By age of <span><strong>${sliderValue}</strong></span>, women have <span class="leisure" style="padding-left: 5px; padding-right:5px;background:#AFBAFC; font-size:1.2rem"><strong>${diff["Leisure"]}</strong></span> weeks less leisure time and <span class="unpaid" style="padding-left: 5px; padding-right:5px; background:#dbcbd8;font-size:1.2rem" ><strong>${diff["Unpaid care work"]}</strong> </span> weeks more unpaid care time than men. They also have <span class="paid" style="padding-left: 5px; padding-right:5px; background:#b392ac; font-size:1.2rem"><strong>${diff["Paid work or study"]}</strong></span> weeks less paid work or study.</p>`;
  }

  function clearLayout() {
    d3.selectAll("#waffle").html("");
  }
  onMount(async () => {
    slider = document.getElementById("slider");
    var output = document.getElementById("title");
    output.innerHTML = `<h4>Slide to Compare Time Spent at The Age of <span class="highlight"  style="text-decoration:underline; color:cornflowerblue">${slider.value}</span></h4>`; // Display the default slider value
    let summary = document.querySelector("#summary");
    summary.innerHTML = `<p>On average, at the age of <span><strong>18</strong></span>, women have <span class="leisure" style="padding-left: 5px; padding-right:5px;background:#AFBAFC; font-size:1.2rem"><strong>1</strong></span> weeks less leisure time than men.</p>`;

    data = await d3.csv(
      "https://raw.githubusercontent.com/muonius/msdv-major-studio-1/18a455a8578d79f5f265193eca5e591df8c0caf8/03_interactive_project/data/age.csv"
    );
    const dataGender = d3.groups(data, (d) => d.gender);
    // Initial setup
    dataGender.forEach((data) => {
      prepareData(data);
      initializeLayout();
      drawWaffle(data, waffleData, 18);
    });
    // Update the current slider value (each time you drag the slider handle)

    slider.oninput = function () {
      clearLayout();
      const waffleGender = d3.groups(waffleData, (d) => d.gender);
      waffleGender.forEach((d) => {
        initializeLayout();
        drawWaffle(d, d[1], this.value);
      });
      output.innerHTML = `<h4>Slide to Compare Time Spent at The Age of <span class="highlight" style="text-decoration:underline; color:cornflowerblue" >${slider.value}</span></h4>`;
      if (this.value > 18) {
        calculator(data, this.value, comparison);
      } else {
        summary.innerHTML = `<p>On average, at the age of <span><strong>18</strong></span>, women have <span class="leisure" style="padding-left: 5px; padding-right:5px;background:#AFBAFC; font-size:1.2rem"><strong>1</strong></span> weeks less leisure time than men.</p>`;
      }
    };
  });
</script>

<!-- <Filter /> -->
<div class="container">
  <div class="overlay">
    <!-- <svg class="test" /> -->
  </div>
  <div class="waffle">
    <div id="title" />
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
            text-anchor="top">{category2[index]}</text
          >
        {/each}
      </svg>
    </div>
    <div class="slidecontainer">
      <span>Age 18 </span><input
        type="range"
        min="18"
        max="65"
        value="18"
        class="slider"
        id="slider"
      /><span class="age"
        ><p class="age" style="text-align: right">Age 65</p>
      </span>
    </div>
    <div id="summary" />
    <div id="waffle" />
    <div style="clear:both;"><!--clear--></div>
  </div>
</div>

<style>
  span.age {
    position: relative;
  }
  p.age {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 60px;
    padding-left: 2px;
    text-align: right;
  }
  .overlay {
    filter: url(#paper);
    overflow: hidden;
    opacity: 0.5;
    width: 100%;
    height: 100vh;
    /* padding-bottom: calc(100%); */
  }

  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 90vh;
    max-width: 95%;
    /* box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2); */
    border-radius: 10px;
    top: 10%;
    margin: auto;
    /* padding-bottom: 2rem; */
    z-index: 10000;
    /* overflow: scroll; */
  }

  .waffle {
    position: absolute;
    /* padding-top: 0.5rem; */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 100vh;
    width: 100%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  #summary {
    width: 60%;
    margin: auto;
    /* padding-left: 4rem;
    padding-right: 4rem; */
  }

  /* #waffle {
    padding-left: 2rem;
  } */
  /* .overlay {
    min-height: 100vh;
    /* position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0; */
  /* height: 100%;
    width: 100%;
    opacity: 0.2;
    z-index: 1; */
  /* } */

  .slider {
    -webkit-appearance: none;
    width: 30%;
    height: 4px;
    background: #d3d3d3;
    outline: none;
    /* opacity: 0.7; */
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    filter: url("#watercolor-3");
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

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    /* appearance: none; */
    width: 20px;
    height: 20px;
    background: cornflowerblue;
    border-radius: 20px;
    cursor: pointer;
  }
  .highlight {
    text-decoration: underline;
  }
</style>
