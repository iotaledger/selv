<script>
    import { Plugins } from '@capacitor/core'
    import QrScanner from 'qr-scanner'
    import { onMount } from 'svelte'
    QrScanner.WORKER_PATH = '/scanner.worker.min.js'

    let video
    let scanner
    let camera
    let cameraError = false

    const scan = async (init) => {
        if (typeof init === 'boolean') {
            try {
                const { CameraPreview } = Plugins
                camera = CameraPreview
                await camera.start({ position: 'rear' })
            } catch (err) {
                error.set(`Camera: ${err.message || err}`)
                cameraError = true
            }
        }
        try {
            if (camera) {
                const capture = await camera.capture()
                const img = new Image()
                img.src = `data:image/jpeg;base64,${capture.value}`
                const data = await QrScanner.scanImage(img)
                if (data) {
                    camera.stop()
                    camera = null
                } else {
                    requestAnimationFrame(scan)
                }
            }
        } catch (err) {
            requestAnimationFrame(scan)
        }
    }

    onMount(() => {
        scan(true)
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

<container>
    <scanner class:enabled={scanner}>
        <div class="video-container">
            <video bind:this={video} autoplay playsinline />
        </div>
    </scanner>
</container>
