package ru.el.raspisluzhb;

import java.util.Date;

/**
 * User: eloginov
 * Date: 18.03.19
 */
public class DayData {
    public final Date date;
    public final int weekDay;
    public final int day;
    public final String description;
    public final String chteniya;
    public final String weekDayStr;

    public DayData(Date date, String wDayStr, int day, String description, String chteniya) {
        this.date = date;
        this.weekDayStr = wDayStr;
        this.weekDay = -1;
        this.day = day;
        this.description = description;
        this.chteniya = chteniya;
    }

    public DayData(Date date, int wday, int day, String description, String chteniya) {
        this.date = date;
        this.weekDayStr = "";
        this.weekDay = wday;
        this.day = day;
        this.description = description;
        this.chteniya = chteniya;
    }


    //@Override
    public String toString() {
        return "DayData{" +
                "date=" + date +
                ", weekDayStr=" + weekDayStr +
                ", day=" + day +
                ", description='" + description + '\'' +
                ", chteniya='" + chteniya + '\'' +
                '}';
    }
}
