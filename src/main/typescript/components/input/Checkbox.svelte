<script lang="ts">
    import {valueOrDefault} from "../../util/data"

    export let
        config: CheckboxConfig = {},
        value: boolean = false

</script>

<label class={config.switch ? "switch" : "checkbox"}>
    <input type="checkbox" bind:checked={value}>
    {valueOrDefault(config.title, "")}
    {#if config.switch}
        <span class="slider"></span>
    {/if}
</label>