import { createSignal, flush } from 'solid-js'
import { renderHook } from '@solidjs/testing-library'
import * as D from 'date-fns/fp'
import toISODate from '@/utils/to-iso-date'
import createTimeMilestones from './createTimeMilestones'

describe('milestones.day', () => {
  it('is present', () => {
    const { result: milestones } = renderHook(() => createTimeMilestones({ now: new Date() }))

    expect(milestones).to.haveOwnProperty('day').which.a('number')
  })

  it('reacts to date change', () => {
    const {
      result: [milestones, setCurrentDateTime],
    } = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.setHours(0, new Date()))

      const milestones = createTimeMilestones({
        get now() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    })

    expect(() => {
      setCurrentDateTime((value) => D.addHours(2, value))
      flush()
    }).to.change(() => milestones.day)
  })
})

describe('milestones.month', () => {
  it('is present', () => {
    const { result: milestones } = renderHook(() => createTimeMilestones({ now: new Date() }))

    expect(milestones).to.haveOwnProperty('month').which.a('number')
  })

  it('reacts to date change', () => {
    const {
      result: [milestones, setCurrentDateTime],
    } = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.setDay(0, new Date()))

      const milestones = createTimeMilestones({
        get now() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    })

    expect(() => {
      setCurrentDateTime((value) => D.addDays(15, value))
      flush()
    }).to.change(() => milestones.month)
  })
})

describe('milestones.week', () => {
  it('is present', () => {
    const { result: milestones } = renderHook(() => createTimeMilestones({ now: new Date() }))

    expect(milestones).to.haveOwnProperty('week').which.a('number')
  })

  it('reacts to date change', () => {
    const {
      result: [milestones, setCurrentDateTime],
    } = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.startOfWeek(new Date()))

      const milestones = createTimeMilestones({
        get now() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    })

    expect(() => {
      setCurrentDateTime((value) => D.addDays(2, value))
      flush()
    }).to.change(() => milestones.week)
  })
})

describe('milestones.year', () => {
  it('is present', () => {
    const { result: milestones } = renderHook(() => createTimeMilestones({ now: new Date() }))

    expect(milestones).to.haveOwnProperty('year').which.a('number')
  })

  it('reacts to date change', () => {
    const {
      result: [milestones, setCurrentDateTime],
    } = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.startOfYear(new Date()))

      const milestones = createTimeMilestones({
        get now() {
          return currentDateTime()
        },
      })

      return [milestones, setCurrentDateTime] as const
    })

    expect(() => {
      setCurrentDateTime((value) => D.addMonths(6, value))
      flush()
    }).to.change(() => milestones.year)
  })
})

describe('milestones.birthday', () => {
  it('is not present when birthdate is not provided', () => {
    const { result: milestones } = renderHook(() => createTimeMilestones({ now: new Date() }))

    expect(milestones).to.haveOwnProperty('birthday').which.an('undefined')
  })

  it('is present when birthdate is provided', () => {
    const { result: milestones } = renderHook(() =>
      createTimeMilestones({ now: new Date(), birthDate: toISODate('1970-01-01') }),
    )

    expect(milestones).to.haveOwnProperty('birthday').which.a('number')
  })

  it('reacts to date change', () => {
    const {
      result: [milestones, setCurrentDateTime],
    } = renderHook(() => {
      const [currentDateTime, setCurrentDateTime] = createSignal(D.startOfYear(new Date()))

      const milestones = createTimeMilestones({
        get now() {
          return currentDateTime()
        },
        get birthDate() {
          return toISODate('1970-06-31')
        },
      })

      return [milestones, setCurrentDateTime] as const
    })

    expect(() => {
      setCurrentDateTime((value) => D.addMonths(6, value))
      flush()
    }).to.change(() => milestones.birthday)
  })
})
