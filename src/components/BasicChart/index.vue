<script setup>
	import { computed, watch } from "@vue/runtime-core";
	import store from "../../store";
	import Chart from "chart.js/auto";

	const datas = computed(() => store.state.basicItems);
	const searchType = computed(() => store.state.searchType);
	const datesGroup = computed(() => store.getters.datesGrouping);
	const chambersGroup = computed(() => store.getters.chambersGrouping);
	const typeOneDatas = computed(() => {
		if (datas.value.length === 0) return;
		// Group data by date
		let startFlag = datas.value[0].date;
		let groupResult = [];
		let tempArr1 = [];
		let tempArr2 = [];
		let count1 = 0; // Group counter
		let count2 = 0; // NaN element counter
		let arr = [];

		for (let i = 0; i < datas.value.length; i++) {
			// Plant the flag
			if (datas.value[i].date === startFlag) {
				// Add data of the same date to the temp array
				tempArr1.push(datas.value[i].value);
			}
			// When the date does not match the flag
			if (datas.value[i].date != startFlag) {
				groupResult[count1] = tempArr1; // Store the sorted data in the groupResult
				tempArr1 = []; // Clear temporary array
				tempArr1.push(datas.value[i].value); // Add data of the same date to the temp array
				startFlag = datas.value[i].date; // Reassign flag
				count1 += 1; // Group counter + 1
			}
			// Data check completed
			if (i === datas.value.length - 1) {
				groupResult[count1] = tempArr1; // Archive last group to groupResult
			}
		}

		// Processing into special data
		for (let i = 0; i < groupResult.length; i++) {
			for (let j = 0; j < groupResult[i].length; j++) {
				if (i === 0) {
					tempArr2.push(groupResult[i][j]);
					count2 += 1; // element count + 1
				}
				if (i != 0) {
					if (j === 0) {
						for (let k = 0; k < count2; k++) {
							// Assigns the previous element position to NaN
							tempArr2[k] = "NaN";
						}
					}
					tempArr2.push(groupResult[i][j]);
					count2 += 1;
				}
			}
			arr[i] = tempArr2;
			tempArr2 = [];
		}
		return arr;
	});

	const typeTwoDatas = computed(() => {
		if (datas.value.length === 0) return;
		// Group data by chamber
		let startFlag = datas.value[0].chamber;
		let groupResult = [];
		let tempArr1 = [];
		let tempArr2 = [];
		let count1 = 0; // Group counter
		let count2 = 0; // NaN element counter
		let arr = [];

		for (let i = 0; i < datas.value.length; i++) {
			// Plant the flag
			if (datas.value[i].chamber === startFlag) {
				// Add data of the same chamber to the temp array
				tempArr1.push(datas.value[i].value);
			}
			// When the chamber does not match the flag
			if (datas.value[i].chamber != startFlag) {
				groupResult[count1] = tempArr1; // Store the sorted data in the groupResult
				tempArr1 = []; // Clear temporary array
				tempArr1.push(datas.value[i].value); // Add data of the same chamber to the temp array
				startFlag = datas.value[i].chamber; // Reassign flag
				count1 += 1; // Group counter + 1
			}
			// Data check completed
			if (i === datas.value.length - 1) {
				groupResult[count1] = tempArr1; // Archive last group to groupResult
			}
		}

		// Processing into special data
		for (let i = 0; i < groupResult.length; i++) {
			for (let j = 0; j < groupResult[i].length; j++) {
				if (i === 0) {
					tempArr2.push(groupResult[i][j]);
					count2 += 1; // element count + 1
				}
				if (i != 0) {
					if (j === 0) {
						for (let k = 0; k < count2; k++) {
							// Assigns the previous element position to NaN
							tempArr2[k] = "NaN";
						}
					}
					tempArr2.push(groupResult[i][j]);
					count2 += 1;
				}
			}
			arr[i] = tempArr2;
			tempArr2 = [];
		}
		return arr;
	});

	const chartDetail = computed(() =>
		JSON.parse(
			JSON.stringify(processChartDetailNull(store.state.basicChartDetail))
		)
	);

	let chart = null;

	function drawChart() {
		if (chart != null) {
			chart.destroy();
		}

		const ctx = document.getElementById("myChart");

		let group = [];
		let groupLength = null;
		let xLabel = [];
		let chartDatas = [];
		let xAxis = {};
		let xAxis2 = {};
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
		];

		if (searchType.value === 1) {
			// init lables
			group = datesGroup.value;
			groupLength = group.length;
			// init xLabel
			for (let i = 0; i < datas.value.length; i++) {
				xLabel.push(datas.value[i].chamber);
			}
			// init datas
			chartDatas = typeOneDatas.value;

			xAxis = {
				ticks: {
					font: {
						size: chartDetail.value.xLabelSize,
						weight: chartDetail.value.xLabelWeight,
						family: "sans-serif",
					},
					callback(label) {
						return this.getLabelForValue(label);
					},
				},
			};

			xAxis2 = {
				display: chartDetail.value.isShowXSubLabel,
				type: "category",
				grid: {
					drawBorder: false,
				},
				ticks: {
					autoSkip: false,
					maxRotation: 90,
					minRotation: chartDetail.value.xSubLabelAngle,
					color: chooseBordercolor,
					font: {
						size: chartDetail.value.xSubLabelSize,
						weight: chartDetail.value.xSubLabelWeight,
						family: "sans-serif",
					},
					callback(value, index, ticks) {
						let countArr = [];
						for (let i = 0; i < groupLength; i++) {
							if (i === 0) {
								countArr[i] = group[i].count;
								if (index === Math.floor(countArr[i] / 2)) {
									return (value = group[i].unit);
								}
							}
							if (i !== 0) {
								countArr[i] = countArr[i - 1] + group[i].count;
								if (
									index ===
									Math.floor((countArr[i - 1] + countArr[i]) / 2)
								) {
									return (value = group[i].unit);
								}
							}
						}
					},
				},
			};
		}

		if (searchType.value === 2) {
			// init lables
			group = chambersGroup.value;
			groupLength = group.length;
			// init xLabel
			for (let i = 0; i < datas.value.length; i++) {
				xLabel.push(datas.value[i].date);
			}
			// init datas
			chartDatas = typeTwoDatas.value;

			xAxis = {
				ticks: {
					maxRotation: 90,
					minRotation: chartDetail.value.xSubLabelAngle,
					font: {
						size: chartDetail.value.xLabelSize,
						weight: chartDetail.value.xLabelWeight,
						family: "sans-serif",
					},
					callback(label) {
						return this.getLabelForValue(label);
					},
				},
			};

			xAxis2 = {
				display: chartDetail.value.isShowXSubLabel,
				type: "category",
				grid: {
					drawBorder: false,
				},
				ticks: {
					autoSkip: false,
					color: chooseBordercolor,
					font: {
						size: chartDetail.value.xSubLabelSize,
						weight: chartDetail.value.xSubLabelWeight,
						family: "sans-serif",
					},
					callback(value, index, ticks) {
						let countArr = [];
						for (let i = 0; i < groupLength; i++) {
							if (i === 0) {
								countArr[i] = group[i].count;
								if (index === Math.floor(countArr[i] / 2)) {
									return (value = group[i].unit);
								}
							}
							if (i !== 0) {
								countArr[i] = countArr[i - 1] + group[i].count;
								if (
									index ===
									Math.floor((countArr[i - 1] + countArr[i]) / 2)
								) {
									return (value = group[i].unit);
								}
							}
						}
					},
				},
			};
		}

		const data = {
			labels: xLabel,
			datasets: [],
		};

		for (let i = 0; i < group.length; i++) {
			let tempDatasets = {
				label: group[i].unit,
				data: chartDatas[i],
				fill: false,
				borderColor: chooseBordercolor[i],
				backgroundColor: chooseBordercolor[i],
				borderWidth: chartDetail.value.lineWidth,
				pointBorderWidth: 2,
				pointRadius: chartDetail.value.pointRadius,
				tension: chartDetail.value.lineRadian,
			};
			data.datasets.push(tempDatasets);
			tempDatasets = {};
		}

		const options = {
			maintainAspectRatio: true,
			scales: {
				xAxis: xAxis,
				xAxis2: xAxis2,
				y: {
					max: chartDetail.value.max,
					min: chartDetail.value.min,
					ticks: {
						stepSize: chartDetail.value.ticksSteps,
						beginAtZero: true,
						font: {
							size: chartDetail.value.yLabelSize,
							weight: chartDetail.value.yLabelWeight,
							family: "sans-serif",
						},
					},
					title: {
						display: true,
						text: chartDetail.value.yAxialTitle,
						color: "#000000",
						padding: {
							bottom: 5,
						},
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
					text:
						chartDetail.value.tool + "_" + chartDetail.value.chartName,
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
							const text =
								"Tool: " +
								chartDetail.value.tool +
								"\n" +
								chartDetail.value.chartName;
							return text;
						},
						title: (context) => {
							return context[0].label;
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
			id: "myChart",
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

	watch(typeOneDatas, (nvl, ovl) => {
		if (nvl != ovl) {
			drawChart();
		}
	});

	watch(typeTwoDatas, (nvl, ovl) => {
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
