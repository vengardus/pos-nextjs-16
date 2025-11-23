import { format, parse } from 'date-fns';

export const formattedLocalDate = (date: Date):Date => {
    const strFormattedLocalDate = format(date, "yyyy-MM-dd HH:mm:ss")
    const dateObject = parse(strFormattedLocalDate, "yyyy-MM-dd HH:mm:ss", new Date());
    return dateObject
}