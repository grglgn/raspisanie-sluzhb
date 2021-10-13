package ru.el.raspisluzhb;

import java.util.Date;

/**
 * User: eloginov
 * Date: 03.04.19
 */
public interface RaspisProvider {
    String getUrl(Date dt);
    DayData parse(Date dt, String pageContent);
}
