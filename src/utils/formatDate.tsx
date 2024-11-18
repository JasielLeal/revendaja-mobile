import { format } from 'date-fns';

export function formatDate(dateString: string) {
    const date = new Date(dateString);

    // Aqui formatamos a data no formato desejado (dd/MM/yyyy)
    return format(date, 'dd/MM/yyyy');
}