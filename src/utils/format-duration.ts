export function parseDuration(durationString: string) {
    // Remove the leading '-' if it exists
    durationString = durationString.replace(/^-/, '');

    // Extract hours, minutes, and seconds using regular expressions
    const hoursMatch = durationString.match(/(\d+)h/);
    const minutesMatch = durationString.match(/(\d+)m/);
    const secondsMatch = durationString.match(/(\d+)s/);

    // Extract the numeric values or default to 0 if not found
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

    // Construct the result string
    const result = [];
    if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) result.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

    return result.join(' ');
}