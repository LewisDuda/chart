# Data visualization

This web application is built with **Frontend**: Vue3 + Vite, **Backend**: JSON Server, customize data management and data graph visualization for user.

### Features of this project

**Complete Data Management**

-   Provide user with comprehensive data management.

**Customized data query and data visualization**

-   Provide user with customized data query and data visualization.

**Download the data in the table as an excel file**

-   Provide user with the ability to download the data in the table as an excel file.

---

## Project Features

> -   Key in chart
>     > Users can add chart information.

> -   Key in chart datas
>     > User can add chart datas.

> -   Query specific table data
>     > User can query specific table data.

> -   Query specific table data with customized query mode(COMP. OF MPC)
>     > User can query specific table data in a custom query mode by clicking the button of COMP. OF MPC.

> -   Delete specific chart
>     > User can Delete specific chart.

> -   Edit table data
>     > User can edit table data by double-clicking the table data.

> -   Delete table data
>     > User can delete table data by clicking trash icon.

> -   Download the data in the table as an excel file
>     > User can download the data in the table as an excel file by clicking the button of DOWNLOAD.

> -   Adjust graph attributes in a line graph
>     > User can adjust graph attributes in a line graph by clicking the button of hamberger icon.

> -   Customized chart comparison
>     > User can use advanced features to perform customized table comparisons.

---

## Project Demo

[https://lewisduda.github.io/vue-chartjs/](https://lewisduda.github.io/vue-chartjs/)

For the first time, you can try to add a chart, then add chart data, then query and manage your chart datas and view the line chart drawn by the datas.

---

## Install this project

If you need a copy of this project and run it locally on your computer please see the instructions below.

### Clone Project

```
$ git clone https://github.com/LewisDuda/vue-chartjs.git
```

### Usage Packages

-   [npm](https://docs.npmjs.com/)
-   [axios](https://www.npmjs.com/package/axios)
-   [chart.js](https://www.npmjs.com/package/chart.js)
-   [json-server](https://www.npmjs.com/package/json-server)
-   [sweetalert2](https://www.npmjs.com/package/sweetalert2)
-   [vue-router](https://www.npmjs.com/package/vue-router)
-   [vuex](https://www.npmjs.com/package/vuex)
-   [xlsx](https://www.npmjs.com/package/xlsx)

### Setup App

**1. Install npm**

```
$ npm install
```

**2. Create .env file**

```
$ touch .env
```

**3. Write your API ADDRESS into .env file and save.**

```
// Use environment variables in VITE as follows.
// You must prefix your own environment variable with VITE_
// VITE_EXAMPLE_VARIABLE = YOUR_VALUE

VITE_API_ADDRESS = "http://localhost:8888"

```

**4. Start the App**

```
// run json-server
$ npm run node
```

```
// run vite
$ npm run dev
```

**5. Finding the following message indicates the App is running successfully.**

```
// npn run node
  Home
  http://localhost:8888
```

```
// npm run dev
vite v2.9.14 dev server running at:
> Local: http://localhost:3000/
```

---

## Project production experience

[Vue3 + Chart.js draw a line chart](https://medium.com/@lewisduda46/筆記-vue3-json-server-使用chart-js-繪製折線圖-cff8132d6c3f)

---

## Author

[Lewis](https://github.com/LewisDuda)
