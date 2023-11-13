import {ReportModelWizard} from "../../../../model/ReportModelWizard"
import {tableTotalWord} from "../../../../properties"
import {swapElements} from "../../../../util/domWizard"

export class TableWizard {

    // The primary columns are the most left columns consist of "string" type cells
    primaryColumnsNumber: number = 0

    constructor(private modelWizard: ReportModelWizard,
                private config: TableConfig) {

        // Find primary columns number
        this.modelWizard.properData.forEach(row => {
            for (let i = 1; i <= row.length; i++) {
                if (typeof row[i - 1] !== "string") break
                if (i > this.primaryColumnsNumber) this.primaryColumnsNumber = i
            }
        })
    }

    // Performs spanning, totalling, grouping. O(n)
    // TODO refactor
    groupRows(rows: HTMLCollectionOf<HTMLTableRowElement>){

        if(!this.config.columnFeatures) return

        let cellsToGroup:  HTMLTableCellElement[] = []

        const commonProcess = (primaryCellCallback: (rowI: number,
                                                     colI: number,
                                                     thisIsGroupStart: boolean,
                                                     thisIsGroupEnd: boolean,
                                                     columnFeature: ColumnFeature) => void) => {

            for (let rowI = this.config.checkboxes ? 1 : 0; rowI < rows.length; rowI++) {
                for (let colI = this.primaryColumnsNumber - 1; colI >= (this.config.checkboxes ? 1 : 0); colI--) {
                    const columnFeature = this.config.columnFeatures[colI]
                    if (columnFeature.group) {
                        let thisIsGroupStart = cellsToGroup[colI] === undefined,
                            thisIsGroupEnd   = rowI               === rows.length - 1

                        for (let i = this.config.checkboxes ? 1 : 0; i <= colI; i++) {
                            if (!thisIsGroupStart && cellsToGroup[i].textContent !== rows[rowI].cells[i].textContent)
                                thisIsGroupStart = true
                            if (!thisIsGroupEnd && rows[rowI + 1].cells[i].textContent !== rows[rowI].cells[i].textContent)
                                thisIsGroupEnd = true
                        }
                        if(thisIsGroupStart)
                            cellsToGroup[colI] = rows[rowI].cells[colI]

                        primaryCellCallback(rowI, colI, thisIsGroupStart, thisIsGroupEnd, columnFeature)
                    }
                }
            }
        },
            hasGroupFeature = (key: keyof ColumnFeature["group"]): boolean =>
                !!this.config.columnFeatures?.find(feature => feature.group && Object.keys(feature.group).includes(key))


        if (hasGroupFeature("total") || hasGroupFeature("span")){
            let matricesToSum: MatrixData[] = [],
                totalRowsToInsertAfter = new Map<number, HTMLTableRowElement>() // Key is row i the total row will be inserted after

            commonProcess((rowI, colI, thisIsGroupStart, thisIsGroupEnd, columnFeature) => {

                if(!columnFeature.group.total || !rows[rowI].hasAttribute("i"))
                    return

                const rowData = this.modelWizard.properData[rows[rowI].getAttribute("i")]
                if (thisIsGroupStart){
                    matricesToSum[colI] = [rowData]
                }
                else if (thisIsGroupEnd) {

                    matricesToSum[colI].push(rowData)
                    const totalRow = rows[rowI].cloneNode(true) as HTMLTableRowElement
                    this.modelWizard.getDataTotal(matricesToSum[colI]).forEach((cellData, cellDataIndex) => {
                        if (cellDataIndex >= colI)
                            totalRow.cells[cellDataIndex].classList.add("total")
                        if (cellDataIndex > colI)
                            totalRow.cells[cellDataIndex].textContent = cellDataIndex < this.primaryColumnsNumber ? tableTotalWord :  String(cellData)
                    })
                    totalRow.removeAttribute("rowI")
                    totalRowsToInsertAfter.set(rowI + totalRowsToInsertAfter.size, totalRow)
                    if(!hasGroupFeature("total"))
                        totalRow.classList.add("collapsed")
                }
                else {
                    matricesToSum[colI].push(rowData)
                }
            })
            Array.from(totalRowsToInsertAfter.entries())
                .forEach(([rowI, totalRow]) =>
                    rows[rowI].insertAdjacentElement("afterend", totalRow))
        }

        if (hasGroupFeature("span")){
            cellsToGroup = []
            const cellsToAddButton: HTMLTableCellElement[] = [],
                toggleGroupCollapsing = (groupStartCell: HTMLTableCellElement, collapse: boolean) =>
                {
                    const startRow = groupStartCell.parentElement as HTMLTableRowElement
                    let nextRow: HTMLTableRowElement = startRow
                    do {
                        nextRow = nextRow.nextElementSibling as HTMLTableRowElement
                        if(collapse) {
                            nextRow.classList.add("collapsed")
                        } else {
                            nextRow.classList.remove("collapsed")
                            for (let i = groupStartCell.cellIndex + 1; i < this.primaryColumnsNumber; i++) {
                                const expandButton = nextRow.cells[i].querySelector("button.expand") as HTMLButtonElement
                                if(expandButton)
                                    setTimeout(() => expandButton.click(), 10)
                            }
                        }
                    }
                    while (!nextRow.cells[groupStartCell.cellIndex].classList.contains("total"))

                    if (!collapse && !hasGroupFeature("total"))
                         nextRow.classList.add("collapsed")

                    for (let i = groupStartCell.cellIndex + 1; i < startRow.cells.length; i++)
                        swapElements(startRow.cells[i], nextRow.cells[i])
                }

            commonProcess((rowI, colI, thisIsGroupStart, thisIsGroupEnd, columnFeature) => {
                if(columnFeature.group.span) {
                    if(thisIsGroupStart){
                        if(!thisIsGroupEnd)
                            cellsToAddButton.push(rows[rowI].cells[colI])
                    }
                    else {
                        // cellsToGroup[colI].rowSpan++
                        rows[rowI].cells[colI].textContent = ''
                        rows[rowI].cells[colI].classList.add("horizontal-span")
                    }
                }
            })
            cellsToAddButton.forEach(cell => {
                const button = document.createElement("button")
                button.classList.add("collapse")
                button.addEventListener("click", () => {
                    const collapse = button.classList.contains("collapse")
                    if(collapse) {
                        button.classList.remove("collapse")
                        button.classList.add("expand")
                    } else {
                        button.classList.remove("expand")
                        button.classList.add("collapse")
                    }
                    toggleGroupCollapsing(cell, collapse)
                })
                cell.appendChild(button)
            })
        }
    }
}