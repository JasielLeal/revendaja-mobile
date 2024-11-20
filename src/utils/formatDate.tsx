import { addHours, format } from 'date-fns';

export function formatDate(dateString: string) {
    const date = new Date(dateString);

    // Adiciona 3 horas à data original
    const adjustedDate = addHours(date, 3);

    // Formata a data no formato desejado (dd/MM/yyyy)
    return format(adjustedDate, 'dd/MM/yyyy');
}
