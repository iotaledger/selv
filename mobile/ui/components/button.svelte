<script>
    export let label
    export let onClick
</script>

<style>
    button {
          display: block;
          width: 100%;
          height: 54px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 30px;
      }
</style>

<button
    on:click={onClick}
>
    {label}
</button>
