package com.personal.drawingGame.common.util;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.json.JsonParseException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ApiType {
    protected static final Logger logger = LoggerFactory.getLogger(ApiType.class);

    /**
     * 수학 제외 기타 과목 OCR => NaverOCR 사용
     * @param url
     * @param param
     * @return
     * @throws Exception
     */
    public static Map<String, Object> postNaverOcrApi(String url, Map<String, Object> param) throws Exception {
        Map<String,Object> map = new HashMap<String,Object>();
        Map<String,Object> imgMap = new HashMap<String,Object>();
        StringBuilder result = new StringBuilder();
        HttpClient httpClient = null;
        imgMap.put("format", "jpeg");
        imgMap.put("name", TypeUtil.stringValue(param.get("item_id")));
//        String src = "https://"+TypeUtil.stringValue(param.get("bucketName"))+".s3." + TypeUtil.stringValue(param.get("region"))+".amazonaws.com/" + TypeUtil.stringValue(param.get("img_path"));
//        imgMap.put("url", src);
//        imgMap.put("url", StringUtil.stringNull(param.get("domain"))+StringUtil.stringNull(param.get("imgUrl")));
        List<Map<String,Object>> imgList = new ArrayList<>();
        imgList.add(imgMap);
        map.put("images", imgList);
        map.put("lang", "ko");
        map.put("requestId", "string");
        map.put("resultType", "string");
        map.put("version", "V1");
        map.put("timestamp", 0);

        JSONObject json =  new JSONObject(map);

        HttpPost http = new HttpPost(url);
        httpClient = HttpClientBuilder.create().build();

        http.setEntity(new StringEntity(String.valueOf(json), ContentType.APPLICATION_JSON));
        http.setHeader("Content-Type", "application/json");
        http.setHeader("X-OCR-SECRET", "");
        try {
            HttpResponse response = httpClient.execute(http);

            BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
            String line = null;
            while ((line = br.readLine()) != null) {
                result.append(line);
            }
            int statusCode = response.getStatusLine().getStatusCode();
            if (200 != statusCode) {
                // throw new Exception("Failed : Http Status Code = "+statusCode+", Message
                // ="+Utility.jsonToMap(result.toString()).get("error"));
            }
        } catch (Exception e) {
            throw e;
        } finally {
            http.releaseConnection();
        }
        logger.debug("!!!!!!!!!!!!!!!postNaverOcrApi!!!!!!!!!!!!!!");
        logger.debug(result.toString());
        JSONObject setData = new JSONObject(result.toString());
        map = getMapFromJsonObject( ( JSONObject ) setData );
        return map;
    }

    public static Map<String, Object> getMapFromJsonObject( JSONObject jsonObj ){
        Map<String, Object> map = null;

        try {
            map = new ObjectMapper().readValue(jsonObj.toString(), Map.class) ;
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;
    }
}
