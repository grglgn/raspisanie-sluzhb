package ru.el.raspisluzhb;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.logging.Level;

/**
 * User: eloginov
 * Date: 15.03.19
 */
public class Settings {
    private String calendarUrl;
    private Date beginDate;
    private Date endDate;
    private static Object monitor = new Object();
    private Properties props;
    private DateFormat outputDateFormat;

    private static Settings instance;
    private static final String SETT_FILE = "raspis-loader-config.properties";
    private static DateFormat fmt = new SimpleDateFormat("dd-MM-yyyy");
    private static DateFormat OUTPUT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    public Settings() {
        props = new Properties();
        try (InputStream is = this.getClass().getClassLoader().getResourceAsStream(SETT_FILE)) {
            props.load(is);
        } catch (IOException ex) {
            throw new RaspisLoaderException("Failed to load " + SETT_FILE, ex);
        }
    }


    public String getCalendarUrl() {
        if (calendarUrl == null) calendarUrl = (String) props.get("calendarUrl");
        return calendarUrl;
    }

    public DateFormat getOutputDateFormat() {
        if (outputDateFormat == null) {
            String odf = (String) props.get("outputDateFormat");
            if (odf == null) outputDateFormat = OUTPUT_DATE_FORMAT;
            else outputDateFormat = new SimpleDateFormat(odf);
        }
        return outputDateFormat;
    }

    public Date getBeginDate() {
        if (beginDate == null) {
            beginDate = obtainDateProp("beginDate");
        }
        return beginDate;
    }

    public Date getEndDate() {
        if (endDate == null) {
            endDate = obtainDateProp("endDate");
        }
        return endDate;
    }

    private Date obtainDateProp(String propName) {
        String pv = (String) props.get(propName);
        Date date;
        try {
            date = fmt.parse(pv);
        } catch (ParseException pex) {
            throw new RaspisLoaderException("failed to obtain or parse " + propName + " prop", pex);
        }
        return date;
    }

    public synchronized static Settings getInstance() {
        if (instance == null) {
            synchronized (monitor) {
                if (instance == null) instance = new Settings();//"double check" - dont remove
            }
        }
        return instance;
    }

}
