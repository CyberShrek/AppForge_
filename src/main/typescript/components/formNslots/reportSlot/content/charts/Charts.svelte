<script lang="ts">
    import Chart from "./Chart.svelte"
    import {ReportWizard} from "../../ReportWizard"
    import {slide} from "svelte/transition"

    export let
        modelWizard: ReportWizard,
        configs: ChartValue[],
        rootElement: HTMLDivElement,
        show = false

</script>

{#if show}
    <div class="charts"
         transition:slide
         bind:this={rootElement}>

        {#each configs as chart}
            <Chart data={modelWizard.properData}
                   config={chart}/>
        {/each}
    </div>
{/if}