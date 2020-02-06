<script>
		import Button from '~/components/button'
		import Scanner from '~/components/scanner'
		import io from 'socket.io-client';
		import { urlPortRegex} from '../libs/utils';

		let displayScanner = false
</script>

<style>
		main {
				display: flex;
				flex: 1;
				width: 100%;
        height: 100vh;
				justify-content: center;
				align-items: center;
		}
</style>

<main>
		{#if displayScanner}
				<Scanner
						onQrScan={((data) => {
								if (data.match(urlPortRegex)){
										socket.connect(data);
								}
						})}
				/>
				{:else}
				<Button
						onClick={() => {
								displayScanner=true
						}}
						label="Scan QR"
				/>
		{/if}

</main>
