import React, { useState, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, } from '@tarojs/components';
import { NavBar, } from '@antmjs/vantui';
import dayjs from 'dayjs';
import Time from '@components/Time';
import SelectTime from '@components/SelectTime';
import './index.less';
const env = process.env.TARO_ENV;


const Placeholder = () => {
  const [dayIndex, setDayIndex] = useState(-1);
  const [appointedTime, setAppointedTime] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedHourData, setSelectedHourData] = useState(null);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    document.title = '首页';
  }, []);

  // 获取时间
  const getTime = (data, dataIdex, hourData) => {
    console.log(data, dataIdex, hourData)
    setDayIndex(dataIdex);
    setAppointedTime(data);
    setSelectedHourData(hourData);
    setShowTime(false);
  };

  useDidShow(() => {
  });

  return (
    <View className="home" >
      {
        env != 'h5' && (
          <NavBar
            title="首页"
            renderLeft={null}
          />
        )
      }
      <View class="list">
        <View className="list-item" onClick={() => { setShowTime(true); }} >
          <View className="content">
            <View className="label">选择时间</View>
            <View className="value">{appointedTime}</View>
          </View>
          <View className="right-icon" />
        </View>
      </View>
      <SelectTime selectedHourData={selectedHourData} appointedTime={appointedTime} dayIndex={dayIndex} visible={showTime} callBack={getTime} onClose={() => { setShowTime(false); }} />
      {/* <Time selectedHourData={selectedHourData} visible={showTime} callBack={getTime} onClose={() => { setShowTime(false); }} /> */}

    </View>
  );
};
export default Placeholder;