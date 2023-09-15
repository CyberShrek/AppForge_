import {resolveCSS} from "../../util/resolver"
import {stringifyDate, valueOrDefault} from "../../util/data"
import {easepick} from "@easepick/core"
import {AmpPlugin} from "@easepick/amp-plugin"
import {RangePlugin} from "@easepick/range-plugin"
import {LockPlugin} from "@easepick/lock-plugin"
import {DateTime} from "@easepick/datetime"
import {Fragment} from "../Fragment"
import {Button} from "./Button";

export default class Datepicker extends Fragment{

    pickedDateRange: DateRange

    pickDateRange(range: DateRange){
        if(this.config.range && this.easepick){
            this.easepick.setStartDate(range[0])
            this.easepick.setEndDate(range[1])
        }else
            this.easepick.setDate(range[0])
    }

    private easepick: easepick.Core

    constructor(private config: DatepickerConfig, onPick: (range: DateRange) => void) {
        super(`    
            <div class="datepicker"><input></div>
        `)

        const inputElement = this.root.querySelector("input")

        this.append(new Button({text: "📅"}, () => inputElement.click()))

        this.onMount( () =>
            this.easepick = createPicker(inputElement, config, dateRange => {
                this.pickedDateRange = dateRange
                onPick(dateRange)
            })
        )
    }
}

function createPicker(core: HTMLElement, config: DatepickerConfig, onSelect: (dateRange: DateRange) => void) {
    return new easepick.create({
        element: core,
        calendars: config.range ? 2 : 1,
        grid: 2,
        zIndex: 100,
        plugins: [config.range ? RangePlugin : null, AmpPlugin, LockPlugin],
        lang: 'ru',
        RangePlugin: config.range ? {
            locale: {
                one: 'день',
                few: 'дня',
                many: 'дней'
            },
            delimiter: " - "
        } : null,
        AmpPlugin: {
            darkMode: false,
            resetButton: true,
            dropdown: {
                minYear: valueOrDefault(config.minYear, 2010), maxYear: config.maxYear, months: true, years: true
            }
        },
        LockPlugin: {
            minDays: config.minDays,
            maxDays: config.maxDays
        },
        css: [
            "/appforge/css/third-party/easepick.css"
        ],
        setup(picker) {
            picker.on("select", (e) => {
                onSelect(
                    config.range
                        ? [stringifyDate(e.detail.start), stringifyDate(e.detail.end)]
                        : [stringifyDate(e.detail.date)]
                )
                setTimeout(() => picker.hide(), 10)
            })
        }
    })
}