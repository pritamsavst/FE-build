import React, { Component } from "react";
import { Doughnut, Bar, HorizontalBar, Line, Pie } from 'react-chartjs-2';
import CardContent from '@material-ui/core/CardContent';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" ;
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import './pension.css';

class RetiredStatusDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            checkData : [],
          graphOneData : [[], []],
          graphTwoData : [[], []],
          graphClicked: -1,
          rowData: [],
          columnData: [],
          // Feature Table
          toggleColumnCheck: false,
          unchangeColumnData: []
        }
      }
    
    
        // PDF function 
        pdfDownload = (e) => {
    
        debugger;
        e.preventDefault();
        var columnData = this.state.unchangeColumnData
        // var columnDataCamelize = this.state.columnData
        var rowData = this.state.rowData
    
        var group = columnData.reduce((r, a) => {
            r[a["show"]] = [...r[a["show"]] || [], a];
            return r;
            }, {});
    
        columnData = group["true"]
        var tableColumnData = []
        var tableColumnDataCamel = []
        for(var i=0; i<columnData.length; i++){
            tableColumnData.push(columnData[i]["accessor"]);
            // tableColumnDataCamel.push(columnDataCamelize[i]["accessor"])
        }
    
        var tableRowData = [];
        for(var i=0; i<rowData.length; i++){
            var rowItem = [];
            for(var j=0; j<tableColumnData.length; j++){
                const demo1 = rowData[i]
                var demo2 = tableColumnData[j].replace(".", ",");
                demo2 = demo2.split(",")
                if(typeof(demo2) === "object"){   
                    if(demo2.length > 1){
                        rowItem.push(rowData[i][demo2[0]][demo2[1]]);
                    }
                    else{
                        rowItem.push(rowData[i][demo2]);
                    }
                }else{
                    rowItem.push(rowData[i][demo2]);
                }
            }
            tableRowData.push(rowItem);
        }
    
        var tableRowDataFinal = []
        for(var i=0; i<tableRowData.length; i++){
            tableRowDataFinal.push(tableRowData[i]);
        }
    
    
        debugger;
        // PDF Code 
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);
    
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    
        doc.text("mChandigarh Application", pageWidth / 2, 20, 'center');
    
        doc.setFontSize(10);
        const pdfTitle = "Pension Dashboard"
        doc.text(pdfTitle, pageWidth / 2, 40, 'center');
    
        doc.autoTable({ html: '#my-table' });
        doc.setFontSize(5);
    
        doc.autoTable({
            // head: [tableColumnDataCamel],
            head: [tableColumnData],
            theme: "striped",
            styles: {
                fontSize: 7,
            },
            body:tableRowData
        });
    
        doc.save(pdfTitle+".pdf");
    
        }
    
        // Column Unchange Data
        columnUnchange=(e)=>{
            debugger;
            const coldata = e;
            var unchangeData = [];
            for(var i=0;i<coldata.length; i++){
                if(coldata[i]["show"]){
                    unchangeData.push(coldata[i])
                }   
            }
            return unchangeData
    
        }
        // Hide / Show Column
        showHideColumn = (e) => {
            e.preventDefault();
            debugger;
            var sortColumn = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
            const removeIndex = parseInt(e.target.value);
            // sortColumn.splice(removeIndex, 1)
            sortColumn[removeIndex]["show"] = !(sortColumn[removeIndex]["show"]);
    
            var sortColumn2 = JSON.parse(JSON.stringify(this.state.unchangeColumnData));
            const removeIndex2 = parseInt(e.target.value);
            // sortColumn.splice(removeIndex, 1)
            sortColumn2[removeIndex2]["show"] = !(sortColumn2[removeIndex2]["show"])
    
            this.setState({
                columnData: sortColumn,
                unchangeColumnData: sortColumn2
            })
        }
    
        // Toggle Column 
        toggleColumn = (e) => {
            e.preventDefault();
            debugger;
            const data = this.state.columnData
            this.setState({
                toggleColumnCheck : !this.state.toggleColumnCheck
            })
        }
        
        graphSorting = ( sortBy, data, checkGraph ) => {
            debugger;
            var graphOneLabel = []; var graphOneData = []; var group = [];
            var monthJSON = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",
            7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"};
  
            if(checkGraph === "dashboard1"){
  
              // Code for X Axis
              var fromDate = new Date(1596220200000);
              var toDate = new Date(1615660200000);
              var months;
              months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
              months -= fromDate.getMonth();
              months += toDate.getMonth();
              var fromDtstartMonth = fromDate.getMonth();
              var loopForMonth = Object.keys(monthJSON);
              var monthDataFound = {};
              for(var i=0; i<=months; i++){
                  var mth = monthJSON[fromDtstartMonth];
                  if(fromDtstartMonth === 11){
                      fromDtstartMonth = 0
                  }else{
                      fromDtstartMonth = fromDtstartMonth + 1;
                  }
                  monthDataFound[fromDtstartMonth] = []
                  graphOneLabel.push(mth);
              }
  
  
              debugger;
              // Code for Y Axis Data
              var bar1 =[];
              var group = data.employeeToBeRetired[0].reportData.reduce((r, a) => {
              r[monthJSON[parseInt(new Date(a[4]).getMonth())]+"-"+parseInt(new Date(a[4]).getFullYear())] = [...r[monthJSON[parseInt(new Date(a[4]).getMonth())]+"-"+parseInt(new Date(a[4]).getFullYear())] || [], a];
              return r;
              }, {});
  
              graphOneLabel = Object.keys(group);
              for(var i=0; i<graphOneLabel.length; i++){
                  bar1.push(group[graphOneLabel[i]].length);
              }
  
              debugger;
              var bar2 =[];
              var SecondBarData = [];
              var regularNormalPension = data.regularNormalPension[0].reportData;
              var deathOfEmployee = data.deathOfEmployee[0].reportData;
              var deathOfPensioner = data.deathOfPensioner[0].reportData;
  
              var group1 = regularNormalPension.reduce((r, a) => {
                  r[monthJSON[parseInt(new Date(a[2]).getMonth())]+"-"+parseInt(new Date(a[2]).getFullYear())] = [...r[monthJSON[parseInt(new Date(a[4]).getMonth())]+"-"+parseInt(new Date(a[4]).getFullYear())] || [], a];
                  return r;
                  }, {});
              var group2 = deathOfEmployee.reduce((r, a) => {
                  r[monthJSON[parseInt(new Date(a[2]).getMonth())]+"-"+parseInt(new Date(a[2]).getFullYear())] = [...r[monthJSON[parseInt(new Date(a[4]).getMonth())]+"-"+parseInt(new Date(a[4]).getFullYear())] || [], a];
                  return r;
                  }, {});
              var group3 = deathOfPensioner.reduce((r, a) => {
                  r[monthJSON[parseInt(new Date(a[2]).getMonth())]+"-"+parseInt(new Date(a[2]).getFullYear())] = [...r[monthJSON[parseInt(new Date(a[4]).getMonth())]+"-"+parseInt(new Date(a[4]).getFullYear())] || [], a];
                  return r;
                  }, {});
  
              for(var i=0; i<graphOneLabel.length; i++){
                  bar2[i] = group1[graphOneLabel[i]] ? group1[graphOneLabel[i]].length : 0 
                  + group2[graphOneLabel[i]] ? group2[graphOneLabel[i]].length : 0
                   + group3[graphOneLabel[i]] ? group3[graphOneLabel[i]].length : 0
              }
  
              graphOneData.push(bar1);
              graphOneData.push(bar2);
  
              var groupData = [];
              groupData.push(group);
              groupData.push(group1);
              groupData.push(group2);
              groupData.push(group3);
  
              return [ graphOneLabel, graphOneData, groupData ];
            }
            if(checkGraph === "status"){
              debugger;
              var sortNo = null;
              var group = data.reduce((r, a) => {
                  r[a[3]] = [...r[a[3]] || [], a];
                  return r;
                  }, {});
          
              var graphOneLabel = Object.keys(group);
              var graphOneData = []
              for(var i=0; i<Object.keys(group).length ; i++){
                  graphOneData.push(group[graphOneLabel[i]].length);
              }
  
              // Table contain Emp to be retire data
              var rowData = data;
              var columnData = [];
              var hardCol = ["EMP Code", "Name", "Date", "Status"];
  
              data.forEach(function(a) {
                  a[2] = new Date(a[2]).getFullYear()+"-"+new Date(a[2]).getMonth()+"-"+new Date(a[2]).getDate()
              });
  
              for(var i=0; i<hardCol.length; i++){
                  var item = {};
                  item["Header"] = hardCol[i];
                  item["id"] = i;
                  item["accessor"] = i.toString();
                  item["show"] = true;
                  columnData.push(item)
              }
  
              this.setState({
                  rowData : rowData,
                  columnData : columnData,
                  unchangeColumnData : columnData
              })
  
              return [ graphOneLabel, graphOneData, group ];
  
            }else{
              debugger;
              var sortNo = null;
              var group = data.reduce((r, a) => {
                  r[a[sortBy]] = [...r[a[sortBy]] || [], a];
                  return r;
                  }, {});
          
              var graphOneLabel = Object.keys(group);
              var graphOneData = []
              for(var i=0; i<Object.keys(group).length ; i++){
                  graphOneData.push(group[graphOneLabel[i]].length);
              }
              return [ graphOneLabel, graphOneData, group ];
            }
        }
    
        // CamelCase Column Name 
        camelize = (str) =>  {
        // var res = str.substr(0, 1);
        var res = String(str).substr(0, 1);
        str = str.replaceAll("_", " ")
        return str.replace(res, function(res)
        {
        return res.toUpperCase();
        });
        }
        
        dateRange = (startDate, endDate) => {
          var monthJSON = {"01":"JAN","02":"FEB","03":"MAR","04":"APR","05":"MAY","06":"JUN","07":"JUL",
          "08":"AUG","09":"SEP","10":"OCT","11":"NOV","12":"DEC"};
          var start      = startDate.split('-');
          var end        = endDate.split('-');
          var startYear  = parseInt(start[0]);
          var endYear    = parseInt(end[0]);
          var dates      = [];
  
          for(var i = startYear; i <= endYear; i++) {
          var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
          var startMon = i === startYear ? parseInt(start[1])-1 : 0;
          for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
          var month = j+1;
          var displayMonth = month < 10 ? '0'+month : month;
          // dates.push([i, displayMonth, '01'].join('-'));
          dates.push([i, monthJSON[displayMonth]].join('-'));
          }
          }
          return dates;
      }
  
          dateTimeToForma = (frommDT, toDT) => {
              var dt1 = new Date(frommDT); 
              var dateCnt = dt1.getDate() < 10 ? "0"+dt1.getDate() : dt1.getDate();
              var month = dt1.getMonth() < 10 ? "0"+(dt1.getMonth()+1) : dt1.getMonth()+1;
              var year = dt1.getFullYear();
              dt1 = year+"-"+month+"-"+dateCnt
              var dt2 = new Date(toDT);
              dateCnt = dt2.getDate() < 10 ? "0"+dt2.getDate() : dt2.getDate();
              month = dt2.getMonth() < 10 ? "0"+(dt2.getMonth()+1) : dt2.getMonth()+1;
              year = dt2.getFullYear();
              dt2 = year+"-"+month+"-"+dateCnt
  
  
              return [dt1, dt2]
          }
  
        componentDidMount(){
            debugger;
            const propsData = this.props.data;
            if(propsData.length>0 && JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){

                const data = this.props.data;
                var fromDt = this.props.data[0].criteria.fromDt;
                var toDt = this.props.data[0].criteria.toDt;
        
                var dates = this.dateTimeToForma(fromDt, toDt);
                var dateRange = this.dateRange(dates[0], dates[1]);
        
                var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
                "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
        
                debugger;
                var empRetired =[];
                var groupEmpRetired = this.props.data[0].employeeTobeRetired.reduce((r, a) => {
                    r[new Date(a[3]).getFullYear()+"-"+monthJSON[new Date(a[3]).getMonth()]] 
                    = [...r[new Date(a[3]).getFullYear()+"-"+monthJSON[new Date(a[3]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                var regularPension = [];
                var groupRegularPension = this.props.data[0].regularPension.reduce((r, a) => {
                    r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] 
                    = [...r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                var deathOfEmp = [];
                var groupDeathofEmp = this.props.data[0].deathofEmplyee.reduce((r, a) => {
                    r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] 
                    = [...r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                var deathofPensionerr = [];
                var groupDeathOfPensioner = this.props.data[0].deathofPensioner.reduce((r, a) => {
                    r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] 
                    = [...r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                //All Data combination operation
                debugger;
                var processApplicationSUM = [];
                for(var i=0; i<dateRange.length; i++){
                    processApplicationSUM.push(0);
                }
                for(var i=0; i<dateRange.length; i++){
                    if(groupRegularPension[dateRange[i]]){
                        // empRetired.push(groupRegularPension[dateRange[i]].length);
                        processApplicationSUM[i] = processApplicationSUM[i] + groupRegularPension[dateRange[i]].length;
                    }else{
                        processApplicationSUM[i] = processApplicationSUM[i] + 0;
                        // empRetired.push(0);
                    }
        
                    if(groupDeathofEmp[dateRange[i]]){
                        processApplicationSUM[i] = processApplicationSUM[i] + groupDeathofEmp[dateRange[i]].length;
                        // empRetired.push(groupDeathofEmp[dateRange[i]].length);
                    }else{
                        // empRetired.push(0);
                        processApplicationSUM[i] = processApplicationSUM[i] + 0;
                    }
        
                    if(groupDeathOfPensioner[dateRange[i]]){
                        processApplicationSUM[i] = processApplicationSUM[i] + groupDeathOfPensioner[dateRange[i]].length;
                    }else{
                        processApplicationSUM[i] = processApplicationSUM[i] + 0;
                    }
                }
        
                debugger;
                var graphOneData = [];
                for(var i=0; i<dateRange.length; i++){
                    if(groupEmpRetired[dateRange[i]]){
                        empRetired.push(groupEmpRetired[dateRange[i]].length);
                    }else{
                        empRetired.push(0);
                    }
                }
        
                var applicationProcessData = [groupRegularPension, groupDeathofEmp, groupDeathOfPensioner];
        
                // Table contain Emp to be retire data
                var rowData = this.props.data[0].employeeTobeRetired;
                var columnData = [];
        
                for(var i=0; i<Object.keys(this.props.data[0]["reportHeader"]).length; i++){
                    var item = {};
                    item["Header"] = Object.values(this.props.data[0]["reportHeader"])[i]["label"];
                    item["id"] = i;
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnData.push(item)
                }
        
                this.setState({
                    graphOneData : [empRetired, processApplicationSUM],
                    graphOneLabel : dateRange,
                    rowData: rowData,
                    graphClicked: 0,
                    columnData: columnData,
                    unchangeColumnData: columnData,
                    applicationProcessData : applicationProcessData
                })

                this.setState({
                    checkData : this.props.data
                })
            } 
          
        }

        componentDidUpdate(){
            debugger;
            const propsData = this.props.data;
            if(JSON.stringify(propsData) !== JSON.stringify(this.state.checkData)){

                const data = this.props.data;
                var fromDt = this.props.data[0].criteria.fromDt;
                var toDt = this.props.data[0].criteria.toDt;
        
                var dates = this.dateTimeToForma(fromDt, toDt);
                var dateRange = this.dateRange(dates[0], dates[1]);
        
                var monthJSON = {"0":"JAN","1":"FEB","2":"MAR","3":"APR","4":"MAY","5":"JUN","6":"JUL",
                "7":"AUG","8":"SEP","9":"OCT","10":"NOV","11":"DEC"};
        
                debugger;
                var empRetired =[];
                var groupEmpRetired = this.props.data[0].employeeTobeRetired.reduce((r, a) => {
                    r[new Date(a[3]).getFullYear()+"-"+monthJSON[new Date(a[3]).getMonth()]] 
                    = [...r[new Date(a[3]).getFullYear()+"-"+monthJSON[new Date(a[3]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                var regularPension = [];
                var groupRegularPension = this.props.data[0].regularPension.reduce((r, a) => {
                    r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] 
                    = [...r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                var deathOfEmp = [];
                var groupDeathofEmp = this.props.data[0].deathofEmplyee.reduce((r, a) => {
                    r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] 
                    = [...r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                var deathofPensionerr = [];
                var groupDeathOfPensioner = this.props.data[0].deathofPensioner.reduce((r, a) => {
                    r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] 
                    = [...r[new Date(a[2]).getFullYear()+"-"+monthJSON[new Date(a[2]).getMonth()]] || [], a];
                    return r;
                    }, {});
        
                //All Data combination operation
                debugger;
                var processApplicationSUM = [];
                for(var i=0; i<dateRange.length; i++){
                    processApplicationSUM.push(0);
                }
                for(var i=0; i<dateRange.length; i++){
                    if(groupRegularPension[dateRange[i]]){
                        // empRetired.push(groupRegularPension[dateRange[i]].length);
                        processApplicationSUM[i] = processApplicationSUM[i] + groupRegularPension[dateRange[i]].length;
                    }else{
                        processApplicationSUM[i] = processApplicationSUM[i] + 0;
                        // empRetired.push(0);
                    }
        
                    if(groupDeathofEmp[dateRange[i]]){
                        processApplicationSUM[i] = processApplicationSUM[i] + groupDeathofEmp[dateRange[i]].length;
                        // empRetired.push(groupDeathofEmp[dateRange[i]].length);
                    }else{
                        // empRetired.push(0);
                        processApplicationSUM[i] = processApplicationSUM[i] + 0;
                    }
        
                    if(groupDeathOfPensioner[dateRange[i]]){
                        processApplicationSUM[i] = processApplicationSUM[i] + groupDeathOfPensioner[dateRange[i]].length;
                    }else{
                        processApplicationSUM[i] = processApplicationSUM[i] + 0;
                    }
                }
        
                debugger;
                var graphOneData = [];
                for(var i=0; i<dateRange.length; i++){
                    if(groupEmpRetired[dateRange[i]]){
                        empRetired.push(groupEmpRetired[dateRange[i]].length);
                    }else{
                        empRetired.push(0);
                    }
                }
        
                var applicationProcessData = [groupRegularPension, groupDeathofEmp, groupDeathOfPensioner];
        
                // Table contain Emp to be retire data
                var rowData = this.props.data[0].employeeTobeRetired;
                var columnData = [];
        
                for(var i=0; i<Object.keys(this.props.data[0]["reportHeader"]).length; i++){
                    var item = {};
                    item["Header"] = Object.values(this.props.data[0]["reportHeader"])[i]["label"];
                    item["id"] = i;
                    item["accessor"] = i.toString();
                    item["show"] = true;
                    columnData.push(item)
                }
        
                this.setState({
                    graphOneData : [empRetired, processApplicationSUM],
                    graphOneLabel : dateRange,
                    rowData: rowData,
                    columnData: columnData,
                    graphClicked : 0,
                    unchangeColumnData: columnData,
                    applicationProcessData : applicationProcessData
                })

                this.setState({
                    checkData : this.props.data
                })
            } 
          
        }
    
        render() {
          // First Double Bar Graph Graph
          var graphOneSortedData = {
              labels: this.state.graphOneLabel,
              // labels: ["Label1", "Label2","Label3","Label4","Label5","Label6","Label7","Label8","Label9","Label10","Label11", "Label12"],
              datasets: [
                  {
                  label: "Employee To Be Retired",
                  fill: false,
                  lineTension: 0.1,
                  hoverBorderWidth : 12,
                  // backgroundColor : this.state.colorRandom,
                  backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                  borderColor: "rgba(75,192,192,0.4)",
                  borderCapStyle: "butt",
                  barPercentage: 2,
                  borderWidth: 5,
                  barThickness: 25,
                  maxBarThickness: 10,
                  minBarLength: 2,
                  data: this.state.graphOneData[0]
                  // data:[10,20]
                  },
                  {
                  label: "Pension Application Processed",
                  fill: false,
                  lineTension: 0.1,
                  hoverBorderWidth : 12,
                  // backgroundColor : this.state.colorRandom,
                  backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                  borderColor: "rgba(75,192,192,0.4)",
                  borderCapStyle: "butt",
                  barPercentage: 2,
                  borderWidth: 5,
                  barThickness: 25,
                  maxBarThickness: 10,
                  minBarLength: 2,
                  data: this.state.graphOneData[1]
                  // data:[20, 50]
                  }
              ]
          }
  
          var graphOneOption = {
              responsive : true,
              // aspectRatio : 3,
              maintainAspectRatio: false,
              cutoutPercentage : 0,
              datasets : [
                  {
                  backgroundColor : "rgba(0, 0, 0, 0.1)",
                  weight: 0
                  }
              ], 
              legend: {
                  display: false,
                  position: 'bottom',
                  labels: {
                  fontFamily: "Comic Sans MS",
                  boxWidth: 20,
                  boxHeight: 2
                  }
              },
              tooltips: {
                  enabled: true
              },
              title: {
                  display: true,
                  text: "Monthwise Employees to be Retired and Pension application processed"
              },
              scales: {
                  xAxes: [{
                      gridLines: {
                          display:true
                      },
                      scaleLabel: {
                          display: true,
                          labelString: "Month"
                          }, 
                  }],
                  yAxes: [{
                      gridLines: {
                          display:true
                      },
                      ticks: {
                          suggestedMin: 0,
                          // suggestedMax: 100,
                          // stepSize: 1
                      },
                      scaleLabel: {
                          display: true,
                          labelString: "No of Application"
                          }, 
                  }]
              },
              plugins: {
                  datalabels: {
                      display: false
                  //     color: 'white',
                  //     backgroundColor: 'grey',
                  //     labels: {
                  //         title: {
                  //             font: {
                  //                 weight: 'bold'
                  //             }
                  //         }
                  //     }}
                  }
              },
              onClick: (e, element) => {
                  if (element.length > 0) {
                      
                      debugger;
                      var ind = element[0]._index;   
                      const selectedVal = this.state.graphOneLabel[ind];
                      const data = this.state.applicationProcessData;
                      var selectedData = [];
                      for(var i=0; i<data.length; i++){
                          for(var j=0; j<Object.keys(data[i]).length; j++){
                              if(selectedVal === Object.keys(data[i])[j] ){
                                  selectedData = selectedData.concat(Object.values(data[i])[j])
                              }
                          }
                      }
                      var graphData = this.graphSorting( "status", selectedData, "status" );
  
                      this.setState({
                          graphTwoLabel: graphData[0],
                          graphTwoData: graphData[1],
                          dataTwo: graphData[2],
                          graphClicked: 1,
                        //   rowData: this.state.selectedData
                      })
                      
                  }
              },
          }
  
          // First Double Bar Graph Graph
          var graphTwoSortedData = {
              labels: this.state.graphTwoLabel,
              // labels: ["Label1", "Label2","Label3","Label4","Label5","Label6","Label7","Label8","Label9","Label10","Label11", "Label12"],
              datasets: [
                  {
                  label: "Application",
                  fill: false,
                  lineTension: 0.1,
                  hoverBorderWidth : 12,
                  // backgroundColor : this.state.colorRandom,
                  backgroundColor : ["#F77C15", "#385BC8", "", "#FFC300", "#348AE4", "#FF5733", "#9DC4E1", "#3A3B7F", "", "", "", "", "", ""],
                  borderColor: "rgba(75,192,192,0.4)",
                  borderCapStyle: "butt",
                  barPercentage: 2,
                  borderWidth: 5,
                  barThickness: 25,
                  maxBarThickness: 10,
                  minBarLength: 2,
                  data: this.state.graphTwoData
                  // data:[20, 50]
                  }
              ]
          }
  
          var graphTwoOption = {
              responsive : true,
              // aspectRatio : 3,
              maintainAspectRatio: false,
              cutoutPercentage : 0,
              datasets : [
                  {
                  backgroundColor : "rgba(0, 0, 0, 0.1)",
                  weight: 0
                  }
              ], 
              legend: {
                  display: false,
                  position: 'bottom',
                  labels: {
                  fontFamily: "Comic Sans MS",
                  boxWidth: 20,
                  boxHeight: 2
                  }
              },
              tooltips: {
                  enabled: true
              },
              title: {
                  display: true,
                  text: "Statuswise Application to be process for Retire"
              },
              scales: {
                  xAxes: [{
                      gridLines: {
                          display:true
                      },
                      scaleLabel: {
                          display: true,
                          labelString: "Status of Application"
                          }, 
                  }],
                  yAxes: [{
                      gridLines: {
                          display:true
                      },
                      ticks: {
                          suggestedMin: 0,
                          // suggestedMax: 100,
                          // stepSize: 1
                      },
                      scaleLabel: {
                          display: true,
                          labelString: "No of Application"
                          }, 
                  }]
              },
              plugins: {
                  datalabels: {
                      display: false
                  //     color: 'white',
                  //     backgroundColor: 'grey',
                  //     labels: {
                  //         title: {
                  //             font: {
                  //                 weight: 'bold'
                  //             }
                  //         }
                  //     }}
                  }
              },
              onClick: (e, element) => {
                  if (element.length > 0) {
                      
                      debugger;
                      var ind = element[0]._index;   
                      const selectedVal = this.state.graphOneLabel[ind];
  
                      // var graphData = this.graphSorting( "", data, "dashboard1" );
  
                      this.setState({
                          // graphTwoLabel: graphSorting[0],
                          // graphTwoData: graphSorting[1],
                          // dataTwo: graphSorting[2],
                          // graphClicked: 1,
                          // rowData: this.state.dataOne[selectedVal]
                      })
                      
                  }
              },
          }
            
        return (
            <div style={this.state.rowData.length === 0 ? {display  : "none"} : null}>
            <div className="graphDashboardFlex">
            
            {
                this.state.graphClicked >= 0 ?
            <CardContent className="halfGraph">
                <React.Fragment>
                    <Bar
                    data={ graphOneSortedData }
                    options={ graphOneOption } 
                    />
                </React.Fragment>
            </CardContent>
            :null
            }
            {
                this.state.graphClicked > 0 ?
                  <CardContent className="halfGraph">
                      <React.Fragment>
                          <Bar
                          data={ graphTwoSortedData }
                          options={ graphTwoOption } 
                          />
                      </React.Fragment>
                  </CardContent>
                  :null
            }
            </div>
    
            {/* Table Feature  */}
            <div className="tableContainer">
            {
                this.state.unchangeColumnData.length > 0  ? 
                <div className="tableFeature">
                    <div className="columnToggle-Text"> Download As: </div>
                    <button className="columnToggleBtn" onClick={this.pdfDownload}> PDF </button>
    
                    <button className="columnToggleBtn" onClick={this.toggleColumn}> Column Visibility </button>
                </div>
                :null
            }
            {
               this.state.toggleColumnCheck ?
               <div className="columnVisibilityCard">
                <dl>
                    {
                        this.state.unchangeColumnData.map((data, index)=>{
                            return(
                                <ul className={ this.state.unchangeColumnData[index]["show"] ? "" : "toggleBtnClicked" }><button value={index} className={ this.state.unchangeColumnData[index]["show"] ? "toggleBtn" : "toggleBtnClicked" } onClick={ this.showHideColumn }> { this.state.unchangeColumnData[index]["Header"] } </button></ul> 
                            )
                        })
                    }
                </dl>
                </div> 
               : null
            }
    
            {
                this.state.graphClicked >= 0 ?
                <ReactTable id="customReactTable"
                // PaginationComponent={Pagination}
                data={ this.state.rowData }  
                columns={ this.state.columnData }  
                defaultPageSize = {this.state.rowData.length > 10 ? 10 : this.state.rowData.length}
                pageSize={this.state.rowData.length > 10 ? 10 : this.state.rowData.length}  
                pageSizeOptions = {[20,40,60]}  
                /> 
                :null
            }
            </div>
            </div>
        );
        }
}

export default RetiredStatusDashboard;