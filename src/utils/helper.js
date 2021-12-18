import moment from 'moment'
export function formatDate(date, format) {
  if (date) {
    return moment(date).format(format)
  }
  return ''
}
