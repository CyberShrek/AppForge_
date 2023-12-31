import {Module} from "./abstract/Module"
import {Chart as ChartJS, ChartDataset, ChartOptions, registerables} from 'chart.js'
ChartJS.register(...registerables)

export class ChartJsModule extends Module{

    readonly chartJs: ChartJS

    constructor(private rootCanvas: HTMLCanvasElement,
                private data: MatrixData,
                private config: ChartValue) {
        super()
        if (this.config.content) {
            if (!Array.isArray(this.config.content))
                this.config.content = [this.config.content]

            this.chartJs = new ChartJS(rootCanvas.getContext('2d'), {
                data: {labels: this.getColumn(config.keyColumn), datasets: this.getDatasets()},
                type: config.content[0].type,
                options: this.getCommonOptions()
            })
        }
    }

    destroy() {
        this.chartJs.destroy()
    }

    private getDatasets(): ChartDataset[] {
        return (this.config.content as ChartContentConfig[]).map(config =>
            config.type === "line" ? this.getLineDataset(config as LineGraph) :
                config.type === "bar" ? this.getBarDataset(config as BarGraph) :
                    config.type === "pie" || config.type === "donut" ? this.getPieDataset(config as PieGraph) : null
        )
    }

    private getLineDataset(config: LineGraph): ChartDataset{
        // @ts-ignore
        return {
            ...this.getCommonDataset(config),
            type: "line",
            borderColor: config.color,
            borderWidth: 3,
            // @ts-ignore
            borderDash: config.dash ? [5, 5] : undefined,
            // @ts-ignore
            tension: config.curve ? 0.5 : 0,
            // @ts-ignore
            fill: !!config.fill,
            backgroundColor: config.fill && typeof config.fill === "string" ? config.fill : undefined
        }
    }

    private getBarDataset(config: BarGraph): ChartDataset{
        return {
            type: "bar",
            // @ts-ignore
            borderRadius: 5,
            ...this.getCommonDataset(config)
        }
    }

    private getPieDataset(config: PieGraph): ChartDataset {
        // @ts-ignore
        return {
            type: config.type === "donut" ? "doughnut" : "pie",
            ...this.getCommonDataset(config)
        }
    }

    private getCommonDataset(config: ChartContentConfig): ChartDataset {
        // @ts-ignore
        return {
            label: config.name,
            data: this.getColumn(config.column) as number[],
            backgroundColor: config.color
        }
    }

    private getCommonOptions(): ChartOptions {
        return {
            // aspectRatio: 2|1,
            interaction: {
                intersect: true,
                mode: "index"
            },
            plugins: {
                // tooltip:{
                //     position: "nearest"
                // },
                title: {
                    display: true,
                    text: this.config.title
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    }

    private getColumn(columnId: number): CellData[]{
        const column: CellData[] = []
        this.data.forEach(row => {
            if(row[columnId] !== null || row[columnId + 1] !== null)
                column.push(row[columnId])
        })
        return column
    }
}