export const form = {
    title: "title",
    submitText: "submitText",
    submitPath: "submitPath",
    // statePath: "debug/statement",
    firstSection: {
        firstField: {
            type: "calendar",
            title: "firstField"
        },
        secondField: {
            type: "calendar",
            title: "secondField",
            range: true
        },
        thirdField: {
            type: "calendar",
            title: "thirdField",
            range: true,
            minDays: 5,
            maxDays: 15
        }
    },
    secondSection: {
        // firstField: {
        //     type: "select",
        //     label: "firstField",
        //     // serviceBankSource: {
        //     //     type: "carriers",
        //     //     propertiesTriggerKeys: {
        //     //         date: "firstSection.secondField"
        //     //     }
        //     // }
        // },
        // secondField: {
        //     type: "select",
        //     label: "secondField",
        //     endpointSource: {
        //         path: "demo/options",
        //         triggerKeys: ["firstSection.secondField", "secondSection.thirdField", "thirdSection.thirdField"]
        //     }
        // },
        // thirdField: {
        //     type: "select",
        //     label: "thirdField",
        //     multiple: true,
        //     search: true,
        //     endpointSource: {
        //         path: "demo/options"
        //     }
        // }
    },
    thirdSection: {
        firstField: {
            type: "switch",
            title: "firstField"
        },
        secondField: {
            type: "switch",
            title: "secondField"
        },
        thirdField: {
            type: "switch",
            title: "thirdField"
        }
    },
    departureSection: {
        title: "Отправления",
        switchField: {
            type: "switch",
            title: "Только страны СНГ и Балтии"
        },
        countriesField: {
            title: "Государства",
            type: "select",
            multiple: true,
            search: true,
            serviceBankSource: {
                type: "countries",
                propertiesTriggerKeys: {
                    date: "firstSection_firstField",
                    postSoviet: "departureSection_switchField"
                }
            }
        },
        roadsField: {
            title: "Дороги",
            type: "select",
            multiple: true,
            search: true,
            disableSelectAll: true,
            serviceBankSource: {
                type: "roads",
                propertiesTriggerKeys: {
                    date: "firstSection_firstField",
                    countries: "departureSection_countriesField"
                }
            }
        },
        // stationsField: {
        //     title: "Станции",
        //     type: "select",
        //     multiple: true,
        //     search: true,
        //     serviceBankSource: {
        //         type: "stations",
        //         propertiesTriggerKeys: {
        //             date: "firstSection.firstField",
        //             roads: "departureSection.roadsField"
        //         }
        //     }
        // }
    }
}