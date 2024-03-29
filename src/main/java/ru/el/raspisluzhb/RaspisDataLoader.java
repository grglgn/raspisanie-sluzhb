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
        this.store = Settings.instantiateConfClass("raspisStore", RaspisStore.class);

    }

    public void load() {
        assert (provider != null) : "Provider is not specified";
        assert (store != null) : "Store is not specified";
        Date dt = this.beginDate;
        store.open();
        while (dt.compareTo(this.endDate) <= 0) {
            String url = provider.getUrl(dt);
            Logger.d(()->"Connecting to "+url);
            //String urlContent = urlLoader.loadUrl(url);
            Logger.d(()->"Parsing... ");
            DayData dd = provider.parse(dt, url);
            Logger.d(()->"Storing... ");
            store.storeDay(dd);
            Logger.d(()->"Done for "+Settings.getInstance().
                    getOutputDateFormat().format(dd.date));
            dt = new Date(dt.getTime() + day_ms);
        }
        store.close();
    }
}
