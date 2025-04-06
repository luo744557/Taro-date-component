import React, { createRef, PureComponent } from 'react';
import { View, Image, Swiper, Textarea } from '@tarojs/components';
import { Popup, Field, Button, Overlay } from '@antmjs/vantui';
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { throttle, formatMonthData, formatWeekData } from './util'
import './index.less'
// import doubleArrow from '../public/double-arrow.svg'

const head = ['日', '一', '二', '三', '四', '五', '六']

class MonthView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentMonthFirstDay: null,
      monthDates: [], // 月日历需要展示的日期 包括前一月 当月 下一月
      currenWeekFirstDay: null,
      weekDates: [], // 周日李需要展示的日期  包括前一周 当周 下一周
      currentDate: '',
      touch: { x: 0, y: 0 },
      translateIndex: 0,
      calendarY: 0, // 于Y轴的位置
      showType: props.showType,
    }
    this.isTouching = false
    this.ref = createRef(null)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { currentDate } = nextProps
    if (currentDate !== prevState.currentDate) {
      const dayjsDate = dayjs(currentDate)
      return {
        ...formatMonthData(dayjsDate),
        ...formatWeekData(dayjsDate),
        currentDate,
      }
    }
    return null
  }

  touchMoveHandle = throttle(e => {
    e.stopPropagation()
    const { disableWeekView } = this.props
    const moveX = e.touches[0].clientX - this.touchStartX
    const moveY = e.touches[0].clientY - this.touchStartY
    console.log(this.ref)
    const calendarW = this.ref.current.offsetWidth
    const calendarH = this.ref.current.offsetHeight
    if (Math.abs(moveX) > Math.abs(moveY)) {
      // 左右滑动
      this.setState({ touch: { x: moveX / calendarW, y: 0 } })
    } else if (!disableWeekView) {
      this.setState({ touch: { x: 0, y: moveY / calendarH } })
    }
    this.props.onTouchMove(e)
  }, 25)

  touchStartHandle = e => {
    e.stopPropagation()
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
    this.isTouching = true
    this.props.onTouchStart(e)
  }

  touchEndHandle = e => {
    e.stopPropagation()
    const { showType } = this.state
    const { disableWeekView } = this.props
    const calendarH = this.ref.current.offsetHeight
    const { touch, translateIndex, currentMonthFirstDay, currenWeekFirstDay } = this.state
    this.f = false
    this.isTouching = false
    const absTouchX = Math.abs(touch.x)
    const absTouchY = Math.abs(touch.y)
    if (absTouchX > absTouchY && absTouchX > 0.15) {
      const isMonthView = showType === 'month'
      const newTranslateIndex = touch.x > 0 ? translateIndex + 1 : translateIndex - 1

      if (isMonthView) {
        // 月视图
        const nextMonthFirstDay = currentMonthFirstDay[touch.x > 0 ? 'subtract' : 'add'](1, 'month')
        const nextMonthStartDay = nextMonthFirstDay.startOf('week')
        const nextMonthEndDay = nextMonthStartDay.add(42, 'day')
        this.setState(
          {
            translateIndex: newTranslateIndex,
            ...formatMonthData(nextMonthFirstDay),
          },
          this.props.onTouchEnd(nextMonthStartDay.valueOf(), nextMonthEndDay.valueOf()),
        )
      } else {
        // 周视图
        const nextWeekFirstDay = currenWeekFirstDay[touch.x > 0 ? 'subtract' : 'add'](1, 'week')
        const nextWeekLastDay = nextWeekFirstDay.add(7, 'day')
        this.setState(
          {
            translateIndex: newTranslateIndex,
            ...formatWeekData(nextWeekFirstDay),
          },
          this.props.onTouchEnd(nextWeekFirstDay.valueOf(), nextWeekLastDay.valueOf()),
        )
      }
    } else if (absTouchY > absTouchX && Math.abs(touch.y * calendarH) > 50) {
      if (disableWeekView) {
        // 禁用周视图
      } else if (touch.y > 0 && showType === 'week') {
        this.setState({ showType: 'month' }, () => {
          const dataArray = this.state.monthDates[1]
          this.props.onToggleShowType({
            showType: this.state.showType,
            startTime: dataArray[0].valueOf(),
            endTime: dataArray[dataArray.length - 1].add(1, 'day').valueOf(),
          })
        })
      } else if (touch.y < 0 && showType === 'month') {
        this.setState({ showType: 'week' }, () => {
          const dataArray = this.state.weekDates[1]
          this.props.onToggleShowType({
            showType: this.state.showType,
            startTime: dataArray[0].valueOf(),
            endTime: dataArray[dataArray.length - 1].add(1, 'day').valueOf(),
          })
        })
      }
    }
    this.setState({ touch: { x: 0, y: 0 } })
  }

  handleMonthToggle = type => {
    const { currentMonthFirstDay, currenWeekFirstDay, showType } = this.state
    const isMonthView = showType === 'month'
    const isPrev = type === 'prev'
    const formatFun = isMonthView ? formatMonthData : formatWeekData
    const operateDate = isMonthView ? currentMonthFirstDay : currenWeekFirstDay
    const updateStateData = formatFun(
      operateDate[isPrev ? 'subtract' : 'add'](1, isMonthView ? 'month' : 'week'),
    )
    this.setState(updateStateData, () => {
      const dataArray = updateStateData[isMonthView ? 'monthDates' : 'weekDates'][1]
      this.props.onTouchEnd(
        dataArray[0].valueOf(),
        dataArray[dataArray.length - 1].add(1, 'day').valueOf(),
      )
    })
  }

  handleDayClick = (date, availableDate) => {
    if (!availableDate) return false;
    this.setState({
      currentDate: date
    });
    this.props.onDateClick(date)
  }

  handleBottomOperate() {}

  render() {
    const {
      monthDates,
      weekDates,
      touch,
      translateIndex,
      calendarY,
      currentMonthFirstDay,
      currenWeekFirstDay,
      showType,
    } = this.state;
    const { currentDate, transitionDuration, markDates, markType, disableWeekView, title, titleShowYear, dateRanges, dayExtraText, showExtraText, disabledDateRanges, renderFooter } = this.props;
    const isMonthView = showType === 'month';
    return (
      <View className="calendar-content">
        <View className={`calendar-header ${title ? 'space-between': ''}`}>
          {title ? <View className='calendar-header-title'>{title}</View> : null}
          <View className="calendar-operate">
            <View className="icon left-icon" onClick={this.handleMonthToggle.bind(this, 'prev')} />
            <View className="calendar-operate-text">
              {titleShowYear ? (isMonthView ? currentMonthFirstDay : currenWeekFirstDay).format('YYYY年') : null}
              {(isMonthView ? currentMonthFirstDay : currenWeekFirstDay).format('MM月')}
              </View>
            <View className="icon date-right-icon" onClick={this.handleMonthToggle.bind(this, 'next')} />
          </View>
        </View>
        
        <View className="calendar-content-head">
          {head.map(i => (
            <View className="head-cell" key={i}>
              {i}
            </View>
          ))}
        </View>

        <View
          className={`calendar-content-warp ${isMonthView ? '' : 'week-mode'}`}
          ref={this.ref}
          onTouchStart={this.touchStartHandle}
          onTouchMove={this.touchMoveHandle}
          onTouchEnd={this.touchEndHandle}
        >
          <View
            style={{
              transform: `translate3d(${-translateIndex * 100}%, 0, 0)`,
            }}
          >
            {(isMonthView ? monthDates : weekDates).map((item, index) => {
              return (
                <View
                  className="month-cell"
                  key={`month-cell-${index}`}
                  style={{
                    transform: `translate3d(${
                      (index - 1 + translateIndex + (this.isTouching ? touch.x : 0)) * 100
                    }%, ${calendarY}px, 0)`,
                    transitionDuration: `${this.isTouching ? 0 : transitionDuration}s`,
                  }}
                >
                  {item.map((date, itemIndex) => {
                    const isCurrentDay = date.isSame(currentDate, 'day');
                    // console.log(date, dayExtraText)
                    const isOtherMonthDay =
                      showType === 'week' ? false : !date.isSame(currentMonthFirstDay, 'month');
                    const isMarkDate = markDates.find(i => date.isSame(i.date, 'day'));
                    const resetMarkType = (isMarkDate && isMarkDate.markType) || markType;
                    const showDotMark = isCurrentDay ? false : isMarkDate && resetMarkType === 'dot';
                    const showCircleMark = isCurrentDay
                      ? false
                      : isMarkDate && resetMarkType === 'circle';
                    let availableDate = true;
                    if (dateRanges.length === 1) availableDate = date >= dateRanges[0];
                    if (dateRanges.length === 2) availableDate = date >= dateRanges[0] && date <= dateRanges[1];
                    const extraText = dayExtraText[dayjs(date).format('YYYY年MM月DD日')] || '';
                    // console.log(disabledDateRanges)
                    if (disabledDateRanges && disabledDateRanges.length) {
                      if (date >= dayjs(disabledDateRanges[0]) && date <= dayjs(disabledDateRanges[1])) {
                        availableDate = false;
                      }
                    }
                    return (
                      <View
                        key={itemIndex}
                        className={`day-cell ${isOtherMonthDay ? 'is-other-month-day' : ''} ${availableDate ? '' : 'disabled-day'}`}
                        onClick={this.handleDayClick.bind(this, date, availableDate)}
                      >
                        <View
                          className={`day-text ${isCurrentDay ? 'current-day' : ''} ${
                            showCircleMark ? 'circle-mark' : ''
                          }`}
                          style={
                            showCircleMark ? { borderColor: isMarkDate.color || '#4378be' } : null
                          }
                        >
                          {date.format('DD')}
                        </View>
                        {showDotMark && (
                          <View
                            className={isMarkDate ? 'dot-mark' : ''}
                            style={{ background: isMarkDate.color || '#4378be' }}
                          />
                        )}
                        {
                          showExtraText && <View className="extra-text">{extraText || ''}</View>
                        }
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </View>
        {disableWeekView ? null : (
          <View className="bottom-operate">
            <Image className={isMonthView ? 'top' : 'down'} src={doubleArrow} />
          </View>
        )}
        {
          renderFooter
        }
      </View>
      
    )
  }
}

MonthView.propTypes = {
  currentDate: PropTypes.string,
  showType: PropTypes.oneOf(['week', 'month']),
  transitionDuration: PropTypes.number,
  onDateClick: PropTypes.function,
  onTouchStart: PropTypes.function,
  onTouchMove: PropTypes.function,
  onTouchEnd: PropTypes.function,
  onToggleShowType: PropTypes.function,
  markType: PropTypes.oneOf(['dot', 'circle']),
  markDates: PropTypes.array, // 特殊标记的日期，dot 点，circle 圆圈，color特殊标记的颜色
  disableWeekView: PropTypes.bool,
  titleShowYear: PropTypes.bool,
  title: PropTypes.string,
  dateRanges: PropTypes.array, // 可选的时间范围
  disabledDateRanges: PropTypes.array, // 不可用时间范围
  dayExtraText: PropTypes.object,
  showExtraText: PropTypes.bool,
  renderFooter: <></>
}

MonthView.defaultProps = {
  currentDate: dayjs().format('YYYY-MM-DD'),
  showType: 'month',
  transitionDuration: 0.3,
  onDateClick: () => {},
  onTouchStart: () => {},
  onTouchMove: () => {},
  onTouchEnd: () => {},
  onToggleShowType: () => {},
  markType: 'dot',
  markDates: [],
  disableWeekView: false,
  titleShowYear: true,
  title: '',
  dateRanges: [],
  disabledDateRanges: [],
  dayExtraText: {},
  showExtraText: true,
  renderFooter: Node,
}

export default MonthView
