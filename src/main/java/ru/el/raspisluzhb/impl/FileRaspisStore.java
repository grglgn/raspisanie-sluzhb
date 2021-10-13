package ru.el.raspisluzhb.impl;

import ru.el.raspisluzhb.DayData;
import ru.el.raspisluzhb.Logger;
import ru.el.raspisluzhb.RaspisStore;
import ru.el.raspisluzhb.Settings;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;

public class FileRaspisStore implements RaspisStore {
    protected File storeDir = null;

    @Override
    public void open() {
        String confStoreDirName =
                Settings.getInstance().getConfProperty(
                        "raspisFileStoreDir", "RASPIS_STORE");
        storeDir = new File(confStoreDirName);
        if (!storeDir.exists()) storeDir.mkdirs();
    }

    @Override
    public void storeDay(DayData dd) {
        String fname = String.format("bu-%s.txt", Settings.getInstance().getOutputDateFormat().format(dd.date));
        File f = new File(storeDir, fname);
        try (FileWriter fw = new FileWriter(f)) {
            fw.write(dd.description);
        } catch (IOException ie) {
            Logger.err(ie, "Failed to write to " + fname);
        }
    }

    @Override
    public void close() {

    }
}
