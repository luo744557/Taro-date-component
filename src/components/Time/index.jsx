/* eslint-disable no-empty */
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Popup, Image } from '@antmjs/vantui';
import dayjs from 'dayjs';
import closeImg from '@assets/img/cha.png';
import util from '@utils/util';
import './index.less';

const Time = (props) => {
  const { callBack, visible, onClose, addedDay } = props;
  const [dayList, setDayList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(-1);
  const [checkedDay, setCheckedDay] = useState(dayjs().add(0, 'days').format('MM月DD日'));
  const tpaCustomPartnerCode = Taro.getStorageSync('tpaCustomPartnerCode');
  const category = Taro.getStorageSync('category');
  let canCreateNightOrder = false;
  const policyNo = Taro.getStorageSync('policyNo');
  if (policyNo && category) {
    canCreateNightOrder = util.canCreateNightOrder(tpaCustomPartnerCode, category.categoryOneId || '');
  }
  let allTimeList = [
    { value: '0:00-2:00', label: '0:00-2:00', startTime: 0 },
    { value: '2:00-4:00', label: '2:00-4:00', startTime: 2 },
    { value: '4:00-6:00', label: '4:00-6:00', startTime: 4 },
    { value: '6:00-8:00', label: '6:00-8:00', startTime: 6 },
    { value: '8:00-9:00', label: '8:00-9:00', startTime: 8 },

    { value: '9:00-11:00', label: '9:00-11:00', startTime: 9 },
    { value: '11:00-13:00', label: '11:00-13:00', startTime: 11 },
    { value: '13:00-15:00', label: '13:00-15:00', startTime: 13 },
    { value: '15:00-17:00', label: '15:00-17:00', startTime: 15 },
    { value: '17:00-19:00', label: '17:00-19:00', startTime: 17 },
    { value: '18:00-20:00', label: '18:00-20:00', startTime: 18 },
    { value: '20:00-22:00', label: '20:00-22:00', startTime: 20 },
    { value: '22:00-24:00', label: '22:00-24:00', startTime: 22 },
  ];
  let time = [...allTimeList].filter(i => {
    if (canCreateNightOrder) return i.startTime >= 0 && i.startTime <= 22;
    else return i.startTime >= 9 && i.startTime <= 18;
  });
  const ready = (disabledDateRanges) => {
    let temp = [];
    let date = new Date();
    let index = date.getHours();
    setCheckedDay(dayjs().add(addedDay || 0, 'days').format('MM月DD日'));
    for (var i = addedDay; i < 7 + addedDay; i++) {
      let label = dayjs().add(i, 'days').format('MM月DD日');
      if (addedDay === 0) {
        if (i == 0) {
          label = '今天';
        }
        if (i == 1) {
          label = '明天';
        }
        if (i == 2) {
          label = '后天';
        }
      }
      let obj = {
        index: i,
        label: label,
        value: dayjs().add(i, 'days').format('MM月DD日'),
      };
      if (disabledDateRanges.length) {
        obj.disabled = dayjs().add(i, 'days') >= dayjs(disabledDateRanges[0]) && dayjs().add(i, 'days') <= dayjs(disabledDateRanges[1])
      }
      if (i == 0) {
        if (index < 22 && canCreateNightOrder) temp.push(obj);
        else if (index < 19 && !canCreateNightOrder) temp.push(obj);
      } else {
        temp.push(obj);
      }
    }
    if (temp.length > 6 && index >= 0 && index < 22) {
      index = Math.floor(index / 2);
      // time = time.splice(index);
      console.log(temp)
      if (addtionalDay === 0) {
        time = time.filter(i => {
          return i.startTime > date.getHours();
        });
      }
      if (temp[0].disabled) {
        time = []
      }
    }
    if (!canCreateNightOrder && index >= 19 && temp.length > 6) {
      time = [];
    }
    if (temp.length == 6) {
      setCheckedDay(dayjs().add(1, 'days').format('MM月DD日'));
    }
    console.log(temp)
    setDayList(temp);
    setTimeList(time);
  };
  useEffect(() => {
    let disabledDateRanges = ['2025-01-25 00:00:00', '2025-02-05 23:59:59'];  
    ready(disabledDateRanges);
    
  }, []);

  const checkDay = (dataIdex, item) => {
    let data = item;
    if (item.disabled) {
      Taro.showToast({
        title: '日期不可用',
        icon: 'none'
      });
      return;
    }
    if (dataIdex == 0 && dayList.length > 6 && item.value === dayjs().format('MM月DD日')) {
      let date = new Date();
      let index = date.getHours();
      if (index >= 0 && index < 22) {
        index = Math.floor(index / 2);
        // time = time.splice(index);
        time = time.filter(i => {
          return i.startTime > date.getHours();
        });
      }
      if (index >= 19 && !canCreateNightOrder) {
        time = [];
      }
    }
    setCheckedDay(data.value);
    setDayIndex(dataIdex);
    setTimeList(time);
    setHourIndex(-1);
  };
  const checkTime = (index, item) => {
    let data = item;
    let day = checkedDay + ' ' + data.value;
    setHourIndex(index);
    let addtionalDay = Number(tpaCustomPartnerCode || 0) === 3848 ? 2 : 0;
    callBack(day, dayIndex + addtionalDay, item);
  };

  return (
    <Popup
      show={visible}
      onClose={onClose}
      position={'bottom'}
      className="time-pop"
      round
    >
      <View className="pop-warp">
        <View className="stars title-warp">
          <View className="pop-title">
            时间
          </View>
          <Image src={closeImg} onClick={onClose} className="icon-cha" />
        </View>
        <View className="time-warp">
          <View className={`day ${dayList.length > 6 ? 'max-height' : ''}`}>
            {
              dayList.map((item, index) => {
                return (
                  <View
                    key={index}
                    className={`day-item ${dayIndex == index ? 'day-checked' : ''} ${item.disabled ? 'disabled' : ''}`}
                    onClick={() => { checkDay(index, item); }}
                  >
                    {item.label}
                  </View>);
              })
            }
          </View>
          <View className={`hour ${dayList.length > 6 ? 'max-height' : ''}`}>
            {
              timeList.map((item, index) => {
                let timeDom = (
                  <View
                    key={item.startTime}
                    className={`time-item ${hourIndex == index ? 'time-checked' : ''}`}
                    onClick={() => { checkTime(index, item); }}
                  >
                    {item.label}
                    {
                      hourIndex == index ? <View className="checked-img" /> : <View />
                    }
                  </View>
                );
                if (addedDay === 0 && dayList[dayIndex].index === 0 && item.startTime >= 20) timeDom = null;
                return timeDom;
              })
            }
          </View>
        </View>
        <View />
      </View>

    </Popup>
  );
};

export default Time;
