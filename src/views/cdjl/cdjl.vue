<template>
  <div id="runningMap" style="height: 100%; width: 100%; background-color: black"></div>
</template>

<script>
import * as echarts from "echarts";
import C from '@/assets/com'
import dayjs from 'dayjs'

export default {
  name: "cdjl",
  props: {
    ccList: String,
    yxtheight: Number,
  },
  data () {
    return {
      trainLineDataset: [],
      selectedSeries: "",
      labelVisible: false,
      originalDataZoomRange: "",
      jlId: '',
      jlrqfw: []
    };
  },
  mounted () {
    this.trainMap = [];
    // console.log('运行图参数', this.ccList, this.jlId, this.jlrqfw)
    if (this.$route.query.ccId) {
      console.log( '运行图参数', this.$route.query.ccId )
      this.jlId = this.$route.query.ccId
      this.jlrqfw = [this.$route.query.stDate, this.$route.query.fiDate]
    } else {
      this.$message.error( '缺少车次信息' )
    }
    //this.getData();
  },
  watch: {
    ccList: function ( newData ) {
      this.ccList = newData;
      this.getData();
    },
    jlId: function ( newData ) {
      this.jlId = newData;
      this.getData();
    },
    jlrqfw: function ( newData ) {
      this.jlrqfw = newData;
      console.log( this.jlrqfw );
      this.getData();
    },
  },
  methods: {
    /*生成 JSON 数组中某一键值的字典*/
    generateJSONDic ( object, keyname ) {
      const uniqueArr = function ( oldArr ) {
        const obj = {};
        const newArr = [];
        for (const oldArrElement of oldArr) {
          const index = JSON.stringify( oldArrElement );
          if (!obj[index]) {
            obj[index] = true;
            newArr.push( JSON.parse( index ) );
          }
        }
        return newArr;
      };
      return uniqueArr(
        object.map( ( item ) => {
          return item[keyname];
        } )
      );
    },
    
    getDirection ( trainLine, stnDic ) {
      let [dep, arr] = trainLine;
      console.log( dep );
      console.log( arr );
      let depStationIndex = stnDic.find( ( item ) => {
        return item["STN_NAME"] == dep["STN_NAME"];
      } );
      let arrStationIndex = stnDic.find( ( item ) => {
        return item["STN_NAME"] == arr["STN_NAME"];
      } );
      console.log( depStationIndex );
      console.log( arrStationIndex );
      return depStationIndex["RN"] - arrStationIndex["RN"] > 0
        ? true
        : false;
    },
    
    newGenerateTrainLineDataset ( rawTrainMapData ) {
      const spArray = ( n, arr ) => {
        let newArr = [],
          i;
        for (i = 0; i < arr.length;) {
          newArr.push( arr.slice( i, (i += n) ) );
        }
        return newArr;
      };
      
      let stnDic = this.sortJSONArray( rawTrainMapData["2"], "RN", true );
      let source = JSON.parse( JSON.stringify( rawTrainMapData["1"] ) );
      let trainLineDataset = [];
      source.map( ( item ) => {
        let singleLineData = [];
        let departurePoint = {};
        let arrivePoint = {};
        departurePoint["TRAIN_NO"] = item["TRAIN_NO"];
        departurePoint["STN_NAME"] = item["START_STN"];
        departurePoint["TIME"] = item["START_TIME"];
        departurePoint["DEPARTURE"] = true;
        // departurePoint["STOPPING"] = item["STOPPING"];
        
        arrivePoint["TRAIN_NO"] = item["TRAIN_NO"];
        arrivePoint["STN_NAME"] = item["ARRIVE_STN"];
        arrivePoint["TIME"] = item["ARRIVE_TIME"];
        arrivePoint["DEPARTURE"] = false;
        // arrivePoint["STOPPING"] = item["STOPPING"];
        
        // if (!item["STOP_FLAG"]) {
        //   departurePoint["STOP_FLAG"] = "0";
        //   arrivePoint["STOP_FLAG"] = "0";
        // } else {
        //   departurePoint["STOP_FLAG"] = item["STOP_FLAG"];
        //   arrivePoint["STOP_FLAG"] = item["STOP_FLAG"];
        // }
        
        singleLineData.push( departurePoint );
        singleLineData.push( arrivePoint );
        // console.log('单线', singleLineData)
        if (this.getDirection( singleLineData, stnDic )) {
          item["DIRECTION"] = "DOWN";
        } else {
          item["DIRECTION"] = "UP";
        }
        trainLineDataset.push( singleLineData );
      } );
      let stoppingLine = [];
      source.map( ( item, index ) => {
        // 第一个车次只提供终点站
        if (index == 0) {
          stoppingLine.push( {
            TIME: item["ARRIVE_TIME"],
            STN_NAME: item["ARRIVE_STN"],
            DIRECTION: item["DIRECTION"],
          } );
        } else if (index == source.length - 1) {
          // 最后一个车次只提供出发站
          stoppingLine.push( {
            TIME: item["START_TIME"],
            STN_NAME: item["START_STN"],
            DIRECTION: item["DIRECTION"],
          } );
        } else {
          stoppingLine.push( {
            TIME: item["START_TIME"],
            STN_NAME: item["START_STN"],
            DIRECTION: item["DIRECTION"],
          } );
          stoppingLine.push( {
            TIME: item["ARRIVE_TIME"],
            STN_NAME: item["ARRIVE_STN"],
            DIRECTION: item["DIRECTION"],
          } );
        }
      } );
      trainLineDataset.push( spArray( 2, stoppingLine ) );
      console.log( trainLineDataset );
      return trainLineDataset;
    },
    
    generateTrainLineDataset ( rawTrainMapData ) {
      let source = rawTrainMapData["1"];
      let singleLineData = [];
      let runningLineDataset = [];
      let lastOne = {};
      let currentOne = {};
      
      currentOne = source[0];
      singleLineData.push( currentOne );
      lastOne = currentOne;
      source.shift();
      
      while (source.length !== 0) {
        currentOne = source[0];
        if (currentOne.TRAIN_NO == lastOne.TRAIN_NO) {
          singleLineData.push( currentOne );
        } else {
          if (lastOne["STN_NAME"] == currentOne["STN_NAME"]) {
            runningLineDataset.push( singleLineData );
            singleLineData = [];
            singleLineData.push( lastOne );
            singleLineData.push( currentOne );
          } else {
            let insertOne = {};
            insertOne = JSON.parse( JSON.stringify( lastOne ) );
            insertOne["TRAIN_NO"] = currentOne["TRAIN_NO"];
            insertOne["ARRIVE_TIME"] = insertOne["START_TIME"];
            insertOne["SEQNUM"] = "1";
            lastOne["START_TIME"] = lastOne["ARRIVE_TIME"];
            runningLineDataset.push( singleLineData );
            singleLineData = [];
            singleLineData.push( lastOne );
            singleLineData.push( insertOne );
            singleLineData.push( currentOne );
          }
        }
        lastOne = currentOne;
        source.shift();
      }
      runningLineDataset.push( singleLineData );
      // console.log(runningLineDataset);
      return runningLineDataset;
    },
    
    /*JSON数组按某一键值排序*/
    sortJSONArray ( array, keyname, reverse ) {
      if (array.length < 2 || !keyname || typeof array[0] !== "object") {
        return array;
      }
      if (typeof array[0][keyname] === "number") {
        array.sort( ( x, y ) => {
          return x[keyname] - y[keyname];
        } );
      }
      if (typeof array[0][keyname] === "string") {
        if (keyname === "RN" || keyname === "SEQNUM") {
          array.sort( ( x, y ) => {
            return parseInt( x[keyname] ) - parseInt( y[keyname] );
          } );
        } else {
          array.sort( ( x, y ) => {
            return x[keyname].localeCompare( y[keyname] );
          } );
        }
      }
      if (reverse) {
        array.reverse();
      }
      return array;
    },
    
    /*生成 Echarts 数据集*/
    generateRunningMap ( rawMapData ) {
      console.log( rawMapData );
      // generateTrainLineDataset(rawMapData)
      /*生成 Y 轴（车站）*/
      let STNDataset = this.sortJSONArray( rawMapData["2"], "RN", true );
      STNDataset.push( { STN_NAME: "" } );
      STNDataset.unshift( { STN_NAME: "" } );
      /*生成 X 轴（时间）*/
      let timeRawData = rawMapData["1"];
      let timeDataset = [];
      timeRawData.map( ( item ) => {
        timeDataset.push( item["ARRIVE_TIME"] );
        timeDataset.push( item["START_TIME"] );
      } );
      timeDataset = this.sortJSONArray(
        [...new Set( timeDataset )].sort( ( x, y ) => {
          return x.localeCompare( y );
        } )
      );
      
      let trainRawLineDataset = this.newGenerateTrainLineDataset(
        rawMapData
      );
      let trainLineDataset = [];
      trainRawLineDataset.map( ( item, index ) => {
        // console.log(trainRawLineDataset.length);
        // console.log(index);
        if (index === trainRawLineDataset.length - 1) {
          item.map( ( ii ) => {
            // console.log(ii);
            trainLineDataset.push( {
              source: ii,
            } );
          } );
        } else {
          // console.log(item);
          trainLineDataset.push( {
            source: item,
          } );
        }
      } );
      // console.log(trainLineDataset);
      this.trainLineDataset = trainLineDataset;
      return { timeDataset, STNDataset, trainLineDataset };
    },
    
    renderStoppingTable ( data, elementID ) {
      // console.log(data);
      let source = data.data["STOPPING"];
      let dom = document.getElementById( elementID );
      if (document.getElementById( "stoppingTable" )) {
        dom.removeChild( document.getElementById( "stoppingTable" ) );
      }
      if (document.getElementById( "comment" )) {
        dom.removeChild( document.getElementById( "comment" ) );
      }
      
      // 渲染表格头
      let tab = document.createElement( "table" );
      tab.setAttribute( "id", "stoppingTable" );
      tab.setAttribute( "align", "center" );
      // tab.setAttribute('border', '1')
      tab.setAttribute(
        "style",
        "border-collapse: collaspe; border: 1px solid; border-spacing: 0; display: block; max-height: 350px; overflow-y: scroll"
      );
      let titleTr = document.createElement( "tr" );
      titleTr.setAttribute( "align", "center" );
      let titleTh = [];
      let thInnerHTML = [
        "序号",
        "车站",
        "到达时间",
        "出发时间",
        "经停时长(分钟)",
      ];
      thInnerHTML.map( ( item ) => {
        let thElement = document.createElement( "th" );
        thElement.setAttribute( "style", "border: 1px solid" );
        thElement.innerHTML = item.toString();
        titleTh.push( thElement );
      } );
      titleTh.map( ( item ) => {
        titleTr.appendChild( item );
      } );
      tab.appendChild( titleTr );
      dom.appendChild( tab );
      
      let span = document.createElement( "span" );
      span.setAttribute( "id", "comment" );
      dom.appendChild( span );
      
      let contentTrs = [];
      // 渲染表格体
      source.map( ( item, index, arr ) => {
        // console.log(item)
        let indexTd = document.createElement( "td" );
        let stnTd = document.createElement( "td" );
        let arriveTd = document.createElement( "td" );
        let startTd = document.createElement( "td" );
        let elapsedTd = document.createElement( "td" );
        indexTd.innerHTML = (index + 1).toString();
        indexTd.setAttribute(
          "style",
          "border: 1px solid; text-align: center"
        );
        stnTd.innerHTML = item["STN_NAME"].toString();
        stnTd.setAttribute(
          "style",
          "border: 1px solid; text-align: center"
        );
        arriveTd.innerHTML =
          item["ARRIVE_TIME"] == item["START_TIME"] &&
          index != arr.length - 1
            ? "-"
            : new Date( item["ARRIVE_TIME"] )
            .toLocaleString( "chinese", {
              hour12: false,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            } )
            .replace( /\//g, "-" );
        arriveTd.setAttribute(
          "style",
          "border: 1px solid; text-align: center"
        );
        startTd.innerHTML =
          item["ARRIVE_TIME"] == item["START_TIME"] && index != 0
            ? "-"
            : new Date( item["START_TIME"] )
            .toLocaleString( "chinese", {
              hour12: false,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            } )
            .replace( /\//g, "-" );
        startTd.setAttribute(
          "style",
          "border: 1px solid; text-align: center"
        );
        elapsedTd.innerHTML =
          item["ELAPSED"] == 0 ? "-" : item["ELAPSED"].toString();
        elapsedTd.setAttribute(
          "style",
          "border: 1px solid; text-align: center"
        );
        let contentTr = document.createElement( "tr" );
        if (item["ARRIVE_TIME"] == item["START_TIME"]) {
          contentTr.setAttribute( "style", "font-weight: bold" );
        }
        contentTr.appendChild( indexTd );
        contentTr.appendChild( stnTd );
        contentTr.appendChild( arriveTd );
        contentTr.appendChild( startTd );
        contentTr.appendChild( elapsedTd );
        contentTrs.push( contentTr );
      } );
      
      contentTrs.map( ( item ) => {
        tab.appendChild( item );
      } );
    },
    
    /*渲染 Echarts 图表*/
    renderMap ( mapDataset ) {
      let chartDOM = document.getElementById( "runningMap" );
      if (echarts.getInstanceByDom( chartDOM )) {
        // // console.log(echarts.getInstanceByDom(chartDOM));
        let instance = echarts.getInstanceByDom( chartDOM );
        instance.dispose( instance );
      }
      let runningChart = echarts.init( chartDOM );
      let chartOptions = {
        color: [
          "#FF8F54",
          "#21A3EA",
          "#F5E8C8",
          "#B8D2C7",
          "#C6B38E",
          "#A4D8C2",
          "#F3D999",
          "#D3758F",
          "#DCC392",
          "#82B6E9",
          "#FF6347",
          "#A092F1",
          "#0A915D",
          "#EAF889",
          "#6699FF",
          "#FF6666",
          "#3CB371",
          "#D5B158",
          "#38B6B6",
        ],
        grid: {
          left: "5%",
          right: "3%",
          bottom: "5%",
        },
        xAxis: {
          type: "time",
          data: mapDataset.timeDataset,
          position: "top",
          axisLine: {
            show: true,
            lineStyle: {
              width: 3,
              color: "#FFFFFF",
            },
          },
          axisTick: {
            show: true,
            lineStyle: {
              width: 5,
            },
          },
          axisLabel: {
            fontSize: 16,
            formatter: {
              month: "{dayStyle|{yyyy}-{MM}-{dd}}",
              day: "{dayStyle|{yyyy}-{MM}-{dd}}",
              hour: "{hourStyle|{HH}:{mm}}",
              minute: "{minuteStyle|{HH}:{mm}}",
              second: "{minuteStyle|{HH}:{mm}}",
            },
            rich: {
              dayStyle: {
                fontSize: 18,
              },
              hourStyle: {
                fontSize: 15,
              },
            },
          },
          min: ( value ) => {
            var date = new Date( value.min );
            date.setDate( date.getDate() - 1 );
            date.setHours( 23 );
            return date;
          },
          max: ( value ) => {
            var date = new Date( value.max );
            date.setHours( date.getHours() + 23 );
            return date;
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              color: "#FFFFFF",
              opacity: 0.2,
            },
          },
          boundaryGap: false,
          axisPointer: {
            show: true,
            type: "line",
            snap: false,
            triggerTooltip: true,
            label: {
              formatter: ( params ) => {
                let rawDate = new Date( parseInt( params.value ) );
                return rawDate
                .toLocaleString( "zh", {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                } )
                .replace( /\//g, "-" );
              },
              backgroundColor: "rgb(161,182,231)",
              color: "rgb(41,74,144)",
            },
          },
        },
        yAxis: [
          {
            type: "category",
            data: mapDataset.STNDataset.map( ( item ) => {
              return item.STN_NAME;
            } ),
            axisLine: {
              show: true,
              lineStyle: {
                width: 3,
                color: "#FFFFFF",
              },
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                width: 5,
              },
            },
            axisLabel: {
              fontSize: 16,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "solid",
                color: "#FFFFFF",
              },
            },
            boundaryGap: false,
          },
        ],
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: 0,
            filterMode: "none",
            showDataShadow: false,
            labelFormatter: ( value ) => {
              let rawDate = new Date( parseInt( value ) );
              return rawDate
              .toLocaleString( "zh", {
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              } )
              .replace( /\//g, "-" );
            },
            bottom: "0",
            moveHandleSize: 12,
            brushSelect: false,
            rangeMode: "value",
            endValue: new Date(
              new Date( mapDataset.timeDataset[0] ).getTime() +
              86400000
            ),
          },
          {
            type: "slider",
            show: true,
            yAxisIndex: 0,
            filterMode: "none",
            showDataShadow: false,
            moveHandleSize: 12,
            brushSelect: false,
          },
          {
            type: "inside",
            filterMode: "none",
            xAxisIndex: 0,
          },
          {
            type: "inside",
            filterMode: "none",
            yAxisIndex: 0,
            zoomOnMouseWheel: false,
          },
        ],
        tooltip: {
          show: false,
          confine: true,
          trigger: "none",
          enterable: true,
          triggerOn: "click",
          position: ( point, params, dom, rect, size ) => {
            // console.log(size)
            // console.log(rect)
            
            return ["72%", "15%"];
          },
          formatter: ( params ) => {
            // console.log(params);
            if (!params[0] && params.data["STOPPING"]) {
              let START_STATION = params.data["STOPPING"][0];
              let ARRIVE_STATION =
                params.data["STOPPING"][
                params.data["STOPPING"].length - 1
                  ];
              let tooltipTitle =
                '<span style="font-size: larger; font-weight: bold">' +
                params.data.TRAIN_NO +
                "&nbsp&nbsp" +
                "</span>";
              let tooltipContent =
                "<span>" +
                START_STATION.STN_NAME +
                "(" +
                new Date( START_STATION.ARRIVE_TIME )
                .toLocaleString( "chinese", {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                } )
                .replace( /\//g, "-" )
                .split( " " )[1] +
                ")" +
                "→" +
                ARRIVE_STATION.STN_NAME +
                "(" +
                new Date( ARRIVE_STATION.ARRIVE_TIME )
                .toLocaleString( "chinese", {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                } )
                .replace( /\//g, "-" )
                .split( " " )[1] +
                ")" +
                "</span>";
              
              let tooltipTT =
                '<div style="display: flex; align-items: center">' +
                tooltipTitle +
                tooltipContent +
                "</div>";
              let tooltipTable =
                '<div id="tooltipTable" style="height: auto; width: auto"></div>';
              setTimeout( () => {
                this.renderStoppingTable(
                  params,
                  "tooltipTable"
                );
              }, 10 );
              return tooltipTT + tooltipTable;
            } else if (params[0]) {
              let START_STATION = params[0].data["STOPPING"][0];
              let ARRIVE_STATION =
                params[0].data["STOPPING"][
                params[0].data["STOPPING"].length - 1
                  ];
              let tooltipContent =
                "<span>" +
                START_STATION.STN_NAME +
                "(" +
                new Date( START_STATION.ARRIVE_TIME )
                .toLocaleString( "chinese", {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                } )
                .replace( /\//g, "-" )
                .split( " " )[1] +
                ")" +
                "→" +
                ARRIVE_STATION.STN_NAME +
                "(" +
                new Date( ARRIVE_STATION.ARRIVE_TIME )
                .toLocaleString( "chinese", {
                  hour12: false,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                } )
                .replace( /\//g, "-" )
                .split( " " )[1] +
                ")" +
                "</span>";
              let tooltipTitle =
                '<span style="font-size: larger; font-weight: bold">' +
                params[0].data.TRAIN_NO +
                "&nbsp&nbsp" +
                "</span>";
              let tooltipTT =
                '<div style="display: flex; align-items: center">' +
                tooltipTitle +
                tooltipContent +
                "</div>";
              let tooltipTable =
                '<div id="tooltipTable" style="height: auto; width: auto"></div>';
              setTimeout( () => {
                this.renderStoppingTable(
                  params[0],
                  "tooltipTable"
                );
              }, 10 );
              return tooltipTT + tooltipTable;
            }
          },
        },
        dataset: mapDataset.trainLineDataset,
        series: mapDataset.trainLineDataset.map( ( item, index ) => {
          if (!item.source[0].TRAIN_NO) {
            return {
              name: "显示/隐藏交路",
              type: "custom",
              clip: true,
              animation: false,
              renderItem: ( params, api ) => {
                if (params.dataIndex === 0) {
                  // console.log(item.source)
                  
                  let offset =
                    item.source[0].DIRECTION == "DOWN"
                      ? 12
                      : - 12;
                  
                  let pA = {};
                  let pB = {};
                  
                  pA.x = new Date(
                    item.source[0].TIME
                  ).getTime();
                  pA.y = api.value( 1 );
                  
                  pB.x = new Date(
                    item.source[1].TIME
                  ).getTime();
                  pB.y = api.value( 1 );
                  
                  // console.log(pA)
                  // console.log(pB)
                  
                  // console.log(params)
                  // console.log(api.value(0))
                  // console.log(api.value(1))
                  // console.log(api.size([api.value(0), api.value(1)]))
                  
                  let polyLine = {};
                  
                  polyLine.pointA = api.coord( [pA.x, pA.y] );
                  polyLine.pointB = [
                    polyLine.pointA[0],
                    polyLine.pointA[1] + offset,
                  ];
                  polyLine.pointC = [
                    api.coord( [pB.x, pB.y] )[0],
                    api.coord( [pB.x, pB.y] )[1] + offset,
                  ];
                  polyLine.pointD = api.coord( [pB.x, pB.y] );
                  
                  // console.log(polyLine)
                  
                  return {
                    type: "polyline",
                    shape: {
                      points: [
                        polyLine.pointA,
                        polyLine.pointB,
                        polyLine.pointC,
                        polyLine.pointD,
                      ],
                    },
                    transition: "shape",
                    style: {
                      fill: "transparent",
                      lineWidth: 2,
                      stroke: "#FFFFFF",
                    },
                  };
                }
              },
              datasetIndex: index,
              dimensions: ["TIME", "STN_NAME"],
              encode: {
                y: "STN_NAME",
                x: "TIME",
              },
            };
          } else {
            return {
              name: item.source[0].TRAIN_NO,
              type: "line",
              dimensions: ["TIME", "STN_NAME", "TRAIN_NO"],
              datasetIndex: index,
              encode: {
                y: "STN_NAME",
                x: "TIME",
              },
              
              sampling: "average",
              symbolSize: 7.5,
              z: index,
              lineStyle: {
                type:
                  item.source[0].STOP_FLAG == 1 ? 5 : "solid",
                opacity:
                  item.source[0].STOP_FLAG == 1 ? 0.6 : 1,
                width: item.source[0].STOP_FLAG == 1 ? 1 : 2,
              },
              label: {
                show: false,
                position: "bottom",
                offset: [0, 10],
                color: "inherit",
                fontSize: 14,
                borderWidth: 1,
                formatter: ( params ) => {
                  // console.log("123");
                  // console.log(params);
                  return new Date( params.data.TIME )
                  .toLocaleString( "chinese", {
                    hour12: false,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  } )
                  .replace( /\//g, "-" )
                  .split( " " )[1];
                },
              },
              emphasis: {
                lineStyle: {
                  width: 5,
                },
                scale: true,
                label: {
                  show: true,
                  position: "bottom",
                  offset: [0, 10],
                  color: "inherit",
                  fontSize: 14,
                  borderWidth: 1,
                  formatter: ( params ) => {
                    // console.log("123");
                    // console.log(params);
                    return new Date( params.data.TIME )
                    .toLocaleString( "chinese", {
                      hour12: false,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    } )
                    .replace( /\//g, "-" )
                    .split( " " )[1];
                  },
                },
              },
              itemStyle: {
                color: ( params ) => {
                  if (item.source[0].STOP_FLAG == 1) {
                    return "#F5F7FA";
                  } else {
                    return params.color;
                  }
                },
              },
              markPoint: {
                symbol: "roundRect",
                symbolOffset: [0, - 30],
                label: {
                  show: true,
                  formatter: () => {
                    return item.source[0].STOP_FLAG == 1
                      ? "已停运"
                      : item.source[0].TRAIN_NO;
                  },
                  color: "#FFFFFF",
                  fontSize: "16",
                  fontWeight: "bold",
                },
                data: [
                  {
                    type: "min",
                    name: "min",
                  },
                ],
                itemStyle: {
                  color: "transparent",
                },
              },
            };
          }
        } ),
        legend: {
          type: "scroll",
          show: true,
          selectedMode: true,
          textStyle: {
            color: "#FFFFFF",
          },
        },
      };
      // console.log("chartOptions: \n");
      console.log( chartOptions );
      runningChart.setOption( chartOptions );
      let originalDataZoom = runningChart.getOption().dataZoom[0];
      // console.log(originalDataZoom)
      this.originalDataZoomRange =
        originalDataZoom.end - originalDataZoom.start;
      console.log( this.originalDataZoomRange );
      runningChart.getZr().off( "mouseover" );
      runningChart.getZr().off( "mouseout" );
      runningChart.getZr().on( "click", ( event ) => {
        console.log( event );
        // console.log(event.target.style.lineWidth)
        if (event.target && event.target.type == "ec-polyline") {
          runningChart.dispatchAction(
            {
              type: "downplay",
              seriesIndex: this.selectedSeries,
            },
            true
          );
          let target = event.target;
          this.selectedSeries = target.z;
          runningChart.dispatchAction( {
            type: "highlight",
            seriesIndex: this.selectedSeries,
          } );
          // runningChart.off('downplay')
        } else {
          runningChart.dispatchAction( {
            type: "downplay",
            seriesIndex: this.selectedSeries,
          } );
          this.selectedSeries = "";
        }
      } );
      runningChart.on( "datazoom", ( params ) => {
        // console.log(params);
        let currentOptions = runningChart.getOption();
        console.log( currentOptions );
        let dataZoomParams = params.batch ? params.batch[0] : params;
        console.log( dataZoomParams );
        let newSymbolSize =
          (18 * this.originalDataZoomRange) /
          (dataZoomParams.end - dataZoomParams.start);
        console.log( newSymbolSize );
        if (dataZoomParams.end - dataZoomParams.start < 4) {
          currentOptions.series.map( ( series ) => {
            if (series.type == "line") {
              series.label.show = true;
              series.markPoint.label.fontSize =
                newSymbolSize < 18
                  ? newSymbolSize < 8
                    ? 0
                    : newSymbolSize
                  : 18;
            }
          } );
        } else {
          currentOptions.series.map( ( series ) => {
            if (series.type == "line") {
              series.label.show = false;
              series.markPoint.label.fontSize =
                newSymbolSize < 18
                  ? newSymbolSize < 8
                    ? 0
                    : newSymbolSize
                  : 18;
            }
          } );
        }
        runningChart.setOption( currentOptions, {
          notMerge: true,
          lazyUpdate: true,
        } );
      } );
    },
    
    /*将字符串时间转换为时间戳（分钟）*/
    parseStringToDate ( dateString ) {
      let [date, time] = dateString.split( " " );
      let [year, month, day] = date.split( "-" );
      let [hour, minute] = time.split( ":" );
      let returnDate = new Date();
      returnDate.setFullYear( year );
      returnDate.setMonth( month - 1 );
      returnDate.setDate( day );
      returnDate.setHours( hour );
      returnDate.setMinutes( minute );
      // // console.log(returnDate.getTime())
      return returnDate.getTime() / 1000 / 60;
    },
    resTransform ( data ) {
      let parsed = JSON.parse( JSON.stringify( data ).replace( /CC/g, 'TRAIN_NO' ).replace( /END_DATE/g, 'ARRIVE_TIME' ).replace( /END_STATION/g, 'ARRIVE_STN' ).replace( /START_DATE/g, 'START_TIME' ).replace( /START_STATION/g, 'START_STN' ) )
      let dayCounter = 0
      let currentDate = dayjs()
      parsed["1"].map((cc, index, arr) => {
        if (index >= 1 && (dayjs('2022-03-17' + arr[index-1].ARRIVE_TIME.split(' ')[1], 'YYYY-MM-DD HH:mm:ss').unix() > dayjs('2022-03-17 ' + cc.START_TIME, 'YYYY-MM-DD HH:mm:ss').unix())) {
          console.log('跨天')
          currentDate = currentDate.add(1, 'day')
        }
        dayCounter = parseInt(cc.DAY_C)
        cc.START_TIME = currentDate.format('YYYY-MM-DD') + ' ' + cc.START_TIME
        // if (index >= 1) {
        //   console.log(dayjs(arr[index-1].ARRIVE_TIME.split(' ')[1], 'HH:mm:ss'), cc.ARRIVE_TIME)
        // }
        currentDate = currentDate.add(dayCounter, 'day')
        cc.ARRIVE_TIME = currentDate.format('YYYY-MM-DD') + ' ' + cc.ARRIVE_TIME
      })
      return parsed
    },
    /*获取交路图数据*/
    getData () {
      // // console.log(this.ccList)
      this.trainMap = [];
      // var start = this.jlrqfw[0].replace(/-/g, "");
      // var end = this.jlrqfw[1].replace(/-/g, "");
      // let payload = {
      //   module: 'execute',
      //   c: 'kydp_ggy2027',
      //   s: {
      //     ROUTE_ID: this.jlId,
      //     START_TIME: start,
      //     END_TIME: end,
      //   }
      // }
      // .then(
      //   (r) => {
      //     this.renderMap(this.generateRunningMap(r));
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
      C.getData( {
				url: "https://10.192.126.203/GeneralProServlet", //接口地址
        c: 'kydp_ggy2027',
        s: [[this.jlId], [this.jlId]]
      }, ( res ) => {
        this.renderMap( this.generateRunningMap( this.resTransform(res.data) ) )
      } )
      // this.Service.jlpb
      // .getYxtNew({
      //   s: {
      //     ROUTE_ID: this.jlId,
      //     START_TIME: start,
      //     END_TIME: end,
      //   },
      // })
      // .then(
      //   (r) => {
      //     this.renderMap(this.generateRunningMap(r));
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    },
  },
};
</script>

<style scoped></style>
