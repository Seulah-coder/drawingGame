package com.personal.drawingGame.common.util;

import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class FileUtil {

    public static Map<String, Object> convertBase64StringToImage(String url, String roomCode, String realPath) { //save 기능 존재
        Map<String, Object> result = new HashMap<>();
        System.out.println("convertBase64StringToImage = " + "이미지 저장!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        try {
            //폴더 생성
            File Folder = new File(realPath +"/" + roomCode);
            if (!Folder.exists()) {
                try {
                    Folder.mkdir(); //폴더 생성합니다.
                } catch (Exception e) {
                    e.getStackTrace();
                }
            }

            if (!"".equals(url)) {

                String[] separatedUrl = url.split(",");
                byte[] imageBytes = DatatypeConverter.parseBase64Binary(separatedUrl[1]);
                String fileType = separatedUrl[0].split(";")[0].split("/")[1];
                BufferedImage bufImg = ImageIO.read(new ByteArrayInputStream(imageBytes));

                System.out.println("bufImg = " + bufImg);


                String fileName = roomCode + "/" + roomCode  + UUID.randomUUID() + "."+ fileType;
                /**book id 폴더에 item id 파일명_1 */

                File file = new File(realPath + fileName);

                ImageIO.write(bufImg, fileType, file);

                result.put("file", file);
                result.put("fileName", fileName);

            }
            System.out.println("convertBase64StringToImage = " + "이미지 저장 종료!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            return result;

        } catch (IOException e) {
            return result;
        }

    }
}
