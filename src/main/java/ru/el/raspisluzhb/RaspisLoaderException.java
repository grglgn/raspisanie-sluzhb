package ru.el.raspisluzhb;

/**
 * Created with IntelliJ IDEA.
 * User: eloginov
 * Date: 15.03.19
 * Time: 20:07
 * To change this template use File | Settings | File Templates.
 */
public class RaspisLoaderException extends RuntimeException {
    public RaspisLoaderException(String msg, Throwable t){
        super(msg,t);
    }

    public RaspisLoaderException(String msg) {
        super(msg);
    }
}
