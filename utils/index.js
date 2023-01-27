import moment from "moment";

export const DATE_FORMAT = 'YYYY-MM-DD'

export const checkDateFormat = (value) => {
  return (
    value && moment(value, DATE_FORMAT)
      .format(DATE_FORMAT) === value
  );
}