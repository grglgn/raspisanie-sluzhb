package ru.el.raspisluzhb.impl;

import ru.el.raspisluzhb.DayData;
import ru.el.raspisluzhb.Logger;
import ru.el.raspisluzhb.RaspisStore;
import ru.el.raspisluzhb.Settings;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;

public class FileRaspisStore implements RaspisStore {
    @Override
    public void open() {

    }

    @Override
    public void storeDay(DayData dd) {
        String fname = "bu-" + Settings.getInstance().getOutputDateFormat().format(dd.date);
        //while (dt.before(endDate)) {
            try (FileWriter fw = new FileWriter(fname)) {
                //handle dt
                //String url = provider.getUrl(dt);
                //ExecutorService

                /*fw.write(urlContent);
                fw.write(LINE_SEPAR);
                fw.write("==========================================================");
                fw.write(LINE_SEPAR);
                */
            } catch (IOException ie) {
                Logger.err(ie, "Failed to write to " + fname);
            }
    }

    @Override
    public void close() {

    }
}
