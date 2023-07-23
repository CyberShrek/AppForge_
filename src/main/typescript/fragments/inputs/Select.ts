import {resolveCSS} from "../../utils/resolver"
import {InputFragment} from "../abstract/InputFragment"
import {createDivElement} from "../../utils/DOMWizard"
import {stringify} from "../../utils/misc"

resolveCSS("third-party/virtual-select")

// When multiselect turned on then value is OptionKey else value is Set<OptionKey>
export default class Select extends InputFragment<OptionKey|Set<OptionKey>>{

    constructor(location: FragmentLocation, config: SelectInputConfig) {
        super(location)
        this.core = createDivElement({class: "select"})
        this.value = new Set()
        applyVirtualSelect(this.core, config)
        this.core.addEventListener("change", event => {
            // @ts-ignore !!! Resolved by html import !!!
            const newValue: Set<OptionKey> = new Set(typeof event.currentTarget.value === "object" ? event.currentTarget.value : [event.currentTarget.value])
            // Need to check real changes to prevent doubling
            if(stringify(this.value) !== stringify(newValue))
                this.value = newValue
        })
    }

    protected optionsRetrievalCallbacks: Set<() => Promise<Options>> = new Set()

    setOptions(options: Options){
        const enabledOptionsCache: Set<OptionKey> = this.value
        if(!!options && options.size > 0) {
            const defaultOptions: Set<OptionKey> = new Set(options.get("default")?.split(","))
            options.delete("default")
            // @ts-ignore !!! Resolved by html import !!!
            this.core.setOptions(mapToVirtualSelectOptions(options))
            this.setSelected(enabledOptionsCache.size > 0 ? enabledOptionsCache : defaultOptions)
            // @ts-ignore !!! Resolved by html import !!!
            this.core.enable()
        }
        else {
            // @ts-ignore !!! Resolved by html import !!!
            this.core.disable()
            // @ts-ignore !!! Resolved by html import !!!
            this.core.reset()
            this.core.blur()
        }
    }

    setSelected(values: Set<OptionKey> = new Set()){
        // @ts-ignore !!! Resolved by html import !!!
        this.core.setValue(Array.from(values))
    }
}

function applyVirtualSelect(core: HTMLElement, config: SelectInputConfig){
    // @ts-ignore !!! Resolved by html import !!!
    VirtualSelect.init({
        ele: core,
        additionalClasses: "multiselect",
        disabled: true,
        autofocus: false,
        markSearchResults: true,
        optionsCount: 6,
        multiple: config.multiple,
        search: config.search,
        hasOptionDescription: config.showCodes,
        disableSelectAll: config.disableSelectAll,
        maxValues: config.maxValues,
        required: config.required,

        placeholder: "Выберите",
        noOptionsText: "Варианты не найдены",
        noSearchResultsText: "Результатов не найдено",
        selectAllText: "Выбрать все",
        searchPlaceholderText: "Поиск...",
        optionsSelectedText: "(выбрано)",
        optionSelectedText: "вариант выбран",
        allOptionsSelectedText: "Все",
        clearButtonText: "Очистить",
        moreText: "ещё..."
    })
}

function mapToVirtualSelectOptions(map: Map<string, string>): any[]{
    return [...map.entries()].map(entry => {
        return {
            label: entry[1],
            value: entry[0],
            alias: entry[0],
            description: entry[0]
        }
    })
}