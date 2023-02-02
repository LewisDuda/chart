<script setup>
    import { computed, watch } from "@vue/runtime-core";
    import store from "../../store";
    import Chart from "chart.js/auto";

    const datas = computed(() => store.state.advancedItems);
    const chartDatas = computed(() => {
        if (datas.value.length === 0) return;
        let arr = [];
        let tempArr = [];
        let count = 0;

        // Processing into special data
        for (let i = 0; i < datas.value.length; i++) {
            for (let j = 0; j < datas.value[i].length; j++) {
                if (i === 0) {
                    tempArr.push(datas.value[i][j].value);
                    count += 1; // element count + 1
                }
                if (i != 0) {
                    if (j === 0) {
                        for (let k = 0; k < count; k++) {
                            // Assigns the previous element position to NaN
                            tempArr[k] = "NaN";
                        }
                    }
                    tempArr.push(datas.value[i][j].value);
                    count += 1;
                }
            }
            arr[i] = tempArr;
            tempArr = [];
        }
        return arr;
    });

    const chartDetail = computed(() =>
        JSON.parse(
            JSON.stringify(processChartDetailNull(store.state.advancedChartDetail))
        )
    );

    const chartLabel = computed(() => {
        let arr = [];
        let title = "";
        for (let i = 0; i < datas.value.length; i++) {
            title = datas.value[i][0].tool + "_" + datas.value[i][0].chartName;
            arr.push(title);
        }
        return arr;
    });

    let chart = null;

    function drawChart() {
        if (chart != null) {
            chart.destroy();
        }

        const ctx = document.getElementById("advancedChart");

        let group = chartLabel.value;

        let xSubLabel = [];
        for (let i = 0; i < datas.value.length; i++) {
            for (let j = 0; j < datas.value[i].length; j++) {
                xSubLabel.push(datas.value[i][j].date);
            }
        }

        let xLabel = [];
        for (let i = 0; i < datas.value.length; i++) {
            for (let j = 0; j < datas.value[i].length; j++) {
                xLabel.push(datas.value[i][j].chamber);
            }
        }

        let datasArr = chartDatas.value;

        const data = {
            labels: xLabel,
            datasets: [],
        };

        const chooseBordercolor = [
            // START
            "#F87171",
            "#C084FC",
            "#FB923C",
            "#6366F1",
            "#4ADE80",
            "#60A5FA",
            "#2DD4BF",
            "#0E7490",
            "#BE123C",
            "#1D4ED8",
            "#7F1D1D",
            "#713F12",
            "#14532D",
            "#1E3A8A",
            "#312E81",
            // END
            "#F87171",
            "#C084FC",
            "#FB923C",
            "#6366F1",
            "#4ADE80",
            "#60A5FA",
            "#2DD4BF",
            "#0E7490",
            "#BE123C",
            "#1D4ED8",
            "#7F1D1D",
            "#713F12",
            "#14532D",
            "#1E3A8A",
            "#312E81",
        ];

        for (let i = 0; i < group.length; i++) {
            let tempDatasets = {
                label: group[i],
                data: datasArr[i],
                fill: false,
                borderColor: chooseBordercolor[i],
                backgroundColor: chooseBordercolor[i],
                borderWidth: chartDetail.value.lineWidth,
                pointBorderWidth: 2,
                pointRadius: chartDetail.value.pointRadius,
                tension: chartDetail.value.tension,
            };
            data.datasets.push(tempDatasets);
            tempDatasets = {};
        }

        const options = {
            maintainAspectRatio: true,
            scales: {
                xAxis: {
                    ticks: {
                        font: {
                            size: chartDetail.value.xLabelSize,
                            weight: chartDetail.value.xLabelWeight,
                            family: "sans-serif",
                        },
                        callback(label) {
                            return this.getLabelForValue(label);
                        },
                        color: "#000000",
                    },
                },
                xAxis2: {
                    display: chartDetail.value.isShowXSubLabel,
                    type: "category",
                    grid: {
                        drawBorder: false,
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: chartDetail.value.xSubLabelAngle,
                        font: {
                            size: chartDetail.value.xSubLabelSize,
                            weight: chartDetail.value.xSubLabelWeight,
                            family: "sans-serif",
                        },
                        callback(value, index, ticks) {
                            return xSubLabel[index];
                        },
                        color: "#000000",
                    },
                },
                y: {
                    max: chartDetail.value.max,
                    min: chartDetail.value.min,
                    ticks: {
                        stepSize: chartDetail.value.ticksSteps, // stepSize-> ticksSteps
                        beginAtZero: true,
                        font: {
                            size: chartDetail.value.yLabelSize,
                            weight: chartDetail.value.yLabelWeight,
                            family: "sans-serif",
                        },
                        color: "#000000",
                    },
                    title: {
                        display: true,
                        text: chartDetail.value.yAxialTitle,
                        color: "#000000",
                        font: {
                            align: "center",
                            size: chartDetail.value.yTitleSize,
                            weight: chartDetail.value.yTitleWeight,
                            family: "sans-serif",
                        },
                    },
                },
            },
            layout: {
                padding: {
                    top: 5,
                    right: 60,
                    bottom: 80,
                    left: 50,
                },
            },
            plugins: {
                title: {
                    display: true,
                    fullSize: false,
                    text: chartDetail.value.chartTitle,
                    color: "#000000",
                    padding: {
                        bottom: 10,
                    },
                    font: {
                        size: chartDetail.value.chartTitleSize,
                        weight: chartDetail.value.chartTitleWeight,
                    },
                },
                legend: {
                    display: chartDetail.value.isShowLegend,
                    position: "right",
                    align: "start",
                    rtl: true,
                    labels: {
                        textAlgin: "left",
                    },
                },
                tooltip: {
                    displayColors: false,
                    backgroundColor: "#0a3d62",
                    padding: 15,
                    cornerRadius: 10,
                    callbacks: {
                        beforeTitle: (context) => {
                            const tool = context[0].dataset.label.split("_")[0];
                            const chartName =
                                context[0].dataset.label.split("_")[1];
                            const text = "Tool: " + tool + "\n" + chartName;
                            return text;
                        },
                        title: (context) => {
                            const index = context[0].dataIndex;
                            let text = xSubLabel[index] + "\n" + context[0].label;
                            return text;
                        },
                        label: (context) => {
                            return `value:  ${context.formattedValue}`;
                        },
                    },
                    titleFont: {
                        family: "sans-serif",
                        size: 12,
                        weight: 100,
                    },
                    bodyFont: {
                        family: "sans-serif",
                        size: 12,
                        weight: 100,
                    },
                },
            },
        };

        const legendMarginRight = {
            id: "legendMarginRight",
            afterInit(chart, args, options) {
                const fitValue = chart.legend.fit;
                chart.legend.fit = function fit() {
                    fitValue.bind(chart.legend)();
                    let width = (this.width += 50);
                    return width;
                };
            },
        };

        const horizontalDottedLine = {
            id: "horizontalDottedLine",
            beforeDatasetsDraw(chart, args, options) {
                const {
                    ctx,
                    chartArea: { top, right, bottom, left, width, height },
                    scales: { x, y },
                } = chart;
                ctx.save();

                ctx.setLineDash([3, 5]);
                ctx.strokeStyle = "#fca103";
                ctx.strokeRect(
                    left,
                    y.getPixelForValue(chartDetail.value.maxSpec),
                    width,
                    0
                );
                ctx.strokeRect(
                    left,
                    y.getPixelForValue(chartDetail.value.minSpec),
                    width,
                    0
                );
                ctx.restore();
            },
        };

        const targetDottedLine = {
            id: "targetDottedLine",
            beforeDatasetsDraw(chart, args, options) {
                const {
                    ctx,
                    chartArea: { top, right, bottom, left, width, height },
                    scales: { x, y },
                } = chart;
                ctx.save();

                ctx.setLineDash([3, 5]);
                ctx.strokeStyle = "#4ADE80";
                ctx.strokeRect(
                    left,
                    y.getPixelForValue(chartDetail.value.target),
                    width,
                    0
                );
                ctx.restore();
            },
        };

        const breakLine = {
            id: "breakLine",
            beforeDatasetsDraw(chart, args, options) {
                const {
                    ctx,
                    chartArea: { top, right, bottom, left, width, height },
                    scales: { x, y },
                } = chart;
                ctx.save();

                const oneUnit = width / 75;

                ctx.beginPath();
                ctx.strokeStyle = "#b2bec3";
                ctx.lineWidth = 1;

                for (let i = 0; i < chartDetail.value.breakLine.length; i++) {
                    ctx.moveTo(
                        left,
                        y.getPixelForValue(chartDetail.value.breakLine[i])
                    );
                    ctx.lineTo(
                        left + oneUnit,
                        y.getPixelForValue(chartDetail.value.breakLine[i] + 5)
                    );
                    for (let j = 0; j < 76; j++) {
                        if (j % 2 === 0) {
                            ctx.lineTo(
                                left + oneUnit * j,
                                y.getPixelForValue(chartDetail.value.breakLine[i])
                            );
                        } else {
                            ctx.lineTo(
                                left + oneUnit * j,
                                y.getPixelForValue(
                                    chartDetail.value.breakLine[i] + 5
                                )
                            );
                        }
                    }
                }
                for (let i = 0; i < chartDetail.value.breakLine.length; i++) {
                    ctx.moveTo(
                        left,
                        y.getPixelForValue(chartDetail.value.breakLine[i] - 1)
                    );
                    ctx.lineTo(
                        left + oneUnit,
                        y.getPixelForValue(chartDetail.value.breakLine[i] + 4)
                    );
                    for (let j = 0; j < 76; j++) {
                        if (j % 2 === 0) {
                            ctx.lineTo(
                                left + oneUnit * j,
                                y.getPixelForValue(
                                    chartDetail.value.breakLine[i] - 1
                                )
                            );
                        } else {
                            ctx.lineTo(
                                left + oneUnit * j,
                                y.getPixelForValue(
                                    chartDetail.value.breakLine[i] + 4
                                )
                            );
                        }
                    }
                }
                ctx.stroke();
            },
        };

        const plugin = {
            id: "advancedChart",
            beforeDraw: (chart) => {
                const { ctx } = chart;
                ctx.save();
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            },
        };

        const config = {
            type: "line",
            data: data,
            options: options,
            plugins: [
                plugin,
                horizontalDottedLine,
                targetDottedLine,
                breakLine,
                legendMarginRight,
            ],
        };

        chart = new Chart(ctx, config);
    }

    function processChartDetailNull(payload) {
        if (!payload) return 0;
        return payload;
    }

    watch(chartDatas, (nvl, ovl) => {
        if (nvl != ovl) {
            drawChart();
        }
    });

    watch(chartDetail, (nvl, ovl) => {
        if (nvl != ovl) {
            drawChart();
        }
    });
</script>

<template src="./template.html"></template>
<style scoped lang="scss" src="./style.scss"></style>
