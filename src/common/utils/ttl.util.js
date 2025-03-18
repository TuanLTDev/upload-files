export class CacheTTL {
    static SECOND = 1000;

    static MINUTE = this.SECOND * 60;

    static HOUR = this.MINUTE * 60;

    static DAY = this.HOUR * 24;

    static WEEK = this.DAY * 7;

    static MONTH = this.DAY * 30;

    static seconds(n) {
        return n * this.SECOND;
    }

    static minutes(n) {
        return n * this.MINUTE;
    }

    static hours(n) {
        return n * this.HOUR;
    }

    static days(n) {
        return n * this.DAY;
    }

    static weeks(n) {
        return n * this.WEEK;
    }

    static months(n) {
        return n * this.MONTH;
    }
}
