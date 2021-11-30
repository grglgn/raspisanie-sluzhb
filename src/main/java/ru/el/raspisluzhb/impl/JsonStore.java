package ru.el.raspisluzhb.impl;

import org.json.simple.JSONObject;
import ru.el.raspisluzhb.DayData;
import ru.el.raspisluzhb.RaspisLoaderException;
import ru.el.raspisluzhb.RaspisStore;
import ru.el.raspisluzhb.Settings;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class JsonStore extends FileRaspisStore {

    Writer storeW;
    JSONObject root;


    @Override
    public void open() {
        super.open();
        this.root = new JSONObject();
        try {
            this.storeW = new BufferedWriter(
                    new OutputStreamWriter(
                        new FileOutputStream(
                            new File(storeDir,"bu-data.js")),
                        Charset.forName("utf-8")));

                    //(new File(storeDir,"bu-data.js")).getAbsolutePath(), Charset.forName("utf-8").newEncoder());
//            new PrintWriter(new File(storeDir,"bu-data.js"), Charset.forName("utf-8").newEncoder());

        } catch(IOException ie){
            throw new RaspisLoaderException("Failed to open store file",ie);
        }

    }

    @Override
    public void storeDay(DayData dd) {
        String key = Settings.getInstance().getOutputDateFormat().format(dd.date);
        JSONObject dayJson = new JSONObject();
        dayJson.put("weekDay",dd.weekDay);
        //dayJson.put("day",dd.day);
        dayJson.put("dsc",dd.description);
        root.put(key, dayJson);
    }

    @Override
    public void close() {
        try {
            this.storeW.write(root.toString());
            this.storeW.close();
        } catch(IOException ie){
            throw new RaspisLoaderException("Failed to close store file",ie);
        }
    }
}
