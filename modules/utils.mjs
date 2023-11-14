class Utilities {
    constructor(args) {
        //this.daysToHours = this.daysToHours;
    }
    daysToHours(durationInDays) {
        // Convert days to hours
        const durationInHours = durationInDays * 24;
        // Format the duration as HH:mm
        const hours = Math.floor(durationInHours);
        const minutes = Math.round((durationInHours - hours) * 60);
        // Format the result as "HH:mm"
        const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
        return formattedDuration;
    }
}

export default Utilities;