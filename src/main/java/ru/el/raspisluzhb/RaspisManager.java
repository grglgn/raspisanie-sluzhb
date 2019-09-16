package ru.el.raspisluzhb;

import java.io.*;
import java.util.Date;
import java.util.concurrent.ExecutorService;

/**
 * User: eloginov
 * Date: 14.03.19
 */
public class RaspisManager {
    //public static final String LINE_SEPAR = System.lineSeparator();

    public void load(){
        //URL calendUrl = new URL()
        //URLConnection conn = new HttpURLConnection();
        //todo get date range from begin to end
        // and iterate
        RaspisDataLoader loader = new RaspisDataLoader();
        loader.load();
    }

    public static void main(String[] args) {
        RaspisManager mgr = new RaspisManager();
        mgr.load();
        //Logger.d("Settings:"+Settings.getInstance().getConfPropsAll());
    }
}
