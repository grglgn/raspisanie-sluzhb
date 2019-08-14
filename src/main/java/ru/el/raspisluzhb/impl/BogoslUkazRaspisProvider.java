package ru.el.raspisluzhb.impl;

import ru.el.raspisluzhb.DayData;
import ru.el.raspisluzhb.RaspisProvider;
import ru.el.raspisluzhb.Settings;

import java.text.DateFormat;
import java.util.Date;

/**
 * User: eloginov
 * Date: 03.04.19
 */
public class BogoslUkazRaspisProvider implements RaspisProvider {
    private String urlTpl = Settings.getInstance().getCalendarUrl();
    private DateFormat df = Settings.getInstance().getOutputDateFormat();

    @Override
    public String getUrl(Date dt) {
        String res = urlTpl.replaceFirst("\\$dt", df.format(dt.getTime()));
        return res;
    }

    @Override
    public DayData parse(Date dt, String pageContent) {
        byte weekDay=1;
        byte day=1;
        String descr = "Test descr";
        String cht = "Test chten";
        DayData dd = new DayData(dt,weekDay, day,descr,cht);
        return dd;
    }
}
