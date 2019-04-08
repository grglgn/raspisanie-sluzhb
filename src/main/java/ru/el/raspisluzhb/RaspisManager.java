package ru.el.raspisluzhb;

import java.io.*;
import java.util.Date;

/**
 * User: eloginov
 * Date: 14.03.19
 */
public class RaspisManager {
    //private String url;
    private Date beginDate;
    private Date endDate;
    private static final long day_ms = 24*60*60*1000;
    private Settings settings = Settings.getInstance();
    //public static final String LINE_SEPAR = System.lineSeparator();
    private UrlLoader loader = new UrlLoader();
    private RaspisProvider provider;
    private RaspisStore store;

    public void load(){
        assert (provider != null):"Provider is not specified";
        assert (store != null):"Store is not specified";
        //URL calendUrl = new URL()
        //URLConnection conn = new HttpURLConnection();
        //todo get date range from begin to end
        // and iterate
        beginDate = settings.getBeginDate();
        endDate = settings.getEndDate();
        Date dt = beginDate;
        String fname = "bu-data.txt";
        store.begin();
        try (FileWriter fw = new FileWriter(fname)) {
            while (dt.before(endDate)) {
                //handle dt
                String url = provider.getUrl(dt);
                //String fname = "bu-"+settings.getOutputDateFormat().format(cl.getTime());
                String urlContent = loader.loadUrl(url);
                DayData dd = provider.parse(urlContent);
                store.storeDay(dd);
                /*fw.write(urlContent);
                fw.write(LINE_SEPAR);
                fw.write("==========================================================");
                fw.write(LINE_SEPAR);
                dt = new Date(dt.getTime() + day_ms);*/
            }
        } catch (IOException ie) {
            Logger.err(ie, "Failed to write to " + fname);
        }
        store.end();
    }

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Settings getSettings() {
        return settings;
    }

    public void setSettings(Settings settings) {
        this.settings = settings;
    }

    public UrlLoader getLoader() {
        return loader;
    }

    public void setLoader(UrlLoader loader) {
        this.loader = loader;
    }

    public RaspisProvider getProvider() {
        return provider;
    }

    public void setProvider(RaspisProvider provider) {
        this.provider = provider;
    }

    public RaspisStore getStore() {
        return store;
    }

    public void setStore(RaspisStore store) {
        this.store = store;
    }

    public static void main(String[] args) {
        RaspisManager mgr = new RaspisManager();
        mgr.load();
    }
}
