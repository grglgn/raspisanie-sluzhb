package ru.el.raspisluzhb;

import java.text.DateFormat;
import java.util.Date;

/**
 * User: eloginov
 * Date: 03.04.19
 */
public class BogoslUkazRaspisProvider implements RaspisProvider{
    private String urlTpl = Settings.getInstance().getCalendarUrl();
    private DateFormat df = Settings.getInstance().getOutputDateFormat();

    @Override
    public String getUrl(Date dt) {
        String res = urlTpl.replaceFirst("\\$dt", df.format(dt.getTime()));
        return res;
    }

    @Override
    public DayData parse(String pageContent) {
        DayData dd = new DayData();
        return dd;
    }
}
