<script>
    import { Capacitor, Plugins } from '@capacitor/core'
    import { onMount } from 'svelte'

    import QrScanner from 'qr-scanner'
    QrScanner.WORKER_PATH = '/scanner.worker.min.js'

    export let onQrScan

    let video
    let scanner
    let camera

    const initiateScanner = async (init) => {
        if (typeof init === 'boolean') {
            try {
                const { CameraPreview } = Plugins
                camera = CameraPreview
                await camera.start({ position: 'rear' })
            } catch (err) {
                console.log(error)
            }
        }
        try {
            if (camera) {
                const capture = await camera.capture()
                const img = new Image()
                img.src = `data:image/jpeg;base64,${capture.value}`
                const data = await QrScanner.scanImage(img)
                if (data) {
                    onQrScan(data)
                    camera.stop()
                    camera = null
                } else {
                    requestAnimationFrame(initateScanner)
                }
            }
        } catch (err) {
            requestAnimationFrame(initateScanner)
        }
    }

    onMount(() => {
        initiateScanner(true)
        return () => {
            if (camera) {
                camera.stop()
                camera = null
            }
            if (scanner) {
                scanner.destroy()
                scanner = null
            }
        }

        return () => {
            if (camera) {
                camera.stop()
                camera = null
            }
            if (scanner) {
                scanner.destroy()
                scanner = null
            }
        }
    })

</script>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    scanner {
        flex: 1;
        position: relative;
        background: #000;
        overflow: hidden;
        opacity: 0;
    }
    scanner.enabled {
        opacity: 1;
    }
    .video-container {
        position: absolute;
        top: 0px;
        left: 50%;
        height: 100%;
        width: auto;
        transform: translate(-50%, 0);
    }
    video {
        display: block;
        height: 100%;
    }
</style>

<main>
    <scanner class:enabled={scanner}>
        <div class="video-container">
            <video bind:this={video} autoplay playsinline />
        </div>
    </scanner>
</main>
