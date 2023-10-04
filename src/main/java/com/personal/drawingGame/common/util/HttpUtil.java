package com.personal.drawingGame.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * HTTP 요청용 Util 클래스
 */
@Slf4j
public class HttpUtil {

    private static final String METHOD_TYPE_POST = "POST";

    private static final String METHOD_TYPE_GET = "GET";
    private static final String USER_AGENT = "Mozilla/5.0";
    private static final String DATA = "test data";

    /**
     * 포스트 요청을 실행한다.
     * @param urlStr
     * @return
     */
    public static Map<String, Object> doPost(String urlStr) {
        Map<String, Object> response = null;
        try {
            URL url = new URL(urlStr);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod(METHOD_TYPE_POST);
            connection.setRequestProperty("User-Agent", USER_AGENT);
            connection.setDoOutput(true);

            DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream());
            outputStream.writeBytes(DATA);
            outputStream.flush();
            outputStream.close();

            int responseCode = connection.getResponseCode();
            log.debug("response CODE ==> {}", responseCode);

            response = getResponse(connection.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }

    /**
     * GET 요청을 실행한다.
     * @param urlStr
     * @return
     */
    public static Map<String, Object> doGet(String urlStr) {
        Map<String, Object> response = null;
        try {
            URL url = new URL(urlStr);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod(METHOD_TYPE_GET);
            connection.setRequestProperty("User-Agent", USER_AGENT);

            int responseCode = connection.getResponseCode();
            log.debug("responseCode ==> {}", responseCode);

            response = getResponse(connection.getInputStream());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }


    /**
     * 파라미터 맵을 QueryString 형태로 변환환다.
     * @param params
     * @return
     */
    public static String paramToQueryString(Map<String, Object> params) {
        StringBuilder sb =  new StringBuilder();
        sb.append("?");
        int cnt = 0;
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());
            if (cnt < params.size() - 1) {
                sb.append("&");
            }
            cnt++;
        }
        return sb.toString();
    }

    /**
     * JAXSON을 이용하여 response String을 Map으로 변환한다.
     * @param response
     * @return
     * @throws JsonProcessingException
     */
    public static Map<String, Object> responseStrToMap(String response) throws JsonProcessingException {
        ObjectMapper om = new ObjectMapper();
        Map<String, Object> responseMap = new HashMap<>();
        if (!response.isBlank()) {
            if (response.startsWith("_ChunjaeSSOEncData") && response.contains("=")) {
                String[] resArr = response.split("=");
                responseMap.put(resArr[0].trim(), resArr[1].trim());
            } else if (response.startsWith("<!DOCTYPE html>") || response.startsWith("<html>")) {
                // #. response가 html로 넘어올 때 방지
                responseMap.put("html", response);
            } else {
                responseMap = om.readValue(response, Map.class);
            }
        }
        return responseMap;
    }


    /////////////////////////////////////////////////////// private /////////////////////////////////////


    /**
     * connection에 대한 RES를 얻는다.
     * @param is
     * @return
     * @throws IOException
     */
    private static Map<String, Object> getResponse(InputStream is) throws IOException, JsonProcessingException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is));
        StringBuffer stringBuffer = new StringBuffer();
        String inputLine;

        while ((inputLine = bufferedReader.readLine()) != null)  {
            stringBuffer.append(inputLine);
        }
        bufferedReader.close();

        String response = stringBuffer.toString();
        return responseStrToMap(response);
    }
}
