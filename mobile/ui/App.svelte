<script>
    import { onDestroy } from 'svelte';

    import Route from '~/components/Route';
    import Theme from '~/components/Theme';

    import Setup from '~/views/Setup';
</script>

<Theme>
    <Route route="" primary>
        <Setup />
    </Route>
</Theme>
