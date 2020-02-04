<script>
		import Button from '~/components/button'
		import Scanner from '~/components/scanner'

		let displayScanner = false
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
</style>

<main>
		{#if displayScanner}
				<Scanner />
		{/if}
		<Button
				onClick={() => {
						displayScanner=true
				}}
				label="Scan QR"
		/>
</main>
