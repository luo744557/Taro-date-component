/* eslint-disable no-empty */
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, } from '@tarojs/components';
import { Popup, Image, } from '@antmjs/vantui';
import dayjs from 'dayjs';
import closeImg from '@assets/img/cha.png';
import util from '@utils/util';
import Calendar from '../Calendar';
import './index.less';

const SelectTime = (props) => {
  const { callBack, visible, onClose, appointedTime, selectedHourData, dayIndex } = props;
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [dayRestTimes, setDayRestTimes] = useState({});
  const [pageConfig, setPageConfig] = useState({});
  const [dateRanges, setDateRanges] = useState([
    dayjs(dayjs().format('YYYY-MM-DD')),
    dayjs(dayjs().add(13, 'day').format('YYYY-MM-DD'))
  ]);
  // const [disabledDateRanges, setDisabledDateRanges] = useState([]);
  const tpaCustomPartnerCode = Taro.getStorageSync('tpaCustomPartnerCode');
  // const category = Taro.getStorageSync('category');
  // const policyNo = Taro.getStorageSync('policyNo');
  const partnerCode = Taro.getStorageSync('partnerCode') || null;
  const selectedWareItem = Taro.getStorageSync('selectedWareItem'); // groupId, groupName: categoryName, sceneCategory: 2,

  const allTimeList = [
    { value: '8:00-12:00', label: '8:00-12:00', startTime: 8, endTime: 12 },
    { value: '12:00-16:00', label: '12:00-16:00', startTime: 12, endTime: 16 },
    { value: '16:00-20:00', label: '16:00-20:00', startTime: 16, endTime: 20 },
  ];
  useEffect(() => {
  }, []);

  useEffect(() => {
    if (visible) {
      console.log('appointedTime', appointedTime, 'dayIndex', dayIndex)
      // let tempDay = typeof appointedTime === 'string' ? dayjs().add(dayIndex, 'days').format('YYYY') + '年' + appointedTime.split(' ')[0] : selectedDay;
      // let dateRangesStart = dateRanges[0];
      // tempDay = tempDay.match(/\d{4}.\d{1,2}.\d{1,2}/mg).toString();
      // tempDay = tempDay.replace(/[^0-9]/mg, '-');
      // if (tempDay) setSelectedDay(dayjs(tempDay).format('YYYY-MM-DD'))
    }
  }, [visible]);

  const ensureSelectTime = (val, type) => {
    // console.log(selectedDay, val, dayjs().format('MM-DD'))
    let dayIndex = dayjs(selectedDay).diff(dayjs().format('YYYY-MM-DD'), 'day', true);
    if (type === 'hour' && selectedDay) callBack && callBack(`${dayjs(selectedDay).format('MM月DD日')} ${val}`, dayIndex, val);
  };

  return (
    <Popup
      show={visible}
      onClose={onClose}
      position={'bottom'}
      className="select-time-pop"
      round
    >
      <View className="pop-warp">
        <View className="stars title-warp">
          <View className="pop-title">
            请选择日期
          </View>
          <Image src={closeImg} onClick={onClose} className="icon-cha" />
        </View>
        <View className="select-warp">
          <View className="day-warp">
            <Calendar
              onDateClick={date => {
                const tempDay = date.format('YYYY-MM-DD');
                setSelectedDay(tempDay);
              }}
              showType={'month'}
              markDates={[
                { date: '2024-5-12', markType: 'circle' },
                { markType: 'dot', date: '2025-4-1' },
                { markType: 'circle', date: '2025-3-31' },
                { date: '2025-3-2' },
              ]}
              markType="dot"

              title="请选择日期"
              // onTouchEnd={(a, b) => console.log(a, b)}
              disableWeekView={true}
              titleShowYear={true}
              currentDate={selectedDay}
              dayExtraText={dayRestTimes}
              showExtraText={true}
              dateRanges={dateRanges}
              disabledDateRanges={[]}
              renderFooter={
                <View className="hour-range-warp">
                  <View className="top-border"></View>
                  <View className="hour-header">请选择上门时间</View>
                  {
                    allTimeList.map((item, index) => {
                      let timeStatus = '';
                      if ((tpaCustomPartnerCode === '2490' && selectedWareItem.groupId && selectedDay === dayjs().add(1, 'days').format('YYYY-MM-DD'))) {
                        if (dayjs().hour() + 4 > item.endTime) {
                          timeStatus = 'disabled';
                        }
                      } else if (selectedDay === dayjs().format('YYYY-MM-DD')) {
                        if (dayjs().hour() > item.endTime) {
                          timeStatus = 'disabled';
                        }
                      }
                      let times = ['上午', '下午', '傍晚'];

                      return (
                        <View
                          key={index}
                          className={`hour-item ${timeStatus} ${index === allTimeList.length - 1 ? 'no-border' : ''}`}
                          onClick={() => {
                            if (timeStatus !== 'disabled') {
                              ensureSelectTime(item.value, 'hour');
                            }
                          }}
                        >
                          <View className="hour-item-content">
                            <View className="hour-item-time">{times[index]}：{item.label}</View>
                          </View>
                          {
                            false ? <View className="checked-img" style={pageConfig.timeSelectedIcon || {}} /> : <View />
                          }
                        </View>
                      );
                    })
                  }
                </View>
              }
            />
          </View>

        </View>
        <View />
      </View>

    </Popup>
  );
};

export default SelectTime;
