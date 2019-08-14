package ru.el.raspisluzhb;

import java.util.Date;

/**
 * User: eloginov
 * Date: 18.03.19
 */
public class DayData {
    public final Date date;
    public final  byte weekDay;
    public final byte day;
    public final String description;
    public final String chteniya;

    public DayData(Date date, byte weekDay, byte day, String description, String chteniya) {
        this.date = date;
        this.weekDay = weekDay;
        this.day = day;
        this.description = description;
        this.chteniya = chteniya;
    }
}
