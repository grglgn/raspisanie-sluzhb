package ru.el.raspisluzhb;

import java.util.function.Supplier;

/**
 * User: eloginov
 * Date: 15.03.19
 */
public class Logger {
    public static final java.util.logging.Logger log = java.util.logging.Logger.getLogger("RaspisManager");

    public static void err(Throwable t, String m){
        //ru.el.raspisluzhb.Logger.log.log(Level.SEVERE, m, t);
        System.out.println(m);
        t.printStackTrace();
    }

    public static void d(String m){
        //ru.el.raspisluzhb.Logger.log.log(Level.FINE, m);
        System.out.println(m);
    }

    public static boolean isDebugEnabled(){
        return true;
    }

    public static void d(Supplier<String> sup) {
        if (isDebugEnabled()) {
            System.out.println(sup.get());
        }
    }



    public static void d(String f, Object...args){
        //ru.el.raspisluzhb.Logger.log.log(Level.FINE, m);
        System.out.printf(f, args);
    }

}
