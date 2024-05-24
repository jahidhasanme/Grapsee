const calculateTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    const timeDifferenceInSeconds = Math.floor((currentDate - createdDate) / 1000)

    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;
    const secondsInWeek = secondsInDay * 7;
    const secondsInMonth = secondsInDay * 30;
    const secondsInYear = secondsInDay * 365;

    if (timeDifferenceInSeconds < secondsInMinute) {
        return 'Just now';
    } else if (timeDifferenceInSeconds < secondsInHour) {
        const minutes = Math.floor(timeDifferenceInSeconds / secondsInMinute);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < secondsInDay) {
        const hours = Math.floor(timeDifferenceInSeconds / secondsInHour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < secondsInWeek) {
        const days = Math.floor(timeDifferenceInSeconds / secondsInDay);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < secondsInMonth) {
        const weeks = Math.floor(timeDifferenceInSeconds / secondsInWeek);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < secondsInYear) {
        const months = Math.floor(timeDifferenceInSeconds / secondsInMonth);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(timeDifferenceInSeconds / secondsInYear);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

const formatUserCount = (count) => {
    if (count < 1000) {
        return count.toString();
    } else if (count < 1000000) {
        return (count / 1000).toFixed(0) + "k";
    } else if (count < 1000000000) {
        return (count / 1000000).toFixed(0) + "M";
    } else if (count < 1000000000000) {
        return (count / 1000000000).toFixed(0) + "B";
    } else {
        return (count / 1000000000000).toFixed(0) + "T";
    }
}

export { calculateTimeDifference, formatUserCount }