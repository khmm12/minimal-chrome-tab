import { createSignal } from 'solid-js'
import * as D from 'date-fns/fp'
import { renderHook } from '@test/helpers/solid'
import createTimeMilestones from './createTimeMilestones'

describe('milestones.day', () => {
  it('is present', () => {
    const milestones = renderHook(() => createTimeMilestones({ currentDateTime: new Date() })).result

    expect(milestones).to.haveOwnProperty('day').which.a('number')
  })

  it('reacts to date change', () => {
    const [milestones, setCurrentDateTime] = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.setHours(0, new Date()))

      const milestones = createTimeMilestones({
        get currentDateTime() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    }).result

    expect(() => setCurrentDateTime((value) => D.addHours(2, value))).to.change(() => milestones.day)
  })
})

describe('milestones.month', () => {
  it('is present', () => {
    const milestones = renderHook(() => createTimeMilestones({ currentDateTime: new Date() })).result

    expect(milestones).to.haveOwnProperty('month').which.a('number')
  })

  it('reacts to date change', () => {
    const [milestones, setCurrentDateTime] = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.setDay(0, new Date()))

      const milestones = createTimeMilestones({
        get currentDateTime() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    }).result

    expect(() => setCurrentDateTime((value) => D.addDays(15, value))).to.change(() => milestones.month)
  })
})

describe('milestones.week', () => {
  it('is present', () => {
    const milestones = renderHook(() => createTimeMilestones({ currentDateTime: new Date() })).result

    expect(milestones).to.haveOwnProperty('week').which.a('number')
  })

  it('reacts to date change', () => {
    const [milestones, setCurrentDateTime] = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.startOfWeek(new Date()))

      const milestones = createTimeMilestones({
        get currentDateTime() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    }).result

    expect(() => setCurrentDateTime((value) => D.addDays(2, value))).to.change(() => milestones.week)
  })
})

describe('milestones.year', () => {
  it('is present', () => {
    const milestones = renderHook(() => createTimeMilestones({ currentDateTime: new Date() })).result

    expect(milestones).to.haveOwnProperty('year').which.a('number')
  })

  it('reacts to date change', () => {
    const [milestones, setCurrentDateTime] = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.startOfYear(new Date()))

      const milestones = createTimeMilestones({
        get currentDateTime() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    }).result

    expect(() => setCurrentDateTime((value) => D.addMonths(6, value))).to.change(() => milestones.year)
  })
})

describe('milestones.birthDate', () => {
  it('is not present when birthDate is not provided', () => {
    const milestones = renderHook(() => createTimeMilestones({ currentDateTime: new Date() })).result

    expect(milestones).to.haveOwnProperty('birthDate').which.an('undefined')
  })

  it('is present when birthDate is provided', () => {
    const milestones = renderHook(() =>
      createTimeMilestones({ currentDateTime: new Date(), birthDate: new Date('1970-01-01') }),
    ).result

    expect(milestones).to.haveOwnProperty('birthDate').which.a('number')
  })

  it('reacts to date change', () => {
    const [milestones, setCurrentDateTime] = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.startOfYear(new Date()))

      const milestones = createTimeMilestones({
        get currentDateTime() {
          return currentDateTime()
        },
        get birthDate() {
          return new Date('1970-06-31')
        },
      })

      return [milestones, setCurrentDateTime] as const
    }).result

    expect(() => setCurrentDateTime((value) => D.addMonths(6, value))).to.change(() => milestones.birthDate)
  })
})
