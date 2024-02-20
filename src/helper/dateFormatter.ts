import moment from "moment";

export const dateFormat = (date: Date, format: 'YYYY-MM-DD' | 'MMMM YYYY' | 'DD MMM' | 'DD') => {
    return moment(date).format(format);

}