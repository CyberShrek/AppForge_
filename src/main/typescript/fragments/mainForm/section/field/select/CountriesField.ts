import {BankField} from "./BankField"
import {fetchCountriesByDate} from "../../../../../util/api/options/serviceBank"
import {InputFragment} from "../../../../abstract/InputFragment"
import {Field} from "../Field"

export class CountriesField extends BankField {

    constructor(location: FragmentLocation, configElement: HTMLElement) {
        super(location,configElement)
    }

    private postSovietKey = this.bankConfigElement.querySelector("subscriptions postsoviet")?.textContent
    private postSovietSubscription

    override resolveTriggerFields(getFieldFn: (key: string) => Field<InputFragment<any>>) {
        super.resolveTriggerFields(getFieldFn)
        this.postSovietSubscription = getFieldFn(this.postSovietKey)
    }

    override listenTriggerFields() {
        super.listenTriggerFields()
        this.resolveBankSubscribing(fetchCountriesByDate, this.dateFieldSubscription, this.postSovietSubscription)
    }
}