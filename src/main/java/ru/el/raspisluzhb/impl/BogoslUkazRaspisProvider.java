package ru.el.raspisluzhb.impl;

import ru.el.raspisluzhb.DayData;
import ru.el.raspisluzhb.RaspisProvider;
import ru.el.raspisluzhb.Settings;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * User: eloginov
 * Date: 03.04.19
 */
public class BogoslUkazRaspisProvider implements RaspisProvider {
    private String urlTpl = Settings.getInstance().getCalendarUrl();
    private DateFormat df = Settings.getInstance().getOutputDateFormat();

    @Override
    public String getUrl(Date dt) {
        String res = urlTpl.replaceFirst("\\$dt", df.format(dt.getTime()));
        return res;
    }

    private static final java.util.regex.Pattern titlePt =
            Pattern.compile("<title>.*</title>");

    @Override
    public DayData parse(Date dt, String pageContent) {
        String weekDay = "";
        int day=dt.getDate();
//        Matcher m = titlePt.matcher(pageContent);
//        if (!m.find()) throw new IllegalStateException("No matches found");
        String descr = "";//m.group();

        int pos = pageContent.indexOf("<div class=\"main\" id=\"main\">");
        if (pos > -1){
            pos = pageContent.indexOf("<br><p> <b>", pos);
            if (pos > -1){
                int dotInd = pageContent.indexOf('.', pos);

                //получаем день недели - до первой точки
                String wdayStr = pageContent.substring(pos, dotInd);
                //обрезаем хвост спереди- теги
                wdayStr = wdayStr.substring(wdayStr.lastIndexOf('>')+1);
                weekDay=wdayStr.trim();

                //полчакм описание дня - до прямого слеша
                descr = pageContent.substring(dotInd+1,
                        pageContent.indexOf('<',dotInd)).trim();
            }
        }
//        String descr = titlePt.matcher(pageContent).group();
        String cht = "unknown";
        //Calendar cn = Calendar..getInstance();
        //cn.

        DayData dd = new DayData(dt, weekDay, day, descr, cht);

        return dd;
    }



    public static void main(String[] args) {
        BogoslUkazRaspisProvider p = new BogoslUkazRaspisProvider();

        String dayFilePath = "c:\\Users\\grglgn\\prj\\raspisanie-sluzhb\\RASPIS_STORE\\bu-2019-09-05.txt";
//        File dayFile = new File("c:\\Users\\grglgn\\prj\\raspisanie-sluzhb\\RASPIS_STORE\\bu-2019-09-05.txt");
//        StringWriter sw= StringWriter();
//        try(FileReader fr = new FileReader(dayFile)){
        try{
            String str = new String(Files.readAllBytes(Paths.get(dayFilePath)));
BogoslUkazRaspisProvider pr = new BogoslUkazRaspisProvider();
DayData dd = pr.parse(new Date(),str);
            System.out.println("DayData:"+dd);

        } catch(IOException fnf){
            fnf.printStackTrace();
        }
    }
}
