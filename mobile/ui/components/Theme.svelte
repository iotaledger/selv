<script>
  let container;
</script>

<style>
  :global(body > main) {
    --max-width: 425px;
    --max-height: 680px;
    --bg: #eef1f3;
    --fg: #485776;
  }

  :global(*, *:after, *:before) {
    margin: 0;
    padding: 0;
    border: 0;
    font-weight: 400;
    box-sizing: border-box;
    outline: none;
  }

  :global(html, body) {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #e5e5e5;
    font-weight: 400;

    background-size: cover;
    transition: background 0.25s;
  }

  :global(body) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media only screen and (max-height: 600px) {
    :global(input, textarea) {
      margin-bottom: 16px;
      height: 44px;
    }
  }

  @media only screen and (max-height: 600px) {
    :global(::placeholder) {
      line-height: 26px;
    }
  }

  :global(label) {
    display: block;
    font-weight: 600;
    margin-bottom: 7px;
  }

  :global(label span) {
    font-weight: 600;
  }

  :global(svg) {
    overflow: visible;
  }

  :global(body > main) {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    max-width: var(--max-width);
    max-height: var(--max-height);
    background: var(--bg);
    color: var(--fg);
    user-select: none;
    font-size: 13px;
    line-height: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0px 20px 30px 5px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 520px) {
    :global(html, body) {
      background: transparent;
    }
    main {
      max-width: 100%;
      max-height: 100%;
      background: none;
    }
  }

  @media only screen and (max-height: 680px) {
    :global(body) {
      display: block;
    }
  }
</style>

<main bind:this={container}>
  <slot />
</main>
