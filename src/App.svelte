<script>
  /* By Connor Rothschild https://twitter.com/CL_Rothschild
	Scrollytelling component from Russell Goldenberg https://twitter.com/codenberg/status/1432774653139984387 */

  import Scrolly from "./components/Scrolly.svelte";
  import Scatterplot from "./components/Scatterplot.svelte";
  import Filter from "./components/Filter.svelte";
  import Square from "./components/Square.svelte";
  import Waffle from "./components/Waffle.svelte";
  import Country from "./components/Country.svelte";

  let currentStep;

  const steps = [
    "<h4>This is 60 minutes.</h4>",
    "<h4>For every 60 minutes of leisure time men have,</h4>",
    "<h4>women have 10 minutes less.</h4>",
    "<h4>For every 60 minutes of unpaid care work men do,</h4>",
    "<h4>women do 60 minutes more.</h4>",
    "<h4>This is 52 weeks or a year. Let's see how these time gaps add up over time.</h4>",
  ];
</script>

<svelte:head>
  <style>
    @import url("https://fonts.googleapis.com/css?family=Mansalva&display=swap");
  </style>
</svelte:head>

<section>
  <Filter />
  <div class="hero">
    <h1>
      According to time use data published by OECD Gender Data in 2020, across
      all 33 countries surveyed, women spend less leisure time than men.
    </h1>
    <h2>
      By <a href="https://twitter.com/CL_Rothschild" target="_blank">Connor</a>
    </h2>
  </div>
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value={currentStep}>
        {#each steps as text, i}
          <div class="step" class:active={currentStep === i}>
            <div class="step-content">{@html text}</div>
          </div>
        {/each}
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class="sticky">
      <Square step={currentStep} />
      <!-- <Scatterplot step={value} /> -->
    </div>
  </div>
  <div class="spacer" />
  <Waffle />
  <div class="spacer" />
  <Country />
</section>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .hero {
    height: 60vh;
    display: flex;
    place-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .hero h2 {
    margin-top: 0;
    font-weight: 200;
  }

  .spacer {
    height: 20vh;
  }

  .sticky {
    position: sticky;
    top: 10%;
    flex: 1 1 60%;
    width: 60%;
  }

  .section-container {
    /* background: red; */
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    font-size: 1rem;
    justify-content: center;
    /* background: whitesmoke; */
    /* color: #ccc;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* transition: background 500ms ease; */
    /* box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2); */
    text-align: center;
    width: 100%;
    margin: auto;
    max-width: 500px;
  }

  .step.active .step-content {
    /* background: white; */
    color: black;
  }

  .steps-container,
  .sticky {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }

  /* Comment out the following line to always make it 'text-on-top' */

  .section-container {
    flex-direction: column-reverse;
  }
  .sticky {
    width: 95%;
    margin: auto;
  }

  /* @media screen and (max-width: 768px) {
    .section-container {
      flex-direction: column-reverse;
    }
    .sticky {
      width: 95%;
      margin: auto;
    }
  } */
</style>
