<script>
    export let label;
    export let onClick;
</script>

<style>
    button {
        display: block;
        width: 500px;
        height: 100px;
        font-size: 25px;
        font-weight: 700;
        border-radius: 60px;
    }
</style>

<button on:click="{onClick}">{label}</button>
