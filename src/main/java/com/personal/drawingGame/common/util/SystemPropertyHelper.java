package com.personal.drawingGame.common.util;

import java.util.Map;

public class SystemPropertyHelper {
    private static Map<String, String> props;
    private static final String SYSTEM_PROPERTIES = "/system.config.properties";

    static {
        try {
            props = PropUtil.getPropertiesAsMap(SYSTEM_PROPERTIES);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Key에 해당하는 시스템 변수를 가져온다.
     * @param key
     * @return
     */
    public static String getProperty(String key) {
        return props.get(key);
    }
}
