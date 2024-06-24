package com.personal.drawingGame.common.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class PropUtil {
    /**
     * 프로퍼티를 로드하여 가져온다.
     *
     * @param filePath
     */
    public static Properties getProperties(String filePath) throws IOException {
        System.out.println(">>>>>>>>> FILEPATH : " + filePath);
        // Resource resource =
        // ApplicationContextProvider.getApplicationContext().getResource("classpath:" +
        // filePath);

        // // Docker 실행시 resource.getFile() 에러로 인해 추가..
        // InputStream inputStream = resource.getInputStream();
        // String fileName = filePath.substring(0, filePath.lastIndexOf("."));
        // String fileType = filePath.substring(filePath.lastIndexOf("."),
        // filePath.length()-1);
        // File temp = File.createTempFile(fileName, fileType);
        // FileUtils.copyInputStreamToFile(inputStream, temp);
        // Properties prop = new Properties();

        // prop.load(new FileInputStream(resource.getFile()));
        // prop.load(new FileInputStream(temp));

        // return prop;
        Resource resource = new ClassPathResource(filePath);
        Properties prop = new Properties();
        prop.load(resource.getInputStream());

        return prop;
    }

    /**
     * 프로퍼티 객체를 맵으로 변환하여 가져온다.
     *
     * @param filePath
     * @return
     */
    public static Map<String, String> getPropertiesAsMap(String filePath) throws IOException {

        Map<String, String> propMap = new HashMap<>();
        Properties props = getProperties(filePath);
        for (String key : props.stringPropertyNames()) {
            propMap.put(key, props.getProperty(key));
        }

        return propMap;
    }
}
