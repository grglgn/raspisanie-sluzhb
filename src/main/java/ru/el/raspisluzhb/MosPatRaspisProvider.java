package ru.el.raspisluzhb;

import java.util.Date;

public class MosPatRaspisProvider implements RaspisProvider {
    @Override
    public String getUrl(Date dt) {
        return null;
    }

    @Override
    public DayData parse(Date dt, String pageContent) {
        return null;
    }
}
