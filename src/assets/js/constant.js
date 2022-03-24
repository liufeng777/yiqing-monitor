// 性别
export const genderData = {
  0: '未知',
  1: '男',
  2: '女'
}

// 管理员角色
export const adminRoleData = {
  0: '未知',
  1: '督察员',
  2: '操作员',
  3: '配置员',
  9: '管理员'
}

// 用户角色
export const userRoleData = {
  0: '未知',
  1: '非负责人',
  2: '项目负责人',
  3: '区域负责人'
}

// 工程人员角色
export const projectUserRole = {
  0: '未知',
  1: '操作工',
  2: '配置员',
  3: '管理员',
  4: '负责人'
}

// 工程状态
export const projectState = {
  0: '未知',
  1: '未启用',
  2: '启用',
  8: '结束',
  9: '废弃'
}

// 布点状态
export const pointState = {
  0: '未知',
  1: '未启用',
  2: '启用'
}

// 设备类型
export const deviceType = {
  0: '未知',
  1: '半自动',
  2: '全自动',
  3: '机械式'
}

// 设备状态
export const deviceState = {
  0: '未知',
  1: '正常',
  2: '故障',
  9: '废弃'
}

// 通信卡类型
export const cardType = {
  0: '未知',
  1: '中移NB',
  2: '联通NB',
  3: '电信NB'
}

// 通信卡状态
export const cardState = {
  0: '未知',
  1: '未激活',
  2: '正常',
  9: '废弃'
}

// 报警类型
export const warnType = {
  1: '未知',
  2: '正常',
  3: '蚁情',
  4: '入侵',
  5: '低电量',
  9: '其他'
}

// 检查结果
export const inspectResult = {
  0: '未知',
  1: '正常',
  2: '发现蚁情',
  3: '发现蚁情但量不多，需再观察',
  4: '发现蚁情但已撤离，无需灭杀',
  5: '装置异常',
  6: '装置被入侵破坏',
  7: '装置丢失',
  8: '装置被移位',
  9: '其他'
}

// 措施类型
export const measureType = {
  0: '未知',
  1: '无操作',
  2: '简单恢复',
  3: '替换电池',
  4: '替换装置',
  5: '灭蚁',
  6: '推迟灭蚁(再观察)',
  9: '其他'
}

// 产生报警的类型
export const warningType = {
  3: '蚁情',
  4: '入侵',
  5: '低电量',
  9: '其他'
}

// 报警确认结果
export const confirmRes = {
  0: '未知',
  1: '未确认',
  2: '报警正确',
  3: '误报'
}

// 手自动类型
export const detectType = {
  0: '未知',
  1: '手动',
  2: '自动',
}

// 白蚁类型
export const termiteType = {
  0: '未知',
  1: '散白蚁',
  2: '土木白蚁',
  3: '家白蚁',
  9: '其他'
}

// 蚁量
export const termiteAmount = {
  0: '未知',
  1: '少量',
  2: '中量',
  3: '大量'
}

// 柱状图配置
export const barOption = (xData, yData) => {
  return {
    xAxis: {
      type: 'category',
      data: xData,
    },
    yAxis: {
      type: 'value',
      splitNumber: 1,
    },
    color: ['#31EFFF'],
    backgroundColor: '#2B2B2B',
    series: [
      {
        data: yData,
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        }
      }
    ]
  }
}

