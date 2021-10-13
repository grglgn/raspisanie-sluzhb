package ru.el.raspisluzhb;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * User: eloginov
 * Date: 15.03.19
 */
public final class Settings {
    private String calendarUrl;
    private Date beginDate;
    private Date endDate;

    private static Object monitor = new Object();
//    private Properties props;
    private Map<String,String> props = new HashMap<String,String>();
    private DateFormat outputDateFormat;

    private static Settings instance;
    private static final String SETT_FILE = "raspis-loader-config.properties";
    private static DateFormat fmt = new SimpleDateFormat("dd-MM-yyyy");
//    private static DateFormat OUTPUT_DATE_FORMAT = new SimpleDateFormat("dd-MM-yyyy");
    private static DateFormat OUTPUT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    private Settings() {
        Properties propsTmp = new Properties();
        try (InputStream is = this.getClass().getClassLoader().getResourceAsStream(SETT_FILE)) {
            propsTmp.load(is);
        } catch (IOException ex) {
            throw new RaspisLoaderException("Failed to load " + SETT_FILE, ex);
        }
        //todo props is allowed in lambda?
        propsTmp.entrySet().stream().forEach(e->props.put((String)e.getKey(), (String)e.getValue()));
    }

    public Map<String,String> getConfPropsAll(){
        return Collections.unmodifiableMap(props);
    }

    public static <T extends V, V> T instantiateConfClass(String confName, Class<V> interfaceCls){
        String className = getInstance().getConfProperty(confName);
        try {
            Class<T> cls = (Class<T>) Class.forName(getInstance().getConfProperty(confName));
            T tInst = cls.getConstructor().newInstance();
            return tInst;
        } catch (ClassNotFoundException ce) {
            throw new RaspisLoaderException(String.format("'%s' conf property probably has a wrong value, class not found: %s",
                    confName, getInstance().getConfProperty("confName")), ce);
        } catch (NoSuchMethodException ne) {
            throw new RaspisLoaderException(
                    String.format("The specified in the '%s' conf property class doesn't have a non-arg constructor: ", confName)
                    , ne);
        } catch (IllegalAccessException | InstantiationException | InvocationTargetException e) {
            throw new RaspisLoaderException(String.format("Failed to instantiate instance of %s", className), e);
        }
    }

    public String getConfProperty(String propName){
        return props.get(propName);
    }

    public String getConfProperty(String propName, String defVal){
        String val = props.get(propName);
        return val == null ? defVal : val;
    }

    public String getProxyAdress(){
        return props.get("proxyAddress");
    }

    public int getProxyPort(){
        String p = props.get("proxyPort");
        try {
            return Integer.parseInt(p);
        } catch (NumberFormatException ne) {
            throw new RaspisLoaderException("Configured prop value 'proxyPort' is not a  number:"+p,ne);
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
            throw new RaspisLoaderException("Failed to find or parse as date the value of '" + propName + "' property", pex);
        }
        return date;
    }

    public synchronized static Settings getInstance() {
        if (instance == null) {
            synchronized (monitor) {
                if (instance == null) instance = new Settings();//"double check"
            }
        }
        return instance;
    }

    void setProp(String name, String value){
        this.props.put(name, value);
    }
}
