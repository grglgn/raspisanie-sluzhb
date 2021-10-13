package ru.el.raspisluzhb;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.*;

/**
 * User: eloginov
 * Date: 02.04.19
 */
public class UrlLoader {
    public String loadUrl(String url){
            try {
                URL urlObj = new URL(url);
                String proxyAddr = Settings.getInstance().getProxyAdress();
                HttpURLConnection conn;
                if (proxyAddr != null){
                    Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyAddr, 8080));
                    conn = (HttpURLConnection)urlObj.openConnection(proxy);
                } else {
                    conn = (HttpURLConnection)urlObj.openConnection();
                }
                StringWriter sw = new StringWriter();
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(conn.getInputStream(),"utf-8"))){
                    char[] buf = new char[2048];
                    int read;
                    while ((read = br.read(buf)) != -1){
                        sw.write(buf,0,read);
                    }
                } catch (IOException iex){
                    //throw new RaspisLoaderException("Connection failed for: "+url, iex);
                    Logger.err(iex, "Не получилось загрузить "+url);
                }
                conn.disconnect();
                return sw.toString();

            } catch (MalformedURLException mue){
                throw new RaspisLoaderException("Failed to create url: "+url, mue);
            } catch (IOException iex2){
                throw new RaspisLoaderException("Connection failed for: "+url, iex2);
            }
        }
}
