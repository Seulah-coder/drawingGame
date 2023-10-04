package com.personal.drawingGame.common.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class JsonUtil {
    public JsonUtil() {
    }

    public static JSONObject createHeaderJson() throws JSONException {
        return createHeaderJson(true, "");
    }

    public static JSONObject createHeaderJson(boolean success, String message) throws JSONException {
        JSONObject jsonHeader = new JSONObject();
        jsonHeader.put("success", success);
        jsonHeader.put("message", message);
        return jsonHeader;
    }


    public static JSONObject createBodyJson(String name, JSONObject jsonObject) throws JSONException {
        JSONObject jsonBody = new JSONObject();
        if (jsonObject != null) {
            jsonBody.put(name, jsonObject);
        } else {
            jsonBody.put(name, JSONObject.NULL);
        }

        return jsonBody;
    }

    public static JSONObject createBodyJson(String name, JSONArray jsonArray) throws JSONException {
        JSONObject jsonBody = new JSONObject();
        if (jsonArray != null) {
            jsonBody.put(name, jsonArray);
        } else {
            jsonBody.put(name, new JSONArray());
        }

        return jsonBody;
    }

    public static JSONObject createResponseJson(String name, JSONObject jsonObject) throws JSONException {
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("header", createHeaderJson());
        jsonResponse.put("body", createBodyJson(name, jsonObject));
        return jsonResponse;
    }

    public static JSONObject createResponseJson(String name, JSONArray jsonArray) throws JSONException {
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("header", createHeaderJson());
        jsonResponse.put("body", createBodyJson(name, jsonArray));
        return jsonResponse;
    }

    public static JSONObject createResponseJson(JSONObject jsonBody) throws JSONException {
        return createResponseJson((JSONObject)null, jsonBody);
    }

    public static JSONObject createResponseJson() throws JSONException {
        return createResponseJson((JSONObject)((JSONObject)null), (JSONObject)null);
    }

    public static JSONObject createResponseJson(JSONObject jsonHeader, JSONObject jsonBody) throws JSONException {
        if (jsonHeader == null) {
            jsonHeader = createHeaderJson();
        }

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("header", jsonHeader);
        if (jsonBody != null) {
            jsonResponse.put("body", jsonBody);
        } else {
            jsonResponse.put("body", JSONObject.NULL);
        }

        return jsonResponse;
    }

    public static Map<String,Object> jsonToMap(String jsonString) throws Exception {
        if (null == jsonString || "".equals(jsonString)) return null;
        ObjectMapper mapper = new ObjectMapper();
        Map<String,Object> map = new HashMap<String,Object>();
        map = mapper.readValue(jsonString, new TypeReference<Map<String,Object>>(){});
        return map;
    }
}