// 折线图配置
export const lineOption = (xData, yData) => {
  return {
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value',
      splitNumber: 1,
    },
    color: ['#31EFFF'],
    backgroundColor: '#2B2B2B',
    series: [
      {
        data: yData,
        type: 'line',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  };
}

export const styleJson = [{
  "featureType": "land",
  "elementType": "geometry",
  "stylers": {
      "color": "#242f3eff"
  }
}, {
  "featureType": "manmade",
  "elementType": "geometry",
  "stylers": {
      "color": "#242f3eff"
  }
}, {
  "featureType": "water",
  "elementType": "geometry",
  "stylers": {
      "color": "#17263cff"
  }
}, {
  "featureType": "road",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#9e7d60ff"
  }
}, {
  "featureType": "road",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#554631ff"
  }
}, {
  "featureType": "districtlabel",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d69563ff"
  }
}, {
  "featureType": "districtlabel",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#17263cff",
      "weight": 3
  }
}, {
  "featureType": "poilabel",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d69563ff"
  }
}, {
  "featureType": "poilabel",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#17263cff",
      "weight": 3
  }
}, {
  "featureType": "subway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "railway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "poilabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "subwaylabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "subwaylabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "tertiarywaysign",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "tertiarywaysign",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "provincialwaysign",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "provincialwaysign",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "nationalwaysign",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "nationalwaysign",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "highwaysign",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "highwaysign",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "green",
  "elementType": "geometry",
  "stylers": {
      "color": "#263b3eff"
  }
}, {
  "featureType": "nationalwaysign",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d0021bff"
  }
}, {
  "featureType": "nationalwaysign",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#ffffffff"
  }
}, {
  "featureType": "city",
  "elementType": "labels",
  "stylers": {
      "visibility": "on"
  }
}, {
  "featureType": "city",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "city",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d69563ff"
  }
}, {
  "featureType": "city",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#17263cff"
  }
}, {
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d69563ff"
  }
}, {
  "featureType": "water",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#242f3eff"
  }
}, {
  "featureType": "local",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#38414eff"
  }
}, {
  "featureType": "local",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#ffffff00"
  }
}, {
  "featureType": "fourlevelway",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#38414eff"
  }
}, {
  "featureType": "fourlevelway",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#ffffff00"
  }
}, {
  "featureType": "tertiaryway",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#38414eff"
  }
}, {
  "featureType": "tertiaryway",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#ffffff00"
  }
}, {
  "featureType": "tertiaryway",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "fourlevelway",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "highway",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#9e7d60ff"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#554631ff"
  }
}, {
  "featureType": "provincialway",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#9e7d60ff"
  }
}, {
  "featureType": "provincialway",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#554631ff"
  }
}, {
  "featureType": "tertiaryway",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "fourlevelway",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "highway",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#9e7d60ff"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#554631ff"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#9e7d60ff"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#554631ff"
  }
}, {
  "featureType": "arterial",
  "elementType": "geometry.fill",
  "stylers": {
      "color": "#9e7d60ff"
  }
}, {
  "featureType": "arterial",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#554631fa"
  }
}, {
  "featureType": "medicallabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "medicallabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "entertainmentlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "entertainmentlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "estatelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "estatelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "businesstowerlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "businesstowerlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "companylabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "companylabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "governmentlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "governmentlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "restaurantlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "restaurantlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "hotellabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "hotellabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "shoppinglabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "shoppinglabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "lifeservicelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "lifeservicelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "carservicelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "carservicelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "financelabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "financelabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "otherlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "otherlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "airportlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "on"
  }
}, {
  "featureType": "airportlabel",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d69563ff"
  }
}, {
  "featureType": "airportlabel",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#17263cff"
  }
}, {
  "featureType": "airportlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "highway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "highway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "highway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "highway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "highway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "highway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "nationalway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "nationalway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "nationalway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "nationalway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "nationalway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "nationalway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "nationalway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "highway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "highway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "highway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "highway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "highway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "provincialway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "8,9",
      "level": "8"
  }
}, {
  "featureType": "provincialway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "8,9",
      "level": "9"
  }
}, {
  "featureType": "provincialway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "8,9",
      "level": "8"
  }
}, {
  "featureType": "provincialway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "8,9",
      "level": "9"
  }
}, {
  "featureType": "provincialway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "8,9",
      "level": "8"
  }
}, {
  "featureType": "provincialway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "8,9",
      "level": "9"
  }
}, {
  "featureType": "cityhighway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "cityhighway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "cityhighway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "cityhighway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "cityhighway",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "6"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "7"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "8"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "9"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "6,10",
      "level": "10"
  }
}, {
  "featureType": "arterial",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "9,10",
      "level": "9"
  }
}, {
  "featureType": "arterial",
  "stylers": {
      "curZoomRegionId": "0",
      "curZoomRegion": "9,10",
      "level": "10"
  }
}, {
  "featureType": "arterial",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "9,10",
      "level": "9"
  }
}, {
  "featureType": "arterial",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "9,10",
      "level": "10"
  }
}, {
  "featureType": "arterial",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "9,10",
      "level": "9"
  }
}, {
  "featureType": "arterial",
  "elementType": "labels",
  "stylers": {
      "visibility": "off",
      "curZoomRegionId": "0",
      "curZoomRegion": "9,10",
      "level": "10"
  }
}, {
  "featureType": "building",
  "elementType": "geometry.topfill",
  "stylers": {
      "color": "#2a3341ff"
  }
}, {
  "featureType": "building",
  "elementType": "geometry.sidefill",
  "stylers": {
      "color": "#313b4cff"
  }
}, {
  "featureType": "building",
  "elementType": "geometry.stroke",
  "stylers": {
      "color": "#1a212eff"
  }
}, {
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "road",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "provincialway",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "arterial",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#759879ff"
  }
}, {
  "featureType": "provincialway",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "cityhighway",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "arterial",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#1a2e1cff"
  }
}, {
  "featureType": "local",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "manmade",
  "elementType": "labels.text.fill",
  "stylers": {
      "color": "#d69563ff"
  }
}, {
  "featureType": "manmade",
  "elementType": "labels.text.stroke",
  "stylers": {
      "color": "#17263cff"
  }
}, {
  "featureType": "subwaystation",
  "elementType": "geometry",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "transportationlabel",
  "elementType": "labels.icon",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "transportationlabel",
  "elementType": "labels",
  "stylers": {
      "visibility": "off"
  }
}, {
  "featureType": "estate",
  "elementType": "geometry",
  "stylers": {
      "color": "#2a3341ff"
  }
}]