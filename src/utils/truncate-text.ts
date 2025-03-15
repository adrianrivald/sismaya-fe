export function truncate(text: string, slicedNumber = 20) {
    const truncated = text.length > slicedNumber ? `${text.slice(0, slicedNumber - 3)}...` : text;
    return truncated;
}