package ru.el.raspisluzhb;

import java.util.Date;

import static java.lang.Class.forName;

public class RaspisDataLoader {
    private static final long day_ms = 24 * 60 * 60 * 1000;
    private Date beginDate;
    private Date endDate;
    private RaspisStore store;
    private RaspisProvider provider;
    private UrlLoader urlLoader = new UrlLoader();

    public RaspisDataLoader() {
        this.beginDate = Settings.getInstance().getBeginDate();
        this.endDate = Settings.getInstance().getEndDate();
        this.provider = Settings.instantiateConfClass("raspisProvider", RaspisProvider.class);
        this.store = Settings.instantiateConfClass("raspisStore", RaspisProvider.class);

    }

    public void load() {
        assert (provider != null) : "Provider is not specified";
        assert (store != null) : "Store is not specified";
        Date dt = this.beginDate;
        store.open();
        while (dt.compareTo(this.endDate) <= 0) {
//            try (FileWriter fw = new FileWriter(fname)) {
            //handle dt
            //String url = provider.getUrl(dt);
            //String fname = "bu-" + Settings.getInstance().getOutputDateFormat().format(dt);
            //ExecutorService
            String url = provider.getUrl(dt);
            String urlContent = urlLoader.loadUrl(url);
            DayData dd = provider.parse(dt, urlContent);
            store.storeDay(dd);
                /*fw.write(urlContent);
                fw.write(LINE_SEPAR);
                fw.write("==========================================================");
                fw.write(LINE_SEPAR);
                */
            dt = new Date(dt.getTime() + day_ms);
           /* } catch (IOException ie) {
                Logger.err(ie, "Failed to write to " + fname);
            }
           */ // }


        }
        store.close();
    }
}
