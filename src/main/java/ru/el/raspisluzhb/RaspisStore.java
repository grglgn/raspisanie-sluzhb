package ru.el.raspisluzhb;

/**
 * User: eloginov
 * Date: 03.04.19
 */
public interface RaspisStore {
    void open();
    void storeDay(DayData dd);
    void close();
}
