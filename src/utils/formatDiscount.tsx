
export function calculatePercentage(value1: number, value2: number) {
    const total = value1 + value2;
    const percentage = (value2 / total) * 100;

    return {
        percentage,
    };
}