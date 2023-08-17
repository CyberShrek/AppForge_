import {InputFragment} from "../../abstract/InputFragment"
import {Fragment} from "../../abstract/Fragment"
import {createLabelElement} from "../../../utils/DOMWizard";
import {jsonify} from "../../../utils/misc";

export abstract class Field<T extends InputFragment<any>> extends Fragment{

    readonly input: T

    jsonValue: object

    private readonly warningLabel: HTMLLabelElement

    protected constructor(location: FragmentLocation,
                          InputClass: new(location: FragmentLocation, config: InputConfig) => T,
                          inputConfig: InputConfig
    ) {
        super(location)
        this.core = location.target
        this.input = new InputClass({target: location.target, position: "beforeend"}, inputConfig)
        this.input.subscribe(value => this.jsonValue = jsonify(value))
        this.warningLabel = createLabelElement()
        this.core.appendChild(this.warningLabel)
    }

    makeValid(){
        this.warningLabel.textContent = ""
        this.core.classList.remove("wrong")
    }

    makeInvalid(message?: string){
        this.warningLabel.textContent = message
        this.core.classList.add("wrong")
    }
}