import months from '../constants/months'

const getDateParts = (timestamp) => {
  const d = new Date(timestamp)
  return {
    date: d.getDate(),
    month: months[d.getMonth()],
    year: d.getFullYear()
  }
}

export default getDateParts
