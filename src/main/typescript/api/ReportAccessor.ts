import {JsonAccessor} from "./abstract/JsonAccessor"

export class ReportAccessor extends JsonAccessor<ReportModels>{

    constructor(override path: string) {
        super()
        this.method = "POST"
        this.errorFooter = "Не удалось загрузить отчёт"
    }
}